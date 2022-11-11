import {AbstractExchangeClient} from "../../AbstractExchangeClient";
import {ITranslatorsCD} from "../../utils";
import {initTranslators} from "../../../src/cdTranslators";

export abstract class AbstractInfoModule<
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

  abstract readonly translators: ITranslatorsCD<AbstractExchangeClient<
    ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>>

  abstract getCurrencies(): Promise<CurrencyType[]>

  abstract getSecurityLastPrice(ticker: string): Promise<number>

  abstract getSecurityCurrency(ticker: string): Promise<CurrencyType>

  abstract getSecurityName(ticker: string): Promise<string>

  abstract getSecurity(ticker: string, ignoreCache: boolean): Promise<SecurityType | null>

  abstract getSecurityByExchangeId(id: string, ignoreCache: boolean): Promise<SecurityType | null>
}
