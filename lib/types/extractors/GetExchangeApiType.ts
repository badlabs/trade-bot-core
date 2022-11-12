import {AbstractExchangeClient} from "../../abstract"

export type GetExchangeApiType<ExchangeClient> =
    ExchangeClient extends AbstractExchangeClient<infer ExchangeApiType> ? ExchangeApiType : never