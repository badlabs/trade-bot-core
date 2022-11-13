import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetOperationType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['operation'] :
        T extends DomainTemplate ? T['operation'] : never