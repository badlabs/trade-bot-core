import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetCurrencyBalanceType<T> =
    T extends AbstractExchangeClient<any, SubjectAreaTemplate<any, infer CurrencyBalanceType>> ? CurrencyBalanceType :
        T extends SubjectAreaTemplate<any, infer CurrencyBalanceType> ? CurrencyBalanceType : never