import {TradeBot} from "../../TradeBot";
import {IExpressAppCarrier} from '../../types/rest'

export function getTradeBotFromExpress(expressAppCarrier: IExpressAppCarrier): TradeBot {
    return expressAppCarrier.app.get('tradeBot')
}