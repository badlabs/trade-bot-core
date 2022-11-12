import {AbstractInfoModule} from "./AbstractInfoModule";
import {AbstractTradeModule} from "./AbstractTradeModule";
import {AbstractTranslator} from "./AbstractTranslator";

export abstract class AbstractExchangeClient<
  ExchangeApiType,
  CurrencyType, CurrencyBalanceType,
  SecurityType, OrderType,
  PortfolioType, OperationType> {
  abstract readonly api: ExchangeApiType
  abstract readonly tradeModule: AbstractTradeModule<
    ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>
  abstract readonly infoModule: AbstractInfoModule<
    ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>
  abstract readonly translator: AbstractTranslator<
    ExchangeApiType,
    CurrencyType, CurrencyBalanceType,
    SecurityType, OrderType,
    PortfolioType, OperationType>
  private _isAccountInitialized: boolean = false
  public get isAccountInitialized(): boolean { return this._isAccountInitialized }
  protected set isAccountInitialized(value: boolean) { this._isAccountInitialized = value }


  protected abstract initAccount(): Promise<unknown>

  abstract getPortfolio(): Promise<PortfolioType>

  abstract getCurrenciesBalance(): Promise<CurrencyBalanceType[]>

  abstract getOperationsAll(from: Date, to: Date): Promise<OperationType[]>

  abstract getOperationsBySecurity(ticker: string, from: Date, to: Date): Promise<OperationType[]>
}
