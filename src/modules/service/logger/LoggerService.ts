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

  private logToString(log: SocketLogs, {
      showRobotId = true,
      showType = true,
      showTimestamp = true,
      showAlgorithmName = true,
      showAlgorithmRunId = true,
      showAlgorithmState = true,
      showAttachment = true
  } = {}){
    const robotId = showRobotId ? log.robot_id : ''
    const type = showType ? log.type : ''
    const timestamp = showTimestamp ? log.timestamp : ''
    const algorithmName = showAlgorithmName ? log.algorithm?.name ?? '' : ''
    const algorithmRunId = showAlgorithmRunId ? log.algorithm?.run_id ?? '' : ''
    const algorithmState = showAlgorithmState ? log.algorithm?.state ? JSON.stringify(log.algorithm.state) : '' : ''
    const attachment = showAttachment ? log.attachment ? JSON.stringify(log.attachment) : '' : ''

    const robotIdSection = robotId ? `<${robotId}>` : ''
    const typeSection = type ? `[${type.toUpperCase()}]` : ''
    const timestampSection = timestamp ? timestamp : ''
    const algorithmRunSection = (algorithmName || algorithmRunId) ?
      `<${algorithmName ?? 'algo'}${algorithmRunId ? ':' : ''}${algorithmRunId}>` : ''
    const algorithmStateSection = algorithmState ?
        `${algorithmRunSection ? 'Algorithm state' : 'State'}: ${algorithmState}` : ''
    const attachmentSection = attachment ? `Attachment: ${attachment}` : ''

    return `${timestampSection} ${robotIdSection} ${typeSection} ${log.message}` +
        `${algorithmRunSection || algorithmStateSection ? ' | ' : ''} ${algorithmRunSection} ${algorithmStateSection}` +
        `${attachmentSection ? ' | ' : ''} ${attachmentSection}`
  }

  private logToFile(log: SocketLogs){
    const output = this.logToString(log, {
      showTimestamp: false,
      showRobotId: false,
      showType: false
    })
    if (log.type === 'info') this.logger.info(output)
    else if (log.type === 'error') this.logger.error(output)
    else if (log.type === 'warning') this.logger.warn(output)
  }

  private logToConsole(log: SocketLogs){
    console.log(this.logToString(log))
  }

  private logToSocket(log: SocketLogs){
    this.eventEmitter.emit('log', this.logToString(log))
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
