import { TradeBot } from "lib/TradeBot";
import {ExchangeAnalyzer, ExchangeTrader, ExchangeWatcher} from "lib/modules/TradeBot/index";
import { AbstractTradeAlgorithm } from "./AbstractTradeAlgorithm";
import { D_Algorithm, D_AlgorithmRun } from "@prisma/client";
import { initAlgorithms } from "../../../../../src/algorithms";
import {ExchangeClient} from "../../../../../src/ExchangeClient";

// TODO: implement abstract TradeAlgorithms
export class TradeAlgorithms{
    private readonly analyzer: ExchangeAnalyzer<ExchangeClient>
    private get trader(): ExchangeTrader<ExchangeClient> { return this.analyzer.trader }
    private get watcher(): ExchangeWatcher<ExchangeClient> { return this.analyzer.watcher }
    private get tradebot(): TradeBot<ExchangeClient> { return this.analyzer.tradebot }

    private readonly algorithms: AbstractTradeAlgorithm<ExchangeClient, any, any, any>[]

    constructor(analyzer: ExchangeAnalyzer<ExchangeClient>) {
        this.analyzer = analyzer
        this.algorithms = initAlgorithms(analyzer)
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
