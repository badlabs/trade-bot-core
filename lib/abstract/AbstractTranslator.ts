import {AbstractExchangeClient} from './AbstractExchangeClient'
import {D_Currency, D_PortfolioPosition, D_Security, D_Operation, D_Order, D_CurrencyBalance} from '@prisma/client'
import {OrderStatus, OperationType as OperationTypeEnum, SubjectAreaTemplate} from 'lib/types'
import {
    GetCurrencyType,
    GetCurrencyBalanceType,
    GetPortfolioType,
    GetSecurityType,
    GetOperationType,
    GetOrderType} from "../types/extractors";


export abstract class AbstractTranslator<
    ExchangeApiType = any,
    SubjectArea extends SubjectAreaTemplate = SubjectAreaTemplate>{
    protected readonly exchangeClient: AbstractExchangeClient<ExchangeApiType,SubjectArea>

    protected constructor(exchangeClient: AbstractExchangeClient<ExchangeApiType, SubjectArea>) {
        this.exchangeClient = exchangeClient
    }

    abstract currency(currency: GetCurrencyType<SubjectArea>): Promise<D_Currency>
    abstract currencyBalance(currency: GetCurrencyBalanceType<SubjectArea>): Promise<D_CurrencyBalance>
    abstract portfolio(portfolio: GetPortfolioType<SubjectArea>): Promise<D_PortfolioPosition[]>
    abstract security(security: GetSecurityType<SubjectArea>): Promise<D_Security>
    abstract operation(operation: GetOperationType<SubjectArea>): Promise<D_Operation>
    abstract operations(operations: GetOperationType<SubjectArea>[]): Promise<D_Operation[]>
    abstract order(order: GetOrderType<SubjectArea>): Promise<D_Order>
    abstract orderStatus(order: GetOrderType<SubjectArea>): OrderStatus
    abstract orderOperation(order: GetOrderType<SubjectArea>): OperationTypeEnum
}
