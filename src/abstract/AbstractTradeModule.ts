import {AbstractExchangeClient} from './AbstractExchangeClient'
import {OperationType} from '../db'
import {GetOrderType} from "../types/extractors";

export type CreateOrderOptions = {
  operation: OperationType
  ticker: string
  lots: number
  price: number
}

export abstract class AbstractTradeModule<ExchangeClient extends AbstractExchangeClient> {
  protected exchangeClient: ExchangeClient

  setExchangeClient(exchangeClient: ExchangeClient){
    this.exchangeClient = exchangeClient
  }

  abstract sell({ ticker, lots, price }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract buy({ ticker, lots, price }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract marketSell({ ticker, lots }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract marketBuy({ ticker, lots }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract sellOrCancel(): Promise<GetOrderType<ExchangeClient>>

  abstract buyOrCancel(): Promise<GetOrderType<ExchangeClient>>

}
