import { publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        get: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getPortfolio()
            }),
        update: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updatePortfolio()
            }),
        clear: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.clearPortfolio()
            }),
    })
}