import {OperationType} from "../../db";

export function stringToOperationType(str: string): OperationType {
    switch (str) {
        case 'limit_buy': return "limit_buy"
        case 'market_buy': return "market_buy"
        case 'buy_or_cancel': return 'market_buy'
        case 'limit_sell': return "limit_sell"
        case 'market_sell': return "market_sell"
        case 'sell_or_cancel': return 'market_sell'
        default: throw new Error(`${str} is not an operation type.`)
    }
}