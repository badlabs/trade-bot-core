import { ExchangeClient } from "./ExchangeClient";
import {AbstractInfoModule} from "../../lib/modules";
import OpenAPI, {
  Currency,
  CurrencyPosition,
  MarketInstrument,
  Operation,
  Portfolio
} from "@tinkoff/invest-openapi-js-sdk";
import {Order} from "../exchangeClientTypes";
import {ITranslatorsCD, OperationType, OrderStatus} from "../../lib/utils";
import {D_Currency, D_CurrencyBalance, D_Operation, D_Order, D_PortfolioPosition, D_Security} from "@prisma/client";

const securitiesCache = new Map<string, MarketInstrument>()

export class InfoModule extends AbstractInfoModule<
  OpenAPI,
  Currency, CurrencyPosition,
  MarketInstrument, Order,
  Portfolio, Operation >{

  constructor(exchangeClient: ExchangeClient){
    super(exchangeClient)
  }

  async getCurrencies() {
    return [ 'CHF', "CNY", 'EUR', "GBP", "HKD", "JPY", "RUB", "TRY", "USD" ] as Currency[]
  }

  async getSecurityLastPrice(ticker: string): Promise<number> {
    const { exchangeClient } = this
    const security = await this.getSecurity(ticker, true)
    const orderBook = await exchangeClient.api.orderbookGet({ figi: security?.figi || '' })
    return orderBook?.lastPrice || 0
  }

  async getSecurityCurrency(ticker: string): Promise<Currency> {
    const { getSecurity } = this
    const security = await getSecurity(ticker)
    if (!security) throw new Error(`Security with ticker "${ticker}" was not found`)
    if (!security.currency) throw new Error(`Security with ticker "${ticker}" has no currency`)
    return security.currency
  }

  async getSecurityName(ticker: string): Promise<string> {
    const { getSecurity } = this
    const security = await getSecurity(ticker)
    return security?.name || ''
  }

  async getSecurity(ticker: string, ignoreCache: boolean = false): Promise<MarketInstrument | null> {
    const { exchangeClient } = this
    if (!securitiesCache.has(ticker) || ignoreCache){
      const security = await exchangeClient.api.searchOne({ ticker })
      if (!security) return null
      securitiesCache.set(ticker, security)
      return security
    }
    // @ts-ignore
    return securitiesCache.get(ticker)
  }

  async getSecurityByExchangeId(id: string, ignoreCache: boolean = false): Promise<MarketInstrument | null>{
    const { exchangeClient } = this
    if (!securitiesCache.has(id) || ignoreCache){
      const security = await exchangeClient.api.searchOne({ figi: id })
      if (!security) return null
      securitiesCache.set(id, security)
      return security
    }
    // @ts-ignore
    return securitiesCache.get(id)
  }

  readonly translators: ITranslatorsCD<ExchangeClient> = {
    async currency(currency): Promise<D_Currency> {
      return { name: currency, ticker: currency }
    },
    async currencyBalance(currency): Promise<D_CurrencyBalance> {
      return { currency_ticker: currency.currency, balance: currency.balance }
    },
    async portfolio(portfolio): Promise<D_PortfolioPosition[]> {
      return portfolio.positions
        .map(position => {
          return {
            security_ticker: position.ticker || 'undefined',
            amount: position.balance
          }
        })
    },
    async security(security): Promise<D_Security> {
      if (!security.currency) throw new Error(`Security with ticker "${security.ticker}" have no currency`)
      return {
        currency_ticker: security.currency,
        name: security.name,
        price: await this.exchangeClient.infoModule.getSecurityLastPrice(security.ticker),
        ticker: security.ticker
      }
    },
    async operation(operation): Promise<D_Operation> {
      const security = operation?.figi ?
        await this.exchangeClient.infoModule.getSecurityByExchangeId(operation?.figi) :
        null
      return {
        security_ticker: security?.ticker || null,
        amount: operation?.quantityExecuted || null,
        amount_requested: operation?.quantity || null,
        created_at: new Date(operation.date),
        exchange_id: operation.id,
        operation_type: operation.operationType === "Buy" ? 'buy' : operation.operationType === "Sell" ? 'sell' : 'other',
        price: operation?.price || 0,
        status: operation.status,
        updated_at: new Date(),
      }
    },
    async operations(operations): Promise<D_Operation[]> {
      const securityIds = Array.from(new Set(operations.map(op => op.figi)))
      await Promise.all(securityIds.map(async (id) => {
        if (id)
          await this.exchangeClient.infoModule.getSecurityByExchangeId(id)
      }))
      return await Promise.all(operations.map(op => this.operation(op)))
    },
    async order(order): Promise<D_Order> {
      const security = await this.exchangeClient.infoModule.getSecurityByExchangeId(order.figi)
      return {
        operation_type: this.orderOperation(order),
        run_id: null,
        status_first: order.status,
        exchange_id: order.orderId,
        created_at: new Date(),
        amount: order.requestedLots,
        price: order.price,
        security_ticker: security?.ticker || 'undefined'
      }
    },
    orderStatus(order): OrderStatus {
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
      }
    },
    orderOperation(order): OperationType {
      switch (order.operation) {
        case "Buy": return "limit_buy"
        case "BuyOrCancel": return "buy_or_cancel"
        case "MarketBuy": return 'market_buy'
        case "MarketSell": return  'market_sell'
        case "Sell": return 'limit_sell'
        case "SellOrCancel": return 'sell_or_cancel'
      }
    }
  }
}
