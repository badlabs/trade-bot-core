import { TradeBot } from '../../../../TradeBot'
import {AbstractExchangeClient, AbstractTradeAlgorithm} from '../../../../abstract'
import {ExchangeAnalyzer, ExchangeTrader, ExchangeWatcher} from '../../../index'
import { Algorithm, AlgorithmRun } from '../../../../db'

export class TradeAlgorithmsEngine<ExchangeClient extends AbstractExchangeClient> {
    protected readonly analyzer: ExchangeAnalyzer<ExchangeClient>
    protected get trader(): ExchangeTrader<ExchangeClient> { return this.analyzer.trader }
    protected get watcher(): ExchangeWatcher<ExchangeClient> { return this.analyzer.watcher }
    protected get tradebot(): TradeBot<ExchangeClient> { return this.analyzer.tradebot }

    protected readonly algorithms: AbstractTradeAlgorithm<ExchangeClient>[]

    constructor(analyzer: ExchangeAnalyzer<ExchangeClient>,
                initAlgorithmsCallback:
                    (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
    ) {
        this.analyzer = analyzer
        this.algorithms = initAlgorithmsCallback(analyzer)
        this.resumeAlgorithms()
    }

    get description(): Algorithm[] {
        return this.algorithms.map(algo => algo.details)
    }

    async runAlgorithm(name: string, inputs: any): Promise<AlgorithmRun>{
        const { algorithms } = this
        const algo = algorithms.find(a => a.name === name)
        if (!algo) throw new Error(`Algorithm with name "${name}" was not found`)
        return await algo.main(inputs)
    }

    async resumeAlgorithms(){
        const { tradebot, analyzer, algorithms } = this
        const unfinishedRuns = await analyzer.getUnfinishedAlgorithmRuns()
        for (let run of unfinishedRuns){
            const resumedRun = await algorithms.find(algo => algo.name === run.algorithmName)?.continue(run.id)
            if (resumedRun)
                tradebot.logger.log({
                    type: 'info',
                    message: 'Algorithm is resumed',
                    algorithm: {
                        name: resumedRun.algorithmName,
                        run_id: resumedRun.id,
                        state: resumedRun.state
                    }
                })
        }
        tradebot.logger.log({
            type: 'info',
            message: 'All algorithms are resumed'
        })
    }

    // TODO: rename to resume
    async continueAlgorithm(name:string, id: number): Promise<AlgorithmRun>{
        const { algorithms } = this
        const algo = algorithms.find(a => a.name === name)
        if (!algo) throw new Error(`Algorithm with name "${name}" was not found`)
        return await algo.continue(id)
    }

    async stopAlgorithm(name: string, id: number): Promise<AlgorithmRun>{
        const { algorithms } = this
        const algo = algorithms.find(a => a.name === name)
        if (!algo) throw new Error(`Algorithm with name "${name}" was not found`)
        return await algo.stop(id)
    }

}
