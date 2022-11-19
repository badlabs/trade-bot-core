import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetSecurityBalanceType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['securityBalance'] :
        T extends DomainTemplate ? T['securityBalance'] : never