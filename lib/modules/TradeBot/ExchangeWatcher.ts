import {ExchangeAnalyzer, ExchangeTrader} from "./index";
import {TradeBot} from "../../TradeBot";
import {D_PortfolioPosition, D_Currency, D_Operation, D_Security, D_Order, D_CurrencyBalance} from "@prisma/client";
import {Order} from "../../../example/types/Order";
import {ITranslatorsCD, OperationType, OrderStatus} from "../../utils";
import {AbstractExchangeClient} from "../../AbstractExchangeClient";
import {extractOrderType} from "../../utils/extractTypes";

export class ExchangeWatcher<ExchangeClient extends AbstractExchangeClient<any, any, any, any, any, any, any>>{
    private readonly tradebot: TradeBot<ExchangeClient>
    private readonly translators: ITranslatorsCD<ExchangeClient>
    private get analyzer(): ExchangeAnalyzer<ExchangeClient> { return this.tradebot.analyzer }
    private get trader(): ExchangeTrader<ExchangeClient> { return this.tradebot.trader }
    private get exchangeClient(): ExchangeClient { return this.tradebot.exchangeClient }

    constructor(tradebot: TradeBot<ExchangeClient>) {
        this.tradebot = tradebot
        this.translators = tradebot.exchangeClient.infoModule.translators
    }

    async getPortfolio(): Promise<D_PortfolioPosition[]> {
        const { exchangeClient, translators } = this
        const portfolio = await exchangeClient.getPortfolio()
        return translators.portfolio(portfolio)
    }

    async getCurrenciesBalance(): Promise<D_CurrencyBalance[]> {
        const { exchangeClient, translators } = this
        const currencies = await exchangeClient.getCurrenciesBalance()
        return await Promise.all(currencies.map(c => translators.currencyBalance(c)))
    }

    async getCurrencies(): Promise<D_Currency[]> {
        const { exchangeClient, translators } = this
        const currencies = await exchangeClient.infoModule.getCurrencies()
        return await Promise.all(currencies.map(c => translators.currency(c)))
    }

    async getSecurity(ticker: string): Promise<D_Security>{
        const { exchangeClient, translators } = this
        const security = await exchangeClient.infoModule.getSecurity(ticker, false)
        if (!security) throw new Error(`Security with ticker "${ticker}" was not found`)
        return translators.security(security)
    }

    async getSecurityName(ticker: string): Promise<string> {
        const { exchangeClient } = this
        return await exchangeClient.infoModule.getSecurityName(ticker)
    }

    async getSecurityLastPrice(ticker: string): Promise<number> {
        const { exchangeClient } = this
        return await exchangeClient.infoModule.getSecurityLastPrice(ticker)
    }

    async getSecurityCurrency(ticker: string): Promise<D_Currency> {
        const { exchangeClient, translators } = this
        const currency = await exchangeClient.infoModule.getSecurityCurrency(ticker)
        return translators.currency(currency)
    }

    async getOperations(from: Date = new Date(0), to: Date = new Date()): Promise<D_Operation[]>{
        const { exchangeClient, translators } = this
        const relevantOperations = await exchangeClient.getOperationsAll(from, to)
        return translators.operations(relevantOperations
            .filter(operation => operation.operationType === "Buy" || operation.operationType === "Sell")
        )
    }

    async getOperationsBySecurity(ticker: string, from: Date = new Date(0), to: Date = new Date()): Promise<D_Operation[]>{
        const { exchangeClient, translators } = this
        const relevantOperations = await exchangeClient.getOperationsBySecurity(ticker, from, to)
        return translators.operations(relevantOperations
            .filter(operation => operation.operationType === "Buy" || operation.operationType === "Sell")
        )
    }

    onOrderSent(order: extractOrderType<ExchangeClient>, operation_type: OperationType, run_id: number | null = null): OrderStatus {
        const { translators, analyzer } = this
        const status = translators.orderStatus(order)
        translators.order(order)
            .then(d_order => analyzer.saveOrder({...d_order, status_first: status}, operation_type, run_id))
        return status
    }
}
