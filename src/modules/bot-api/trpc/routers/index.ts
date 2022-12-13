import {TradeBot} from "../../../../TradeBot";
import {publicProcedure, router} from "../trpc";
import initAlgorithmRouter from './algorithm'
import initSecurityRouter from './security'
import initCurrencyRouter from './currency'
import initPortfolioRouter from './portfolio'
import initOrderRouter from './order'

export default (tradeBot: TradeBot) => {
    return router({
        test: publicProcedure.query(() => 'hello'),
        algorithm: initAlgorithmRouter(tradeBot),
        security: initSecurityRouter(tradeBot),
        currency: initCurrencyRouter(tradeBot),
        portfolio: initPortfolioRouter(tradeBot),
        order: initOrderRouter(tradeBot)
    })
}