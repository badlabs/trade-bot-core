import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetCurrencyType<T> =
    T extends AbstractExchangeClient<infer SubjectArea> ? SubjectArea['currency'] :
        T extends SubjectAreaTemplate ? T['currency'] : never