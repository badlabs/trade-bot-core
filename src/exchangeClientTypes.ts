import {Order as ImportedOrder} from "@tinkoff/invest-openapi-js-sdk";

export type Order = Omit<ImportedOrder, 'operation'> &
    { operation: 'Buy'| 'Sell' |
            'MarketBuy' | 'MarketSell' |
            'BuyOrCancel' | 'SellOrCancel' }
