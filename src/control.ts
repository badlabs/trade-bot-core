import {ExchangeAnalyzer} from "./modules";
import {AbstractExchangeClient, AbstractTradeAlgorithm} from "./abstract";
import {TradeBot, TradeBotInitOptions} from "./TradeBot";

export function runTradeBot<ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient>(
    options: TradeBotInitOptions<ExchangeClient>){
    return new TradeBot<ExchangeClient>(options)
}