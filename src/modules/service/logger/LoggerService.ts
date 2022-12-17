import fs from 'fs'
import {createRollingFileLogger, Logger} from 'simple-node-logger'
import {EventEmitter} from "events";
import { TradeBot } from '../../../TradeBot'
import { ApiService } from '../api'
import { config } from '../../../config'
import {SocketLogs} from "../../../types";

export class LoggerService {
  private readonly tradebot: TradeBot
  private get botApi(): ApiService { return this.tradebot.api }
  private readonly logger: Logger
  private readonly lastLogs: SocketLogs[]
  private readonly eventEmitter = new EventEmitter()

  private createLogsDirIfNotExist(){
    if (!fs.existsSync(config.logs.directory)) fs.mkdirSync(config.logs.directory)
  }

  private logToFile(log: SocketLogs){
    if (log.type === 'info') this.logger.info(log)
    else if (log.type === 'error') this.logger.error(log)
    else if (log.type === 'warning') this.logger.warn(log)
  }

  private logToConsole(log: SocketLogs){
    console.log(log)
  }

  private logToSocket(log: SocketLogs){
    this.eventEmitter.emit('log', log)
  }

  constructor(tradeBot: TradeBot){
    this.createLogsDirIfNotExist()
    this.tradebot = tradeBot
    this.logger = createRollingFileLogger({
      logDirectory:config.logs.directory,
      fileNamePattern:'trade-bot-<DATE>.log'
    })
    this.lastLogs = []
  }

  updateLastLogs(log: SocketLogs){
    this.lastLogs.push(log)
    if (this.lastLogs.length > 30){
      this.lastLogs.shift()
    }
  }

  getLastLogs() {
    return this.lastLogs
  }

  log(body: Omit<Omit<SocketLogs, 'robot_id'>, 'timestamp'>){
    const newLog: SocketLogs = {
      robot_id: 'test',
      timestamp: new Date().toISOString(),
      ...body
    }
    this.logToFile(newLog)
    this.logToConsole(newLog)
    this.logToSocket(newLog)
    this.updateLastLogs(newLog)
  }

  subscribe(callback: (logs: SocketLogs) => void){
    this.eventEmitter.on('log', callback)
  }

  unsubscribe(callback: (logs: SocketLogs) => void){
    this.eventEmitter.off('log', callback)
  }
}
