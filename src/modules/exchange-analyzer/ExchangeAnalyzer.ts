import {
    GetOrdersOptions,
    OperationType,
    CommonDomain
} from "../../types";
import {
    GetSecurityType, GetCurrencyType, GetCurrencyBalanceType,
    GetOrderType, GetPortfolioPositionType
} from "../../types/extractors";
import {AbstractTradeAlgorithm, AbstractExchangeClient} from 'src/abstract'
import {ExchangeTrader, ExchangeWatcher} from 'src/modules'
import {TradeAlgorithmsEngine} from './trade-algorithms-engine'
import {TradeBot} from 'src/TradeBot'
import {db, Algorithm, AlgorithmRun, Order} from 'src/db'
import {store} from 'src/store'
import {scheduleJob} from 'node-schedule'
import {In, Not} from "typeorm";
import {AlgorithmRunStatus} from "../../db/AlgorithmRun";

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

    private async loadSecurityIfNotExist(ticker: string): Promise<GetSecurityType<CommonDomain> | undefined> {
        const { watcher } = this
        const securityInCache = store.securitiesStore.securities.find(s => s.ticker === ticker)
        if (!securityInCache) {
            await this.addSecurities(await watcher.getSecurity(ticker))
            return store.securitiesStore.securities.find(s => s.ticker === ticker)
        }
        return securityInCache
    }

    private async loadSecuritiesIfNotExist(tickers: string[]): Promise<GetSecurityType<CommonDomain>[]> {
        const { watcher } = this
        const securitiesInCache = store.securitiesStore.securities.filter(s => tickers.includes(s.ticker))
        const securitiesToAdd = await Promise.all(tickers
            .filter(t => !securitiesInCache.some(s => s.ticker === t))
            .map(ticker => watcher.getSecurity(ticker)))
        return this.addSecurities(...securitiesToAdd)
    }

    // Currencies

    async updateCurrencies(): Promise<GetCurrencyType<CommonDomain>[]> {
        const { watcher } = this
        const relevantCurrencies = await watcher.getCurrencies()
        store.currenciesStore.updateCurrenciesAll(relevantCurrencies)
        return store.currenciesStore.currencies
    }

    async getCurrencies(): Promise<GetCurrencyType<CommonDomain>[]> {
        return store.currenciesStore.currencies
    }

    // Currencies Balance

    async updateCurrenciesBalance(): Promise<GetCurrencyBalanceType<CommonDomain>[]> {
        const { watcher } = this
        const relevantCurrencies = await watcher.getCurrenciesBalance()
        store.portfolioStore.updatePositions(...relevantCurrencies)
        return store.portfolioStore.currencies
    }

    async getCurrenciesBalance(): Promise<GetCurrencyBalanceType<CommonDomain>[]> {
        return store.portfolioStore.currencies
    }

    // Securities

    async updateSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        const { watcher } = this
        const securities: GetSecurityType<CommonDomain>[] = store.securitiesStore.securities
        const securitiesPrices = await Promise.all(
            securities.map((security): Promise<number> => watcher.getSecurityLastPrice(security.ticker))
        )
        store.securitiesStore.updateSecurities(...securities
            .map((security, index) => ({
                ...security,
                price: securitiesPrices[index]
            })
        ))
        return store.securitiesStore.securities
    }

    async getSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        return store.securitiesStore.securities
    }

    async getSecurity(ticker: string): Promise<GetSecurityType<CommonDomain>> {
        const security = store.securitiesStore.securities.find(s => s.ticker === ticker)
        if (!security) throw new Error(`Security with ticker:${ticker} was not found`)
        return security
    }

    async addSecurities(...securities: GetSecurityType<CommonDomain>[]): Promise<GetSecurityType<CommonDomain>[]> {
        store.securitiesStore.updateSecurities(...securities)
        return store.securitiesStore.securities
    }

    // Followed Securities

    async getFollowedSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        return store.securitiesStore.followedSecurities
    }
    async followSecurity(securityTicker: string): Promise<GetSecurityType<CommonDomain> | undefined> {
        return store.securitiesStore.follow(securityTicker)
    }
    async unfollowSecurity(securityTicker: string): Promise<GetSecurityType<CommonDomain> | undefined> {
        return store.securitiesStore.unfollow(securityTicker)
    }
    async updateFollowedSecurities(): Promise<GetSecurityType<CommonDomain>[]> {
        const { watcher } = this
        const securitiesToUpdate = store.securitiesStore.followedSecurities
        const securitiesPrices = await Promise.all(
            securitiesToUpdate.map(security => watcher.getSecurityLastPrice(security.ticker))
        )
        store.securitiesStore.updateSecurities(...securitiesToUpdate.map((s, index) => ({
            ...s,
            price: securitiesPrices[index]
        })))
        return store.securitiesStore.followedSecurities
    }

    // Portfolio

    async updatePortfolio(): Promise<GetPortfolioPositionType<CommonDomain>[]>{
        const { watcher } = this
        const relevantPortfolio = await watcher.getPortfolio()
        const securities = await Promise.all(relevantPortfolio.map(p => watcher.getSecurity(p.securityTicker)))
        const currencies = await watcher.getCurrenciesBalance()
        await this.addSecurities(...securities)
        store.portfolioStore.updatePositionsAll([...relevantPortfolio, ...currencies])
        return store.portfolioStore.portfolio

    }

    async getPortfolio(): Promise<GetPortfolioPositionType<CommonDomain>[]> {
        return store.portfolioStore.portfolio
    }

    async clearPortfolio(): Promise<number> {
        const deleted = store.portfolioStore.portfolio.length
        store.portfolioStore.updatePositionsAll([])
        return deleted
    }

    // Orders

    async saveOrder(order: GetOrderType<CommonDomain>,
                    operation: OperationType,
                    runId: number | undefined = undefined): Promise<GetOrderType<CommonDomain>> {
        await this.loadSecurityIfNotExist(order.securityTicker)
        await db.manager.upsert(Order, {
            ...order,
            operation,
            algorithmRunId: runId
        }, {
            conflictPaths: [ 'exchangeId' ]
        })
        const result =  await db.manager.findOneBy(Order, { exchangeId: order.exchangeId })
        if (!result)
            throw new Error(`Order was not saved successfully: ${order}`)
        return result
    }

    async getOrders({ from, to, operation, securityTicker, runId }: GetOrdersOptions): Promise<GetOrderType<CommonDomain>[]> {
        // TODO: Rewrite to typed selector
        let queryBuilder = db.manager
            .getRepository(Order)
            .createQueryBuilder('order')
            .where('order.updatedAt > :from', { from: Number(from ?? 0) })
            .andWhere('order.updatedAt < :to', { from: Number(to ?? new Date()) })
        if (operation)
            queryBuilder = queryBuilder.andWhere('order.operation = :operation', {operation})
        if (securityTicker)
            queryBuilder = queryBuilder.andWhere('order.securityTicker = :securityTicker', {securityTicker})
        if (runId)
            queryBuilder = queryBuilder.andWhere('order.algorithmRunId = :runId', {runId})
        return await queryBuilder.getMany()
    }

    // Algorithms

    async saveAlgorithms(): Promise<Algorithm[]>{
        const { tradeAlgos } = this
        const allAlgorithms = tradeAlgos.description
        await db.manager.upsert(Algorithm, allAlgorithms, ['name'])
        return await db.manager.find(Algorithm)
    }

    async runAlgorithm(algorithmName: string, inputs: any, state: any = inputs): Promise<AlgorithmRun>{
        return db.manager.create(AlgorithmRun, {
            algorithmName, inputs, state,
            status: 'running'
        })
    }

    async saveAlgorithmRunProgress(id: number, state: any): Promise<AlgorithmRun>{
        await db.manager.update(AlgorithmRun, { id }, { state })
        const updatedRun = await db.manager.findOneBy(AlgorithmRun, {id})
        if (!updatedRun)
            throw new Error(`AlgorithmRun wasn't updated successfully: ${ {id, state} }`)
        return updatedRun
    }

    async loadAlgorithmRunProgress(id: number): Promise<AlgorithmRun | null>{
        return  db.manager.findOneBy(AlgorithmRun, {id})
    }

    async stopAlgorithmRun(id: number): Promise<AlgorithmRun>{
        await db.manager.update(AlgorithmRun, { id }, { status: 'stopped' })
        const stoppedRun = await db.manager.findOneBy(AlgorithmRun, {id})
        if (!stoppedRun)
            throw new Error(`AlgorithmRun wasn't stopped successfully: ${ {id} }`)
        return stoppedRun
    }

    async resumeAlgorithmRun(id: number): Promise<AlgorithmRun>{
        await db.manager.update(AlgorithmRun, { id }, { status: 'resumed' })
        const resumedRun = await db.manager.findOneBy(AlgorithmRun, {id})
        if (!resumedRun)
            throw new Error(`AlgorithmRun wasn't resumed successfully: ${ {id} }`)
        return resumedRun
    }

    async finishAlgorithmRun(id: number): Promise<AlgorithmRun>{
        await db.manager.update(AlgorithmRun, { id }, { status: 'finished' })
        const finishedRun = await db.manager.findOneBy(AlgorithmRun, {id})
        if (!finishedRun)
            throw new Error(`AlgorithmRun wasn't finished successfully: ${ {id} }`)
        return finishedRun
    }

    async errorAlgorithmRun(id: number, error: Error): Promise<AlgorithmRun>{
        const run = await db.manager.findOneBy(AlgorithmRun, {id})
        const state = { stateBeforeError: run?.state, error }
        await db.manager.update(AlgorithmRun, { id }, {
            status: 'error',
            state
        })
        const runWithError = await db.manager.findOneBy(AlgorithmRun, {id})
        if (!runWithError)
            throw new Error(`Error in AlgorithmRun wasn't saved successfully: ${ {id} }`)
        return runWithError
    }

    async getAlgorithmRunsByAlgorithm(algorithmName: string): Promise<AlgorithmRun[]>{
        return  db.manager.find(AlgorithmRun, {
            where: { algorithmName },
            order: { id: 'DESC' }
        })
    }

    async getUnfinishedAlgorithmRuns(): Promise<AlgorithmRun[]>{
        return db.manager.find(AlgorithmRun, {
            where: {
                status: Not(In<AlgorithmRunStatus>(['finished', 'stopped', 'error']))
            }
        })
    }
}
