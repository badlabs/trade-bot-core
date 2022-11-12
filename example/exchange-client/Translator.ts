import {OperationType, OrderStatus, CommonSubjectArea} from '../../lib/types'
import {AbstractTranslator} from '../../lib/abstract'
import {ExchangeClient} from './ExchangeClient'
import OpenAPI, {Currency, CurrencyPosition, MarketInstrument, Operation, Portfolio} from '@tinkoff/invest-openapi-js-sdk'
import {Order} from '../types'
import {SubjectArea} from "../subject-area/SubjectArea";
import {
    GetCurrencyBalanceType,
    GetCurrencyType,
    GetOperationType, GetOrderType,
    GetPortfolioType,
    GetSecurityType
} from "../../lib/types/extractors";

export class Translator extends AbstractTranslator<OpenAPI, SubjectArea> {
    constructor(exchangeClient: ExchangeClient) {
        super(exchangeClient);
    }
    async currency(currency: Currency): Promise<GetCurrencyType<CommonSubjectArea>> {
        return { name: currency, ticker: currency }
    }

    async currencyBalance(currency: CurrencyPosition): Promise<GetCurrencyBalanceType<CommonSubjectArea>> {
        return { currency_ticker: currency.currency, balance: currency.balance }
    }

    async portfolio(portfolio: Portfolio): Promise<GetPortfolioType<CommonSubjectArea>[]> {
        return portfolio.positions
            .map(position => {
                return {
                    security_ticker: position.ticker || 'undefined',
                    amount: position.balance
                }
            })
    }

    async security(security: MarketInstrument): Promise<GetSecurityType<CommonSubjectArea>> {
        if (!security.currency) throw new Error(`Security with ticker "${security.ticker}" have no currency`)
        return {
            currency_ticker: security.currency,
            name: security.name,
            price: await this.exchangeClient.infoModule.getSecurityLastPrice(security.ticker),
            ticker: security.ticker
        }
    }

    async operation(operation: Operation): Promise<GetOperationType<CommonSubjectArea>> {
        const security = operation?.figi ?
            await this.exchangeClient.infoModule.getSecurityByExchangeId(operation?.figi) :
            null
        return {
            security_ticker: security?.ticker || null,
            amount: operation?.quantityExecuted || null,
            amount_requested: operation?.quantity || null,
            created_at: new Date(operation.date),
            exchange_id: operation.id,
            operation_type: operation.operationType === "Buy" ? 'limit_buy' :
                operation.operationType === "Sell" ? 'limit_sell' : 'undefined',
            price: operation?.price || 0,
            status: operation.status,
            updated_at: new Date(),
        }
    }

    async operations(operations: Operation[]): Promise<GetOperationType<CommonSubjectArea>[]> {
        const securityIds = Array.from(new Set(operations.map(op => op.figi)))
        await Promise.all(securityIds.map(async (id) => {
            if (id)
                await this.exchangeClient.infoModule.getSecurityByExchangeId(id)
        }))
        return await Promise.all(operations.map(op => this.operation(op)))
    }

    async order(order: Order): Promise<GetOrderType<CommonSubjectArea>> {
        const security = await this.exchangeClient.infoModule.getSecurityByExchangeId(order.figi)
        return {
            operation_type: this.orderOperation(order),
            run_id: null,
            status_first: this.orderStatus(order),
            exchange_id: order.orderId,
            created_at: new Date(),
            amount: order.requestedLots,
            price: order.price,
            security_ticker: security?.ticker || 'undefined'
        }
    }

    orderStatus(order: Order): OrderStatus {
        switch (order.status) {
            case "New": return 'new'
            case "Cancelled": return 'cancelled'
            case "Fill": return 'fill'
            case "PartiallyFill": return "partially_fill"
            case "Replaced": return 'replaced'
            case "Rejected": return 'rejected'
            case "PendingNew": return 'pending_new'
            case "PendingReplace": return 'pending_replace'
            case 'PendingCancel': return 'pending_cancel'
            default: return 'undefined'
        }
    }

    orderOperation(order: Order): OperationType {
        switch (order.operation) {
            case "Buy": return "limit_buy"
            case "BuyOrCancel": return "buy_or_cancel"
            case "MarketBuy": return 'market_buy'
            case "MarketSell": return  'market_sell'
            case "Sell": return 'limit_sell'
            case "SellOrCancel": return 'sell_or_cancel'
            default: return 'undefined'
        }
    }
}