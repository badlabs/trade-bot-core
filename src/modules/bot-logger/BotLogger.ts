import fs from 'fs'
import {createRollingFileLogger, Logger} from 'simple-node-logger'
import { TradeBot } from '../../TradeBot'
import { BotApi } from '../bot-api'
import { config } from '../../config'
import {SocketLogs} from "../../types";

export class BotLogger {
  private readonly tradebot: TradeBot
  private get botApi(): BotApi { return this.tradebot.api }
  private readonly logger: Logger
  private _lastLogs: SocketLogs[]

  private createLogsDirIfNotExist(){
    if (!fs.existsSync(config.logs.directory)) fs.mkdirSync(config.logs.directory)
  }

  constructor(tradeBot: TradeBot){
    this.createLogsDirIfNotExist()
    this.tradebot = tradeBot
    this.logger = createRollingFileLogger({
      logDirectory:config.logs.directory,
      fileNamePattern:'trade-bot-<DATE>.log'
    })
    this._lastLogs = []
  }

  updateLastLogs(log: SocketLogs){
    this._lastLogs.push(log)
    if (this._lastLogs.length > 30){
      this._lastLogs.shift()
    }
  }

  getLastLogs(): string{
    return this._lastLogs.join('\r\n')
  }

  log(body: Omit<Omit<SocketLogs, 'robot_id'>, 'timestamp'>){
    const newLog: SocketLogs = {
      robot_id: 'test',
      timestamp: new Date().toISOString(),
      ...body
    }
    if (newLog.type === 'info') this.logger.info(newLog)
    else if (newLog.type === 'error') this.logger.error(newLog)
    else if (newLog.type === 'warning') this.logger.warn(newLog)
    console.log(newLog)
    this.botApi?.webSocketServer.emit('log', JSON.stringify(newLog))
    this.updateLastLogs(newLog)
  }
}
