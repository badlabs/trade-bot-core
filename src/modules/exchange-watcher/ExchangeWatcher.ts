import {TradeBot} from '../../TradeBot'
import {ExchangeAnalyzer, ExchangeTrader} from '../../modules'
import {AbstractTranslator, AbstractExchangeClient} from '../../abstract'
import {OperationType, OrderStatus, CommonDomain} from '../../types'
import {GetSecurityBalanceType, GetCurrencyType,
    GetSecurityType, GetCurrencyBalanceType} from '../../types/extractors'
import {GetOrderType} from "../../types/extractors";

export class ExchangeWatcher<ExchangeClient extends AbstractExchangeClient>{
    private readonly tradebot: TradeBot<ExchangeClient>
    private get translator(): AbstractTranslator {
        return this.exchangeClient.translator
    }
    private get analyzer(): ExchangeAnalyzer<ExchangeClient> { return this.tradebot.analyzer }
    private get trader(): ExchangeTrader<ExchangeClient> { return this.tradebot.trader }
    private get exchangeClient(): ExchangeClient { return this.tradebot.exchangeClient }

    constructor(tradebot: TradeBot<ExchangeClient>) {
        this.tradebot = tradebot
    }

    async getPortfolio(): Promise<GetSecurityBalanceType<CommonDomain>[]> {
        const { exchangeClient, translator } = this
        const portfolio = await exchangeClient.getPortfolio()
        return translator.securityBalance(portfolio)
    }

    async getCurrenciesBalance(): Promise<GetCurrencyBalanceType<CommonDomain>[]> {
        const { exchangeClient, translator } = this
        const currencies = await exchangeClient.getCurrenciesBalance()
        return await Promise.all(currencies.map(c => translator.currencyBalance(c)))
    }

    async getCurrencies(): Promise<GetCurrencyType<CommonDomain>[]> {
        const { exchangeClient, translator } = this
        const currencies = await exchangeClient.infoModule.getCurrencies()
        return await Promise.all(currencies.map(c => translator.currency(c)))
    }

    async getSecurity(ticker: string): Promise<GetSecurityType<CommonDomain>>{
        const { exchangeClient, translator } = this
        const security = await exchangeClient.infoModule.getSecurity(ticker, false)
        if (!security) throw new Error(`Security with ticker "${ticker}" was not found`)
        return translator.security(security)
    }

    async getSecurityName(ticker: string): Promise<string> {
        const { exchangeClient } = this
        return await exchangeClient.infoModule.getSecurityName(ticker)
    }

    async getSecurityLastPrice(ticker: string): Promise<number> {
        const { exchangeClient } = this
        return await exchangeClient.infoModule.getSecurityLastPrice(ticker)
    }

    async getSecurityCurrency(ticker: string): Promise<GetCurrencyType<CommonDomain>> {
        const { exchangeClient, translator } = this
        const currency = await exchangeClient.infoModule.getSecurityCurrency(ticker)
        return translator.currency(currency)
    }

    onOrderSent(order: GetOrderType<ExchangeClient>,
                operation_type: OperationType,
                runId: number | undefined = undefined): OrderStatus {
        const { translator, analyzer } = this
        const status = translator.orderStatus(order)
        translator.order(order)
            .then(order => analyzer.saveOrder({...order, status: status}, operation_type, runId))
        return status
    }
}
