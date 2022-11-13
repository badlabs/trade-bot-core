import {AbstractExchangeClient} from "../../abstract";
import {DomainTemplate} from "../DomainTemplate";

export type GetOrderType<T> =
    T extends AbstractExchangeClient<infer Domain> ? Domain['order'] :
        T extends DomainTemplate ? T['order'] : never