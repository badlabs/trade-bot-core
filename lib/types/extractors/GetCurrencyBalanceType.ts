import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetCurrencyBalanceType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['currencyBalance'] :
        T extends DomainTemplate ? T['currencyBalance'] : never