import { OrderDetails } from "../../utils";
import {AbstractExchangeClient} from "../../AbstractExchangeClient";

export abstract class AbstractTradeModule<
  ExchangeApiType,
  CurrencyType, CurrencyBalanceType,
  SecurityType, OrderType,
  PortfolioType, OperationType> {
  protected readonly exchangeClient: AbstractExchangeClient<
    ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>

  protected constructor(exchangeClient: AbstractExchangeClient<
    ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>){
    this.exchangeClient = exchangeClient
  }

  abstract sell({ ticker, lots, price }: OrderDetails): Promise<OrderType>

  abstract buy({ ticker, lots, price }: OrderDetails): Promise<OrderType>

  abstract marketSell({ ticker, lots }: OrderDetails): Promise<OrderType>

  abstract marketBuy({ ticker, lots }: OrderDetails): Promise<OrderType>

  abstract sellOrCancel(): Promise<OrderType>

  abstract buyOrCancel(): Promise<OrderType>

}
