import {AbstractExchangeClient} from "../../abstract";

export type GetDomain<ExchangeClient extends AbstractExchangeClient> =
    ExchangeClient extends AbstractExchangeClient<infer Domain> ? Domain : never