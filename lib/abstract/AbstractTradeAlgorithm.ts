import { D_AlgorithmRun, D_Algorithm } from '@prisma/client'
import {AbstractExchangeClient} from './AbstractExchangeClient'
import { BotLogger, ExchangeAnalyzer, ExchangeTrader, ExchangeWatcher } from 'lib/modules'

export abstract class AbstractTradeAlgorithm<
  ExchangeClient extends AbstractExchangeClient,
  InputsType, StateType, StopDataType>{
  protected readonly analyzer: ExchangeAnalyzer<ExchangeClient>
  protected get watcher(): ExchangeWatcher<ExchangeClient> { return this.analyzer.watcher }
  protected get trader(): ExchangeTrader<ExchangeClient> { return this.analyzer.trader }
  protected stopData: Map<number, StopDataType> = new Map<number, StopDataType>()
  private get logger(): BotLogger { return this.analyzer.tradebot.logger }
  get details(): D_Algorithm {
    return {
      name: this.name,
      description: this.description,
      input_types: JSON.stringify(this.inputs)
    }
  }

  protected constructor(analyzer: ExchangeAnalyzer<ExchangeClient>){
    this.analyzer = analyzer
  }


  protected async fixStart(inputs: InputsType, state: StateType): Promise<D_AlgorithmRun> {
    const { name, analyzer, logger } = this
    const algoRun: D_AlgorithmRun = await analyzer.runAlgorithm(name, inputs, state)
    logger.log(`[algo:${algoRun.id}] Starting algorithm "${name}". Inputs: ${JSON.stringify(inputs)}`)
    return algoRun
  }
  protected async fixStop(id: number): Promise<D_AlgorithmRun>{
    const { name, analyzer, logger } = this
    logger.log(`[algo:${id}] Stopping algorithm "${name}"`)
    this.stopData.delete(id)
    return await analyzer.stopAlgorithmRun(id)
  }
  protected async fixContinue(id: number): Promise<D_AlgorithmRun>{
    const { name, analyzer, logger } = this
    logger.log(`[algo:${id}] Continuing algorithm "${name}"`)
    return await analyzer.continueAlgorithmRun(id)
  }
  protected async fixFinish(id: number): Promise<D_AlgorithmRun>{
    const { name, analyzer, logger } = this
    logger.log(`[algo:${id}] Finishing algorithm "${name}"`)
    return await analyzer.finishAlgorithmRun(id)
  }
  protected async fixError(id: number, error: Error): Promise<D_AlgorithmRun>{
    const { name, analyzer, logger } = this
    await this.stop(id)
    logger.log(`[algo:${id}] Error in algorithm "${name}": ${JSON.stringify(error)}`)
    return await analyzer.errorAlgorithmRun(id, error)
  }
  protected async saveProgress(id: number, progress: StateType): Promise<D_AlgorithmRun> {
    const { name, analyzer, logger } = this
    logger.log(`[algo:${id}] Saving process of algorithm "${name}". State: ${JSON.stringify(progress)}`)
    return await analyzer.saveAlgorithmRunProgress(id, progress)
  }
  protected async loadProgress(id: number): Promise<D_AlgorithmRun> {
    const { name, analyzer, logger } = this
    const algoRun: D_AlgorithmRun | null = await analyzer.loadAlgorithmRunProgress(id)
    if (!algoRun) throw new Error(`[algo:${id}] Algorithm "${name}" was not found`)
    logger.log(`[algo:${id}] Loading progress of algorithm "${name}". State: ${JSON.stringify(algoRun?.state)}`)
    return algoRun
  }


  abstract get name(): string
  abstract get description(): string
  abstract get inputs(): any
  abstract main(inputs: InputsType): Promise<D_AlgorithmRun>
  abstract continue(id: number): Promise<D_AlgorithmRun>
  abstract stop(id: number): Promise<D_AlgorithmRun>
}
