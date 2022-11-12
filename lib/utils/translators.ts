import {D_Currency, D_PortfolioPosition, D_Security, D_Operation, D_Order, D_CurrencyBalance} from "@prisma/client";
import {OrderStatus} from "./orderDetails";
import {OperationType as OperationTypeEnum} from "./database";
import {
    extractCurrencyBalanceType,
    extractCurrencyType, extractOperationType, extractOrderType,
    extractPortfolioType,
    extractSecurityType
} from "./extractTypes";
import {AbstractExchangeClient} from "../AbstractExchangeClient";

export interface ITranslator<ExchangeClient extends AbstractExchangeClient<any, any, any, any, any, any, any>>{
    currency(currency: extractCurrencyType<ExchangeClient>): Promise<D_Currency>
    currencyBalance(currency: extractCurrencyBalanceType<ExchangeClient>): Promise<D_CurrencyBalance>
    portfolio(portfolio: extractPortfolioType<ExchangeClient>): Promise<D_PortfolioPosition[]>
    security(security: extractSecurityType<ExchangeClient>): Promise<D_Security>
    operation(operation: extractOperationType<ExchangeClient>): Promise<D_Operation>
    operations(operations: extractOperationType<ExchangeClient>[]): Promise<D_Operation[]>
    order(order: extractOrderType<ExchangeClient>): Promise<D_Order>
    orderStatus(order: extractOrderType<ExchangeClient>): OrderStatus
    orderOperation(order: extractOrderType<ExchangeClient>): OperationTypeEnum
}

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
