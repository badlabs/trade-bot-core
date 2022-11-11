import {
    AbstractTradeAlgorithm
} from "lib/modules/TradeBot";
import {SlicingAlgorithm} from "./SlicingAlgorithm";
import {ExchangeAnalyzer} from "lib/modules/TradeBot";
import {HammerAlgorithm} from "./HammerAlgorithm";
import {AggressiveTradingAlgorithm} from "./AggressiveTradingAlgorithm";
import {ExchangeClient} from "../ExchangeClient";

export function initAlgorithms(analyzer: ExchangeAnalyzer<ExchangeClient>): AbstractTradeAlgorithm<ExchangeClient, any, any, any>[] {
    return [
        new SlicingAlgorithm(analyzer),
        new HammerAlgorithm(analyzer),
        new AggressiveTradingAlgorithm(analyzer)
    ]
}
