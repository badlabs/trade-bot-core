import {AbstractExchangeClient} from "./AbstractExchangeClient";
import {GetCurrencyType, GetSecurityType} from "../types/extractors";

export abstract class AbstractInfoModule<ExchangeClient extends AbstractExchangeClient> {
  protected exchangeClient: ExchangeClient

  setExchangeClient(exchangeClient: ExchangeClient){
    this.exchangeClient = exchangeClient
  }

  abstract getCurrencies(): Promise<GetCurrencyType<ExchangeClient>[]>

  abstract getSecurityLastPrice(ticker: string): Promise<number>

  abstract getSecurityCurrency(ticker: string): Promise<GetCurrencyType<ExchangeClient>>

  abstract getSecurityName(ticker: string): Promise<string>

  abstract getSecurity(ticker: string, ignoreCache?: boolean): Promise<GetSecurityType<ExchangeClient> | null>

  abstract getSecurityByExchangeId(id: string, ignoreCache?: boolean): Promise<GetSecurityType<ExchangeClient> | null>
}
