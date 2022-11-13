import { TradeBot } from 'src/TradeBot'
import {AbstractExchangeClient, AbstractTradeAlgorithm} from 'src/abstract'
import {ExchangeAnalyzer, ExchangeTrader, ExchangeWatcher} from 'src/modules'
import { D_Algorithm, D_AlgorithmRun } from '../../../db'

export class TradeAlgorithmsEngine<ExchangeClient extends AbstractExchangeClient> {
    protected readonly analyzer: ExchangeAnalyzer<ExchangeClient>
    protected get trader(): ExchangeTrader<ExchangeClient> { return this.analyzer.trader }
    protected get watcher(): ExchangeWatcher<ExchangeClient> { return this.analyzer.watcher }
    protected get tradebot(): TradeBot<ExchangeClient> { return this.analyzer.tradebot }

    protected readonly algorithms: AbstractTradeAlgorithm<ExchangeClient, any, any, any>[]

    constructor(analyzer: ExchangeAnalyzer<ExchangeClient>,
                initAlgorithmsCallback:
                    (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient, any, any, any>[]
    ) {
        this.analyzer = analyzer
        this.algorithms = initAlgorithmsCallback(analyzer)
        this.continueAlgorithms()
    }

    get description(): D_Algorithm[] {
        return this.algorithms.map(algo => algo.details)
    }

    async runAlgorithm(name: string, inputs: any): Promise<D_AlgorithmRun>{
        const { algorithms } = this
        const algo = algorithms.find(a => a.name === name)
        if (!algo) throw new Error(`Algorithm with name "${name}" was not found`)
        return await algo.main(inputs)
    }

    async continueAlgorithms(){
        const { tradebot, analyzer, algorithms } = this
        tradebot.logger.log('Continue stopped algorithms runs...')
        const unfinishedRuns = await analyzer.getUnfinishedAlgorithmRuns()
        for (let run of unfinishedRuns){
            await algorithms.find(algo => algo.name === run.algorithm_name)?.continue(run.id)
        }
    }

    async continueAlgorithm(name:string, id: number){
        const { algorithms } = this
        const algo = algorithms.find(a => a.name === name)
        if (!algo) throw new Error(`Algorithm with name "${name}" was not found`)
        return await algo.continue(id)
    }

    async stopAlgorithm(name: string, id: number){
        const { algorithms } = this
        const algo = algorithms.find(a => a.name === name)
        if (!algo) throw new Error(`Algorithm with name "${name}" was not found`)
        return await algo.stop(id)
    }

}
