import { Express } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import ws, {WebSocketServer} from 'ws';
import { TradeBot } from '../../TradeBot'
import { createWebSocketServer } from './ws'
import { initExpress } from './rest'
import { config } from '../../config'
import {HandleError} from "../../utils";
import {registerExpressRoutes, registerWSSHandler} from "./trpc";

export class BotApi {
  private readonly _tradeBot: TradeBot
  private express: Express
  private _webSocketServer: WebSocketServer
  private _httpServer: http.Server

  constructor(tradeBot: TradeBot){
    this._tradeBot = tradeBot
    this.configureServers()
  }

  @HandleError()
  private async configureServers(){
    this.express = initExpress(this._tradeBot)
    registerExpressRoutes({
      tradeBot: this._tradeBot,
      express: this.express
    })
    const { httpServer, webSocketServer } = createWebSocketServer({
      tradeBot: this._tradeBot,
      expressApp: this.express
    })
    this._httpServer = httpServer
    this._webSocketServer = new ws.Server({
      server: this._httpServer
    })
    registerWSSHandler({
      wss: this._webSocketServer,
      tradeBot: this._tradeBot
    })
    this._httpServer.listen(config.api.port, () => {
      console.info(`[i] TradeBot is online on: `)
      console.info(`  [i] REST API - http://${config.api.host}:${config.api.port}/`)
      console.info(`  [i] WebSocket - ws://${config.api.host}:${config.api.port}/`)
    })
  }

  //public get webSocketServer(): Server { return this._webSocketServer }
  public get httpServer(): http.Server { return this._httpServer }
}
