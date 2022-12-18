import { Express } from 'express'
import { networkInterfaces } from 'os'
import http from 'http'
import ws, {WebSocketServer} from 'ws'
import colors from "colors/safe"
import { TradeBot } from '../../../TradeBot'
import { initExpress } from './express'
import { useConfig } from '../../../config'
import {HandleError} from '../../../decorators'
import {registerExpressRoutes, registerWSSHandler} from "./trpc"

export class ApiService {
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
    const config = useConfig()
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
      console.info(`${colors.blue('[i]')} TradeBot is online on: `)
      if (config.api.host === '0.0.0.0') {
        const nets = networkInterfaces()
        const ipAddresses: string[] = []
        for (let net in nets) {
          nets[net]?.forEach(n => {
            if (n.family === 'IPv4')
              ipAddresses.push(n.address)
          })
        }
        console.info(`    ${colors.blue('[i]')} REST API:`)
        for (let addr of ipAddresses) {
          console.info(`        ${colors.grey('-')} http://${addr}:${config.api.port}/`)
        }
        console.info(`    ${colors.blue('[i]')} WebSocket:`)
        for (let addr of ipAddresses) {
          console.info(`        ${colors.grey('-')} ws://${addr}:${config.api.port}/`)
        }
      } else {
        console.info(`    ${colors.blue('[i]')} REST API - http://${config.api.host}:${config.api.port}/`)
        console.info(`    ${colors.blue('[i]')} WebSocket - ws://${config.api.host}:${config.api.port}/`)
      }
    })
  }
}
