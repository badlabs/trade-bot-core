import {AbstractExchangeClient} from './AbstractExchangeClient'
import {CreateOrderOptions, SubjectAreaTemplate} from '../types'
import {GetOrderType} from "../types/extractors";


export abstract class AbstractTradeModule<SubjectArea extends SubjectAreaTemplate> {
  protected readonly exchangeClient: AbstractExchangeClient<SubjectArea>

  protected constructor(exchangeClient: AbstractExchangeClient<SubjectArea>){
    this.exchangeClient = exchangeClient
  }

  abstract sell({ ticker, lots, price }: CreateOrderOptions): Promise<GetOrderType<SubjectArea>>

  abstract buy({ ticker, lots, price }: CreateOrderOptions): Promise<GetOrderType<SubjectArea>>

  abstract marketSell({ ticker, lots }: CreateOrderOptions): Promise<GetOrderType<SubjectArea>>

  abstract marketBuy({ ticker, lots }: CreateOrderOptions): Promise<GetOrderType<SubjectArea>>

  abstract sellOrCancel(): Promise<GetOrderType<SubjectArea>>

  abstract buyOrCancel(): Promise<GetOrderType<SubjectArea>>

}
