import { TradeBot } from 'lib/TradeBot'
import { AbstractExchangeClient } from 'lib/abstract'
import { OperationType } from 'lib/types'
import { IncomingHttpHeaders } from 'http'
import { Application } from 'express'

export interface IHttpHeadersCarrier {
    headers: IncomingHttpHeaders
}

interface IExpressAppCarrier {
    app: Application
}

export function getTradeBotFromExpress(expressAppCarrier: IExpressAppCarrier): TradeBot<AbstractExchangeClient<any, any, any, any, any, any, any>> {
    return expressAppCarrier.app.get('tradeBot')
}

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
