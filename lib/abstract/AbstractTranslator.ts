import {AbstractExchangeClient} from './AbstractExchangeClient'
import {D_Currency, D_PortfolioPosition, D_Security, D_Operation, D_Order, D_CurrencyBalance} from '@prisma/client'
import {OrderStatus, OperationType as OperationTypeEnum} from 'lib/types'


export abstract class AbstractTranslator<ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>{
    protected readonly exchangeClient: AbstractExchangeClient<ExchangeApiType,
        CurrencyType, CurrencyBalanceType,
        SecurityType, OrderType,
        PortfolioType, OperationType>

    protected constructor(exchangeClient: AbstractExchangeClient<ExchangeApiType,
        CurrencyType, CurrencyBalanceType,
        SecurityType, OrderType,
        PortfolioType, OperationType>) {
        this.exchangeClient = exchangeClient
    }

    abstract currency(currency: CurrencyType): Promise<D_Currency>
    abstract currencyBalance(currency: CurrencyBalanceType): Promise<D_CurrencyBalance>
    abstract portfolio(portfolio: PortfolioType): Promise<D_PortfolioPosition[]>
    abstract security(security: SecurityType): Promise<D_Security>
    abstract operation(operation: OperationType): Promise<D_Operation>
    abstract operations(operations: OperationType[]): Promise<D_Operation[]>
    abstract order(order: OrderType): Promise<D_Order>
    abstract orderStatus(order: OrderType): OrderStatus
    abstract orderOperation(order: OrderType): OperationTypeEnum
}
