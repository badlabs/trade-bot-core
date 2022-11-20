import {ExchangeAnalyzer} from "./modules";
import {AbstractExchangeClient, AbstractTradeAlgorithm} from "./abstract";
import {TradeBot} from "./TradeBot";

export function runTradeBot<ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient>(
    options: {
        exchangeClient: ExchangeClient,
        botToken?: string,
        initAlgorithmsCallback?:
            (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
    }){
    return new TradeBot<ExchangeClient>(options)
}