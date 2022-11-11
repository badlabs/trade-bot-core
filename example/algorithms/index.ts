import {
    AbstractTradeAlgorithm
} from "lib/modules/TradeBot";
import {SlicingAlgorithm} from "./slicing/SlicingAlgorithm";
import {ExchangeAnalyzer} from "lib/modules/TradeBot";
import {HammerAlgorithm} from "./hammer/HammerAlgorithm";
import {AggressiveTradingAlgorithm} from "./aggressive-trading/AggressiveTradingAlgorithm";
import {ExchangeClient} from "../exchange-client";

export function initAlgorithms(analyzer: ExchangeAnalyzer<ExchangeClient>): AbstractTradeAlgorithm<ExchangeClient, any, any, any>[] {
    return [
        new SlicingAlgorithm(analyzer),
        new HammerAlgorithm(analyzer),
        new AggressiveTradingAlgorithm(analyzer)
    ]
}
