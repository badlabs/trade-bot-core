import {AbstractInfoModule} from "./AbstractInfoModule";
import {AbstractTradeModule} from "./AbstractTradeModule";
import {AbstractTranslator} from "./AbstractTranslator";
import {SubjectAreaTemplate} from "../types";
import {GetCurrencyBalanceType, GetOperationType, GetPortfolioType} from "../types/extractors";

export abstract class AbstractExchangeClient<
  ExchangeApiType = any,
  SubjectArea extends SubjectAreaTemplate = SubjectAreaTemplate> {

  abstract readonly api: ExchangeApiType
  abstract readonly tradeModule: AbstractTradeModule<AbstractExchangeClient<ExchangeApiType, SubjectArea>>
  abstract readonly infoModule: AbstractInfoModule<AbstractExchangeClient<ExchangeApiType, SubjectArea>>
  abstract readonly translator: AbstractTranslator<AbstractExchangeClient<ExchangeApiType, SubjectArea>>

  private _isAccountInitialized: boolean = false
  public get isAccountInitialized(): boolean { return this._isAccountInitialized }
  protected set isAccountInitialized(value: boolean) { this._isAccountInitialized = value }


  protected abstract initAccount(): Promise<unknown>

  abstract getPortfolio(): Promise<GetPortfolioType<SubjectArea>>

  abstract getCurrenciesBalance(): Promise<GetCurrencyBalanceType<SubjectArea>[]>

  abstract getOperationsAll(from: Date, to: Date): Promise<GetOperationType<SubjectArea>[]>

  abstract getOperationsBySecurity(ticker: string, from: Date, to: Date): Promise<GetOperationType<SubjectArea>[]>
}
