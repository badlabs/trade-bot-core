import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetPortfolioType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['portfolio'] :
        T extends DomainTemplate ? T['portfolio'] : never