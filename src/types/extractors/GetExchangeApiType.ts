import {AbstractExchangeClient} from "../../abstract"

export type GetExchangeApiType<ExchangeClient> =
    ExchangeClient extends AbstractExchangeClient ? ExchangeClient['api'] : never