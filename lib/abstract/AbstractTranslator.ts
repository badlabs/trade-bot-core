import {AbstractExchangeClient} from './AbstractExchangeClient'
import {OrderStatus, OperationType, SubjectAreaTemplate, CommonSubjectArea} from 'lib/types'
import {
    GetCurrencyType,
    GetCurrencyBalanceType,
    GetPortfolioType,
    GetSecurityType,
    GetOperationType,
    GetOrderType} from "../types/extractors";


export abstract class AbstractTranslator<SubjectArea extends SubjectAreaTemplate = SubjectAreaTemplate>{
    protected readonly exchangeClient: AbstractExchangeClient<SubjectArea>

    protected constructor(exchangeClient: AbstractExchangeClient<SubjectArea>) {
        this.exchangeClient = exchangeClient
    }

    abstract currency(currency: GetCurrencyType<SubjectArea>):
        Promise<GetCurrencyType<CommonSubjectArea>>
    abstract currencyBalance(currency: GetCurrencyBalanceType<SubjectArea>):
        Promise<GetCurrencyBalanceType<CommonSubjectArea>>
    abstract portfolio(portfolio: GetPortfolioType<SubjectArea>):
        Promise<GetPortfolioType<CommonSubjectArea>[]>
    abstract security(security: GetSecurityType<SubjectArea>):
        Promise<GetSecurityType<CommonSubjectArea>>
    abstract operation(operation: GetOperationType<SubjectArea>):
        Promise<GetOperationType<CommonSubjectArea>>
    abstract operations(operations: GetOperationType<SubjectArea>[]):
        Promise<GetOperationType<CommonSubjectArea>[]>
    abstract order(order: GetOrderType<SubjectArea>):
        Promise<GetOrderType<CommonSubjectArea>>
    abstract orderStatus(order: GetOrderType<SubjectArea>): OrderStatus
    abstract orderOperation(order: GetOrderType<SubjectArea>): OperationType
}
