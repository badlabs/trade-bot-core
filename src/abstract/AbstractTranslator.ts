import {AbstractExchangeClient} from './AbstractExchangeClient'
import {OrderStatus, OperationType, DomainTemplate, CommonDomain} from 'src/types'
import {
    GetCurrencyType,
    GetCurrencyBalanceType,
    GetPortfolioType,
    GetSecurityType,
    GetOperationType,
    GetOrderType} from "../types/extractors";


export abstract class AbstractTranslator<ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient>{
    protected exchangeClient: ExchangeClient

    setExchangeClient(exchangeClient: ExchangeClient) {
        this.exchangeClient = exchangeClient
    }

    abstract currency(currency: GetCurrencyType<ExchangeClient>):
        Promise<GetCurrencyType<CommonDomain>>

    abstract currencyBalance(currency: GetCurrencyBalanceType<ExchangeClient>):
        Promise<GetCurrencyBalanceType<CommonDomain>>

    abstract portfolio(portfolio: GetPortfolioType<ExchangeClient>):
        Promise<GetPortfolioType<CommonDomain>[]>

    abstract security(security: GetSecurityType<ExchangeClient>):
        Promise<GetSecurityType<CommonDomain>>

    abstract operation(operation: GetOperationType<ExchangeClient>):
        Promise<GetOperationType<CommonDomain>>

    abstract operations(operations: GetOperationType<ExchangeClient>[]):
        Promise<GetOperationType<CommonDomain>[]>

    abstract order(order: GetOrderType<ExchangeClient>):
        Promise<GetOrderType<CommonDomain>>

    abstract orderStatus(order: GetOrderType<ExchangeClient>): OrderStatus

    abstract orderOperation(order: GetOrderType<ExchangeClient>): OperationType
}
