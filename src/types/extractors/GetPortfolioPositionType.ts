import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetPortfolioPositionType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['securityBalance'] | Domain['currencyBalance'] :
        T extends DomainTemplate ? T['securityBalance'] | T['currencyBalance'] : never