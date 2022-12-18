import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetCurrencyType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['currency'] :
        T extends DomainTemplate ? T['currency'] : never