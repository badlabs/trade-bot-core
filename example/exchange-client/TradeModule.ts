import { CreateOrderOptions } from '../../lib/types'
import {AbstractTradeModule} from '../../lib/abstract'
import {
  PlacedLimitOrder,
  PlacedMarketOrder
} from '@tinkoff/invest-openapi-js-sdk'
import {Domain} from "../Domain";
import {GetOrderType} from "../../lib/types/extractors";
import {ExchangeClient} from "./ExchangeClient";

export class TradeModule extends AbstractTradeModule<ExchangeClient>{

  private static placedLimitOrderToOrder(order: PlacedLimitOrder, figi: string, price: number): GetOrderType<Domain> {
    return {
      figi,
      operation: order.operation,
      price,
      status: order.status,
      orderId: order.orderId,
      requestedLots: order.requestedLots,
      type: "Limit",
      executedLots: order.executedLots
    }
  }

  private async placedMarketOrderToOrder(order: PlacedMarketOrder, figi: string, ticker: string):
      Promise<GetOrderType<Domain>> {
    const price = await this.exchangeClient.infoModule.getSecurityLastPrice(ticker)
    return {
      figi,
      operation: order.operation,
      price,
      status: order.status,
      orderId: order.orderId,
      requestedLots: order.requestedLots,
      type: "Market",
      executedLots: order.executedLots
    }
  }

  // TODO: move to utils
  private async getFigi(ticker: string): Promise<string> {
    const { exchangeClient } = this
    const security = await exchangeClient.infoModule.getSecurity(ticker, false)
    if (!security) throw new Error(`Security ${ticker} not found`)
    const { figi } = security
    return figi
  }

  public async sell({ ticker, lots, price }: CreateOrderOptions) {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.limitOrder({figi, operation: 'Sell', lots, price})
    return TradeModule.placedLimitOrderToOrder(placedOrder, figi, price)
  }

  public async buy({ ticker, lots, price }: CreateOrderOptions) {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.limitOrder({figi, operation: 'Buy', lots, price})
    return TradeModule.placedLimitOrderToOrder(placedOrder, figi, price)
  }

  public async marketSell({ ticker, lots }: CreateOrderOptions) {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.marketOrder({figi, operation: 'Sell', lots})
    return this.placedMarketOrderToOrder(placedOrder, figi, ticker)
  }

  public async marketBuy({ ticker, lots }: CreateOrderOptions) {
    const { exchangeClient } = this
    const figi = await this.getFigi(ticker)
    const placedOrder = await exchangeClient.api.marketOrder({figi, operation: 'Buy', lots})
    return this.placedMarketOrderToOrder(placedOrder, figi, ticker)
  }

  public async sellOrCancel(): Promise<GetOrderType<Domain>> {
    throw new Error("Method not implemented.");
  }

  public async buyOrCancel(): Promise<GetOrderType<Domain>> {
    throw new Error("Method not implemented.");
  }

}
