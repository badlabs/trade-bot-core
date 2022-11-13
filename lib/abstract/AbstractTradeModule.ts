import {AbstractExchangeClient} from './AbstractExchangeClient'
import {CreateOrderOptions} from '../types'
import {GetOrderType} from "../types/extractors";


export abstract class AbstractTradeModule<ExchangeClient extends AbstractExchangeClient> {
  protected readonly exchangeClient: ExchangeClient

  protected constructor(exchangeClient: ExchangeClient){
    this.exchangeClient = exchangeClient
  }

  abstract sell({ ticker, lots, price }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract buy({ ticker, lots, price }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract marketSell({ ticker, lots }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract marketBuy({ ticker, lots }: CreateOrderOptions): Promise<GetOrderType<ExchangeClient>>

  abstract sellOrCancel(): Promise<GetOrderType<ExchangeClient>>

  abstract buyOrCancel(): Promise<GetOrderType<ExchangeClient>>

}
