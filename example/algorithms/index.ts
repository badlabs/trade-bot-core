import {
    AbstractTradeAlgorithm
} from "lib/modules";
import {SlicingAlgorithm} from "./slicing/logic";
import {ExchangeAnalyzer} from "lib/modules";
import {HammerAlgorithm} from "./hammer/logic";
import {AggressiveTradingAlgorithm} from "./aggressive-trading/logic";
import {ExchangeClient} from "../exchange-client";

export function initAlgorithms(analyzer: ExchangeAnalyzer<ExchangeClient>): AbstractTradeAlgorithm<ExchangeClient, any, any, any>[] {
    return [
        new SlicingAlgorithm(analyzer),
        new HammerAlgorithm(analyzer),
        new AggressiveTradingAlgorithm(analyzer)
    ]
}
