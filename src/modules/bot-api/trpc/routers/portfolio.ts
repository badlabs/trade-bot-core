import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        get: publicProcedure
            .input(z.null())
            .query(async () => {
                return await tradeBot.analyzer.getPortfolio()
            }),
        update: publicProcedure
            .input(z.null())
            .mutation(async () => {
                return await tradeBot.analyzer.updatePortfolio()
            }),
        clear: publicProcedure
            .input(z.null())
            .mutation(async () => {
                return await tradeBot.analyzer.clearPortfolio()
            }),
    })
}