import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetCurrencyBalanceType<T> =
    T extends AbstractExchangeClient<infer SubjectArea> ? SubjectArea['currencyBalance'] :
        T extends SubjectAreaTemplate ? T['currencyBalance'] : never