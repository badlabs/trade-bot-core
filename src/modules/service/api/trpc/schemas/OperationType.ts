import {z} from "zod";

export const operationType = z.enum(
    ['limit_buy', 'limit_sell',
            'market_buy', 'market_sell',
            'buy_or_cancel', 'sell_or_cancel', 'undefined'])