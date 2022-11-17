import {addDaysToDate} from "../../utils";
import {
    GetOperationsOptions,
    GetOrdersOptions,
    OperationType,
    CommonDomain} from "../../types";
import {OperationId} from "../../types/db";
import {GetSecurityType, GetCurrencyType, GetCurrencyBalanceType,
    GetPortfolioType, GetOperationType, GetOrderType} from "../../types/extractors";
import {AbstractTradeAlgorithm, AbstractExchangeClient} from 'src/abstract'
import {ExchangeTrader, ExchangeWatcher} from 'src/modules'
import {TradeAlgorithmsEngine} from './trade-algorithms-engine'
import {TradeBot} from 'src/TradeBot'
import {PrismaClient} from '../../db'
import {FollowedSecurity, Algorithm, AlgorithmRun} from '../../types/analyzer'
import {scheduleJob} from 'node-schedule'

const db = new PrismaClient()

export class ExchangeAnalyzer<ExchangeClient extends AbstractExchangeClient> {
    readonly tradebot: TradeBot<ExchangeClient>
    get trader(): ExchangeTrader<ExchangeClient> { return this.tradebot.trader }
    get watcher(): ExchangeWatcher<ExchangeClient> { return this.tradebot.watcher }
    readonly tradeAlgos: TradeAlgorithmsEngine<ExchangeClient>

    constructor(tradebot: TradeBot<ExchangeClient>,
                initAlgorithmsCallback:
                    (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
                    = () => []
    ) {
        this.tradebot = tradebot
        this.tradeAlgos = new TradeAlgorithmsEngine<ExchangeClient>(this, initAlgorithmsCallback)
        this.saveAlgorithms()
        this.initUpdaters()
    }

    private async initUpdaters(){
        scheduleJob('updateBalance', '*/1 * * * *', () => {
            this.tradebot.logger.log('Updating balance...')
            this.updateCurrenciesBalance()
        })
        scheduleJob('updatePortfolio', '*/1 * * * *', () => {
            this.tradebot.logger.log('Updating portfolio...')
            this.updatePortfolio()
        })
        scheduleJob('updateFollowedSecurities', '*/1 * * * *', () => {
            this.tradebot.logger.log('Updating followed securities...')
            this.updateFollowedSecurities()
        })
    }

    private async loadSecurityIfNotExist(ticker: string): Promise<GetSecurityType<CommonDomain> | null> {
        const { watcher } = this
        const securityInCache = await db.security.findFirst({ where: { ticker } })
        if (!securityInCache) {
            await this.addSecurities(await watcher.getSecurity(ticker))
            return db.security.findFirst({ where: { ticker } })
        }
        return securityInCache
    }

    private async loadSecuritiesIfNotExist(tickers: string[]): Promise<GetSecurityType<CommonDomain>[]> {
        const { watcher } = this
        const securitiesInCache = await db.security.findMany({ where: { ticker: { in: tickers } } })
        const securitiesToAdd = await Promise.all(tickers
            .filter(t => !securitiesInCache.some(s => s.ticker === t))
            .map(ticker => watcher.getSecurity(ticker)))
        return this.addSecurities(...securitiesToAdd)
    }

    // Currencies

    async updateCurrencies(): Promise<GetCurrencyType<CommonDomain>[]> {
        const { watcher } = this
        const relevantCurrencies = await watcher.getCurrencies()
        return await Promise.all(relevantCurrencies
            .map(currency => db.currency.upsert({
                where: { ticker: currency.ticker },
                update: {},
                create: currency
            }))
        )
    }

    async getCurrencies(): Promise<GetCurrencyType<CommonDomain>[]> {
        return db.currency.findMany({})
    }

    // Currencies Balance

    async updateCurrenciesBalance(): Promise<GetCurrencyBalanceType<CommonDomain>[]> {
        const { watcher } = this
        const relevantCurrencies = await watcher.getCurrenciesBalance()
        return await Promise.all(relevantCurrencies
            .map(currency => db.currencyBalance.upsert({
                where: { currency_ticker: currency.currency_ticker },
                update: { balance: currency.balance },
                create: currency
            }))
        )
    }

    async getCurrenciesBalance(): Promise<GetCurrencyBalanceType<CommonDomain>[]> {
        return db.currencyBalance.findMany({})
    }

    // Securities

    async updateSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        const { watcher } = this
        const securities: GetSecurityType<CommonDomain>[] = await db.security.findMany({  })
        const securitiesPrices = await Promise.all(
            securities.map((security): Promise<number> => watcher.getSecurityLastPrice(security.ticker))
        )
        const updatePromises = securities
            .map((security, index) => db.security.update({
                    where: { ticker: security.ticker },
                    data: { price: securitiesPrices[index] }
                })
            )
        return await Promise.all(updatePromises)
    }

    async getSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        return db.security.findMany({})
    }

    async getSecurity(ticker: string): Promise<GetSecurityType<CommonDomain>> {
        const security = await db.security.findUnique({ where: { ticker } })
        if (!security) throw new Error(`Security with ticker:${ticker} was not found`)
        return security
    }

    async addSecurities(...securities: GetSecurityType<CommonDomain>[]): Promise<GetSecurityType<CommonDomain>[]> {
        const createOrUpdatePromises = securities
            .map((security) => db.security.upsert({
                    where: { ticker: security.ticker },
                    update: { price: security.price },
                    create: security
                })
            )
        return await Promise.all(createOrUpdatePromises)
    }

    // Followed Securities

    async getFollowedSecurities(): Promise<FollowedSecurity[]> {
        return db.followedSecurity.findMany({})
    }
    async followSecurity(securityTicker: string): Promise<FollowedSecurity> {
        return db.followedSecurity.upsert({
            where: { security_ticker: securityTicker },
            update: {},
            create: {
                security_ticker: securityTicker,
                followed_since: new Date()
            }
        })
    }
    async unfollowSecurity(securityTicker: string): Promise<FollowedSecurity> {
        return db.followedSecurity.delete({
            where: { security_ticker: securityTicker }
        })
    }
    async updateFollowedSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        const { watcher } = this
        const securitiesToUpdate = await db.followedSecurity.findMany({})
        const securitiesPrices = await Promise.all(
            securitiesToUpdate.map(security => watcher.getSecurityLastPrice(security.security_ticker))
        )
        const updatePromises = securitiesToUpdate.map((security, index) => db.security.update({
            where: { ticker: security.security_ticker },
            data: { price: securitiesPrices[index] }
        }))
        return await Promise.all(updatePromises)
    }

    // Portfolio

    async updatePortfolio(): Promise<GetPortfolioType<CommonDomain>[]>{
        const { watcher } = this
        const relevantPortfolio = await watcher.getPortfolio()
        const securities = await Promise.all(relevantPortfolio.map(p => watcher.getSecurity(p.security_ticker)))
        await this.addSecurities(...securities)
        await db.portfolioPosition.deleteMany({
            where: {
                security_ticker: { notIn: securities.map(s => s.ticker) }
            }
        })
        return await Promise.all(relevantPortfolio.map(position => db.portfolioPosition.upsert(
            {
                where: { security_ticker: position.security_ticker },
                update: { amount: position.amount },
                create: position
            })
        ))

    }

    async getPortfolio(): Promise<GetPortfolioType<CommonDomain>[]> {
        return db.portfolioPosition.findMany({})
    }

    async clearPortfolio(): Promise<number> {
        const { count: deleted } = await db.portfolioPosition.deleteMany({})
        return deleted
    }
    async getPositionAverageBuyPrice(ticker: string): Promise<number> {
        const position = await db.portfolioPosition.findUnique({where: { security_ticker: ticker }})
        async function getBoughtStats(take: number){
            const boughtStats = await db.operation.aggregate({
                orderBy: { created_at: 'desc' },
                where: {
                    operation_type: 'buy',
                    security_ticker: ticker
                },
                take,
                _sum: { amount_requested: true },
                _count: { _all: true }
            })
            return boughtStats
        }
        let countOperations = 5
        let boughtStats = await getBoughtStats(countOperations)
        while ((!!boughtStats._sum.amount_requested ? boughtStats._sum.amount_requested < (position?.amount || 0) : false) && boughtStats._count._all !== 0) {
            countOperations++
            boughtStats = await getBoughtStats(countOperations)
            if (countOperations > boughtStats._count._all) break
        }
        const lastSecurityBuyOperations = await db.operation.findMany({
            orderBy: { created_at: 'desc' },
                where: {
                    operation_type: 'buy',
                    security_ticker: ticker
                },
                take: countOperations
        })
        let buyPrice = 0
        let boughtAmount = position?.amount || 0
        for ( let buyOperation of lastSecurityBuyOperations as GetOperationType<CommonDomain>[] ){
            if (!buyOperation.amount_requested) continue
            if (buyOperation.amount_requested >= boughtAmount){
                buyPrice += boughtAmount * buyOperation.price
                break
            }
            buyPrice += buyOperation.amount_requested * buyOperation.price
            boughtAmount -= buyOperation.amount_requested
        }
        return buyPrice / (boughtStats?._sum?.amount_requested || 1)
    }

    // Orders

    async saveOrder(order: GetOrderType<CommonDomain>, operation_type: OperationType, run_id: number | null = null): Promise<GetOrderType<CommonDomain>> {
        await this.loadSecurityIfNotExist(order.security_ticker)
        const result = await db.order.create({ data: {...order, run_id, operation_type} })
        return result as GetOrderType<CommonDomain>
    }

    async getOrders({ from, to, operation, securityTicker, runId }: GetOrdersOptions): Promise<GetOrderType<CommonDomain>[]> {
        const result = await db.order.findMany({
            orderBy: { created_at: 'desc' },
            where: {
                AND: [
                    { created_at: { gte: from || new Date(0) } },
                    { created_at: { lte: to || new Date() } }
                ],
                operation_type: operation,
                security_ticker: securityTicker,
                run_id: runId
            }
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return result as GetOrderType<CommonDomain>[]
    }

    // Algorithms

    async saveAlgorithms(): Promise<Algorithm[]>{
        const { tradeAlgos } = this
        const updatePromises = tradeAlgos.description.map(algo => db.algorithm.upsert({
            where: { name: algo.name },
            update: {
                description: algo.description,
                input_types: algo.input_types
            },
            create: algo
        }))
        return await Promise.all(updatePromises)
    }

    async runAlgorithm(algorithmName: string, inputs: any, state: any = inputs): Promise<AlgorithmRun>{
        const createdRun = await db.algorithmRun.create({
            data: {
                algorithm_name: algorithmName,
                inputs: JSON.stringify(inputs),
                state: JSON.stringify(state),
                status: 'running'
            }
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return createdRun as AlgorithmRun
    }

    async saveAlgorithmRunProgress(id: number, state: any): Promise<AlgorithmRun>{
        const updatedRun = await db.algorithmRun.update({
            where: { id },
            data: {
                state: JSON.stringify(state)
            }
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return updatedRun as AlgorithmRun
    }

    async loadAlgorithmRunProgress(id: number): Promise<AlgorithmRun | null>{
        const foundRun = await db.algorithmRun.findUnique({ where: { id } })
        return foundRun as AlgorithmRun | null
    }

    async stopAlgorithmRun(id: number): Promise<AlgorithmRun>{
        const stoppedRun = await db.algorithmRun.update({
            where: { id },
            data: { status: 'stopped'}
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return stoppedRun as AlgorithmRun
    }

    async continueAlgorithmRun(id: number): Promise<AlgorithmRun>{
        const continuedRun = await db.algorithmRun.update({
            where: { id },
            data: { status: 'continued'}
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return continuedRun as AlgorithmRun
    }

    async finishAlgorithmRun(id: number): Promise<AlgorithmRun>{
        const finishedRun = await db.algorithmRun.update({
            where: { id },
            data: { status: 'finished'}
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return finishedRun as AlgorithmRun
    }

    async errorAlgorithmRun(id: number, error: Error): Promise<AlgorithmRun>{
        const run = await db.algorithmRun.findUnique({where: {id} })
        const state = { ...JSON.parse(run?.state || '{}'), error }
        const runWithError = await db.algorithmRun.update({
            where: { id },
            data: { status: 'error', state: JSON.stringify(state)}
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return runWithError as AlgorithmRun
    }

    async getAlgorithmRunsByAlgorithm(algorithmName: string): Promise<AlgorithmRun[]>{
        const runs = await db.algorithmRun.findMany({
            orderBy: { id: 'desc' },
            where: { algorithm_name: algorithmName }
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return runs as AlgorithmRun[]
    }

    async getUnfinishedAlgorithmRuns(): Promise<AlgorithmRun[]>{
        const runs = await db.algorithmRun.findMany({
            where: { status: { notIn: [ 'finished', 'stopped', 'error' ] }  }
        })
        // TODO: Replace 'as' with 'satisfies' when TS 4.9 is released
        return runs as AlgorithmRun[]
    }
}
