import { AlgorithmRun, Algorithm } from '../db'
import { InputTypes } from "../db/Algorithm";
import {AbstractExchangeClient} from './AbstractExchangeClient'
import { LoggerService, ExchangeAnalyzer, ExchangeTrader, ExchangeWatcher } from '../modules'
import {HandleError} from "../utils";

export abstract class AbstractTradeAlgorithm<
  ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient,
  InputsType = any, StateType = any, StopDataType = any>{
  protected readonly analyzer: ExchangeAnalyzer<ExchangeClient>
  protected get watcher(): ExchangeWatcher<ExchangeClient> { return this.analyzer.watcher }
  protected get trader(): ExchangeTrader<ExchangeClient> { return this.analyzer.trader }
  protected stopData: Map<number, StopDataType> = new Map<number, StopDataType>()
  private get logger(): LoggerService { return this.analyzer.tradebot.logger }
  get details(): Algorithm {
    return {
      name: this.name,
      description: this.description,
      inputTypes: this.inputs
    }
  }

  protected constructor(analyzer: ExchangeAnalyzer<ExchangeClient>){
    this.analyzer = analyzer
  }


  @HandleError()
  protected async fixStart(inputs: InputsType, state: StateType): Promise<AlgorithmRun> {
    const { name, analyzer, logger } = this
    const algoRun: AlgorithmRun = await analyzer.runAlgorithm(name, inputs, state)
    logger.log({
      type: 'info',
      message: `Starting algorithm "${name}"`,
      algorithm: {
        name, inputs, state,
        run_id: algoRun.id
      }
    })
    return algoRun
  }

  @HandleError()
  protected async fixStop(id: number): Promise<AlgorithmRun>{
    const { name, analyzer, logger } = this
    logger.log({
      type: 'info',
      message: `Stopping algorithm "${name}"`,
      algorithm: {
        name,
        run_id: id
      }
    })
    this.stopData.delete(id)
    return await analyzer.stopAlgorithmRun(id)
  }

  @HandleError()
  protected async fixContinue(id: number): Promise<AlgorithmRun>{
    const { name, analyzer, logger } = this
    logger.log({
      type: 'info',
      message: `Resuming algorithm "${name}"`,
      algorithm: {
        name,
        run_id: id
      }
    })
    return await analyzer.resumeAlgorithmRun(id)
  }

  @HandleError()
  protected async fixFinish(id: number): Promise<AlgorithmRun>{
    const { name, analyzer, logger } = this
    logger.log({
      type: 'info',
      message: `Finishing algorithm "${name}"`,
      algorithm: {
        name,
        run_id: id
      }
    })
    return await analyzer.finishAlgorithmRun(id)
  }

  @HandleError()
  protected async fixError(id: number, error: Error): Promise<AlgorithmRun>{
    const { name, analyzer, logger } = this
    await this.stop(id)
    const run = await analyzer.errorAlgorithmRun(id, error)
    logger.log({
      type: 'error',
      message: `Error in algorithm "${name}"`,
      algorithm: {
        name, state: run.state,
        run_id: id
      }
    })
    return run
  }

  @HandleError()
  protected async saveProgress(id: number, progress: StateType): Promise<AlgorithmRun> {
    const { name, analyzer, logger } = this
    logger.log({
      type: 'error',
      message: `Saving process of algorithm "${name}"`,
      algorithm: {
        name, state: progress,
        run_id: id
      }
    })
    return await analyzer.saveAlgorithmRunProgress(id, progress)
  }

  @HandleError()
  protected async loadProgress(id: number): Promise<AlgorithmRun> {
    const { name, analyzer, logger } = this
    const algoRun: AlgorithmRun | null = await analyzer.loadAlgorithmRunProgress(id)
    if (!algoRun) throw new Error(`[algo:${id}] Algorithm "${name}" was not found`)
    logger.log({
      type: 'error',
      message: `Loading progress of algorithm "${name}"`,
      algorithm: {
        name, state: algoRun?.state,
        run_id: id
      }
    })
    return algoRun
  }


  abstract get name(): string
  abstract get description(): string
  abstract get inputs(): InputTypes
  abstract main(inputs: InputsType): Promise<AlgorithmRun>
  abstract continue(id: number): Promise<AlgorithmRun>
  abstract stop(id: number): Promise<AlgorithmRun>
}
