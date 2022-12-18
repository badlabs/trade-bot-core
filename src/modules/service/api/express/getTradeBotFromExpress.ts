import {TradeBot} from "../../../../TradeBot";
import {IExpressAppCarrier} from './IExpressAppCarrier'

export function getTradeBotFromExpress(expressAppCarrier: IExpressAppCarrier): TradeBot {
    return expressAppCarrier.app.get('tradeBot')
}