import {AbstractExchangeClient} from './AbstractExchangeClient'
import {OrderStatus, OperationType, SubjectAreaTemplate, CommonSubjectArea} from 'lib/types'
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
        Promise<GetCurrencyType<CommonSubjectArea>>

    abstract currencyBalance(currency: GetCurrencyBalanceType<ExchangeClient>):
        Promise<GetCurrencyBalanceType<CommonSubjectArea>>

    abstract portfolio(portfolio: GetPortfolioType<ExchangeClient>):
        Promise<GetPortfolioType<CommonSubjectArea>[]>

    abstract security(security: GetSecurityType<ExchangeClient>):
        Promise<GetSecurityType<CommonSubjectArea>>

    abstract operation(operation: GetOperationType<ExchangeClient>):
        Promise<GetOperationType<CommonSubjectArea>>

    abstract operations(operations: GetOperationType<ExchangeClient>[]):
        Promise<GetOperationType<CommonSubjectArea>[]>

    abstract order(order: GetOrderType<ExchangeClient>):
        Promise<GetOrderType<CommonSubjectArea>>

    abstract orderStatus(order: GetOrderType<ExchangeClient>): OrderStatus

    abstract orderOperation(order: GetOrderType<ExchangeClient>): OperationType
}
