import {AbstractInfoModule} from "./AbstractInfoModule";
import {AbstractTradeModule} from "./AbstractTradeModule";
import {AbstractTranslator} from "./AbstractTranslator";
import {SubjectAreaTemplate} from "../types";
import {GetCurrencyBalanceType, GetOperationType, GetPortfolioType} from "../types/extractors";

export abstract class AbstractExchangeClient<
    SubjectArea extends SubjectAreaTemplate = SubjectAreaTemplate,
    ExchangeApiType = any> {
  private _isAccountInitialized: boolean = false
  public get isAccountInitialized(): boolean { return this._isAccountInitialized }
  protected set isAccountInitialized(value: boolean) { this._isAccountInitialized = value }

  readonly api: ExchangeApiType
  readonly tradeModule: AbstractTradeModule<AbstractExchangeClient<SubjectArea, ExchangeApiType>>
  readonly infoModule: AbstractInfoModule<AbstractExchangeClient<SubjectArea, ExchangeApiType>>
  readonly translator: AbstractTranslator<AbstractExchangeClient<SubjectArea, ExchangeApiType>>

  protected constructor(modules: {
    tradeModule: AbstractTradeModule<AbstractExchangeClient<SubjectArea, ExchangeApiType>>
    infoModule: AbstractInfoModule<AbstractExchangeClient<SubjectArea, ExchangeApiType>>
    translator: AbstractTranslator<AbstractExchangeClient<SubjectArea, ExchangeApiType>>
  }, api: ExchangeApiType) {
    this.api = api
    this.tradeModule = modules.tradeModule
    this.infoModule = modules.infoModule
    this.translator = modules.translator
    this.tradeModule.setExchangeClient(this)
    this.infoModule.setExchangeClient(this)
    this.translator.setExchangeClient(this)
    this.initAccount()
  }

  protected abstract initAccount(): Promise<unknown>

  abstract getPortfolio(): Promise<GetPortfolioType<SubjectArea>>

  abstract getCurrenciesBalance(): Promise<GetCurrencyBalanceType<SubjectArea>[]>

  abstract getOperationsAll(from: Date, to: Date): Promise<GetOperationType<SubjectArea>[]>

  abstract getOperationsBySecurity(ticker: string, from: Date, to: Date): Promise<GetOperationType<SubjectArea>[]>
}
