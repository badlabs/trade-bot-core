import {AbstractExchangeClient} from "./AbstractExchangeClient";
import {GetCurrencyType, GetSecurityType} from "../types/extractors";
import {SubjectAreaTemplate} from "../types";

export abstract class AbstractInfoModule<SubjectArea extends SubjectAreaTemplate> {
  protected exchangeClient: AbstractExchangeClient<SubjectArea>

  setExchangeClient(exchangeClient: AbstractExchangeClient<SubjectArea>){
    this.exchangeClient = exchangeClient
  }

  abstract getCurrencies(): Promise<GetCurrencyType<SubjectArea>[]>

  abstract getSecurityLastPrice(ticker: string): Promise<number>

  abstract getSecurityCurrency(ticker: string): Promise<GetCurrencyType<SubjectArea>>

  abstract getSecurityName(ticker: string): Promise<string>

  abstract getSecurity(ticker: string, ignoreCache?: boolean): Promise<GetSecurityType<SubjectArea> | null>

  abstract getSecurityByExchangeId(id: string, ignoreCache?: boolean): Promise<GetSecurityType<SubjectArea> | null>
}
