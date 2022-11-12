import {AbstractExchangeClient} from "./AbstractExchangeClient";
import {SubjectAreaTemplate} from "../types";
import {GetCurrencyType, GetSecurityType} from "../types/extractors";

export abstract class AbstractInfoModule<
  ExchangeApiType = any,
  SubjectArea extends SubjectAreaTemplate = SubjectAreaTemplate> {
  protected readonly exchangeClient: AbstractExchangeClient<ExchangeApiType, SubjectArea>

  protected constructor(exchangeClient: AbstractExchangeClient<ExchangeApiType, SubjectArea>){
    this.exchangeClient = exchangeClient
  }

  abstract getCurrencies(): Promise<GetCurrencyType<SubjectArea>[]>

  abstract getSecurityLastPrice(ticker: string): Promise<number>

  abstract getSecurityCurrency(ticker: string): Promise<GetCurrencyType<SubjectArea>>

  abstract getSecurityName(ticker: string): Promise<string>

  abstract getSecurity(ticker: string, ignoreCache?: boolean): Promise<GetSecurityType<SubjectArea> | null>

  abstract getSecurityByExchangeId(id: string, ignoreCache?: boolean): Promise<GetSecurityType<SubjectArea> | null>
}
