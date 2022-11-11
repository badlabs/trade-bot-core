import {AbstractInfoModule} from "./modules/AbstractExchangeClient/AbstractInfoModule";
import {AbstractTradeModule} from "./modules/AbstractExchangeClient/AbstractTradeModule";
import {AbstractTranslator} from "./utils";

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
  abstract readonly translator: AbstractTranslator<AbstractExchangeClient<
      ExchangeApiType,
      CurrencyType, CurrencyBalanceType,
      SecurityType, OrderType,
      PortfolioType, OperationType>>
  private _isAccountInitialized: boolean = false
  public get isAccountInitialized(): boolean { return this._isAccountInitialized }
  protected set isAccountInitialized(value: boolean) { this._isAccountInitialized = value }


  protected abstract initAccount(): Promise<unknown>

  abstract getPortfolio(): Promise<PortfolioType>

  abstract getCurrenciesBalance(): Promise<CurrencyBalanceType[]>

  abstract getOperationsAll(from: Date, to: Date): Promise<OperationType[]>

  abstract getOperationsBySecurity(ticker: string, from: Date, to: Date): Promise<OperationType[]>
}
