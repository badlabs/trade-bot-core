import {D_Currency, D_PortfolioPosition, D_Security, D_Operation, D_Order, D_CurrencyBalance} from "@prisma/client";
import {OrderStatus} from "./orderDetails";
import {OperationType} from "./database";
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
    orderOperation(order: extractOrderType<ExchangeClient>): OperationType
}

export abstract class
AbstractTranslator<ExchangeClient extends AbstractExchangeClient<any, any, any, any, any, any, any>>{
    protected readonly exchangeClient: ExchangeClient

    protected constructor(exchangeClient: ExchangeClient) {
        this.exchangeClient = exchangeClient
    }

    abstract currency(currency: extractCurrencyType<ExchangeClient>): Promise<D_Currency>
    abstract currencyBalance(currency: extractCurrencyBalanceType<ExchangeClient>): Promise<D_CurrencyBalance>
    abstract portfolio(portfolio: extractPortfolioType<ExchangeClient>): Promise<D_PortfolioPosition[]>
    abstract security(security: extractSecurityType<ExchangeClient>): Promise<D_Security>
    abstract operation(operation: extractOperationType<ExchangeClient>): Promise<D_Operation>
    abstract operations(operations: extractOperationType<ExchangeClient>[]): Promise<D_Operation[]>
    abstract order(order: extractOrderType<ExchangeClient>): Promise<D_Order>
    abstract orderStatus(order: extractOrderType<ExchangeClient>): OrderStatus
    abstract orderOperation(order: extractOrderType<ExchangeClient>): OperationType
}
