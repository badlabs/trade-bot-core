import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetSecurityType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['security'] :
        T extends DomainTemplate ? T['security'] : never