import { Express } from 'express'
import http from 'http'
import ws, {WebSocketServer} from 'ws';
import { TradeBot } from '../../TradeBot'
import { initExpress } from './express'
import { config } from '../../config'
import {HandleError} from "../../utils";
import {registerExpressRoutes, registerWSSHandler} from "./trpc";

export class BotApi {
  private readonly tradeBot: TradeBot
  private express: Express
  private wss: WebSocketServer
  private http: http.Server

  constructor(tradeBot: TradeBot){
    this.tradeBot = tradeBot
    this.configureServers()
  }

  @HandleError()
  private async configureServers(){
    this.express = initExpress(this.tradeBot)
    registerExpressRoutes({
      tradeBot: this.tradeBot,
      express: this.express
    })
    this.http = http.createServer(this.express)
    this.wss = new ws.Server({
      server: this.http
    })
    registerWSSHandler({
      wss: this.wss,
      tradeBot: this.tradeBot
    })
    this.http.listen(config.api.port, () => {
      console.info(`[i] TradeBot is online on: `)
      console.info(`  [i] REST API - http://${config.api.host}:${config.api.port}/`)
      console.info(`  [i] WebSocket - ws://${config.api.host}:${config.api.port}/`)
    })
  }
}
