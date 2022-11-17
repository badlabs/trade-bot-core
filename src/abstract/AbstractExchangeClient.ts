import {AbstractInfoModule} from "./AbstractInfoModule";
import {AbstractTradeModule} from "./AbstractTradeModule";
import {AbstractTranslator} from "./AbstractTranslator";
import {DomainTemplate} from "../types";
import {GetCurrencyBalanceType, GetPortfolioType} from "../types/extractors";

export abstract class AbstractExchangeClient<
    Domain extends DomainTemplate = DomainTemplate,
    ExchangeApiType = any> {
  private _isAccountInitialized: boolean = false
  public get isAccountInitialized(): boolean { return this._isAccountInitialized }
  protected set isAccountInitialized(value: boolean) { this._isAccountInitialized = value }

  readonly api: ExchangeApiType
  readonly tradeModule: AbstractTradeModule<AbstractExchangeClient<Domain, ExchangeApiType>>
  readonly infoModule: AbstractInfoModule<AbstractExchangeClient<Domain, ExchangeApiType>>
  readonly translator: AbstractTranslator<AbstractExchangeClient<Domain, ExchangeApiType>>

  protected constructor(modules: {
    tradeModule: AbstractTradeModule<AbstractExchangeClient<Domain, ExchangeApiType>>
    infoModule: AbstractInfoModule<AbstractExchangeClient<Domain, ExchangeApiType>>
    translator: AbstractTranslator<AbstractExchangeClient<Domain, ExchangeApiType>>
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

  abstract getPortfolio(): Promise<GetPortfolioType<Domain>>

  abstract getCurrenciesBalance(): Promise<GetCurrencyBalanceType<Domain>[]>
}
