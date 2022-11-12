import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetCurrencyType<T> =
    T extends AbstractExchangeClient<any, SubjectAreaTemplate<infer CurrencyType>> ? CurrencyType :
        T extends SubjectAreaTemplate<infer CurrencyType> ? CurrencyType : never