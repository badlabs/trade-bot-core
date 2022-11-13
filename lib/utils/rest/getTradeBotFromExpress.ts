import {TradeBot} from "../../TradeBot";
import {AbstractExchangeClient} from "../../abstract";
import {IExpressAppCarrier} from '../../types/rest'

export function getTradeBotFromExpress(expressAppCarrier: IExpressAppCarrier): TradeBot<AbstractExchangeClient> {
    return expressAppCarrier.app.get('tradeBot')
}