import { TradeBot } from 'src/TradeBot'
import { Express } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { createWebSocketServer } from './ws'
import { expressApp } from './rest'
import { config } from '../../config'

export class BotApi {
  private readonly _tradeBot: TradeBot
  private _restServer: Express
  private _webSocketServer: Server
  private _httpServer: http.Server

  constructor(tradeBot: TradeBot){
    this._tradeBot = tradeBot
    this.configureServers()
  }

  private async configureServers(){
    this._restServer = expressApp
    this._restServer.set('tradeBot', this._tradeBot)
    const { httpServer, webSocketServer } = createWebSocketServer({
      tradeBot: this._tradeBot,
      expressApp: this._restServer
    })
    this._httpServer = httpServer
    this._webSocketServer = webSocketServer
    this._httpServer.listen(config.api.port, () => {
      console.info(`[i] TradeBot is online on: `)
      console.info(`  [i] REST API - http://${config.api.host}:${config.api.port}/`)
      console.info(`  [i] WebSocket - ws://${config.api.host}:${config.api.port}/`)
    })
  }

  public get webSocketServer(): Server { return this._webSocketServer }
  public get httpServer(): http.Server { return this._httpServer }
}
