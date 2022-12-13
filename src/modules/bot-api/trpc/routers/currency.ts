import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        getAll: publicProcedure
            .input(z.undefined())
            .query(async () => {
                return await tradeBot.analyzer.getCurrencies()
            }),
        updateAll: publicProcedure
            .input(z.undefined())
            .mutation(async () => {
                return await tradeBot.analyzer.updateCurrencies()
            }),
        getAllBalances: publicProcedure
            .input(z.undefined())
            .query(async () => {
                return await tradeBot.analyzer.getCurrenciesBalance()
            }),
        updateAllBalances: publicProcedure
            .input(z.undefined())
            .mutation(async () => {
                return await tradeBot.analyzer.updateCurrenciesBalance()
            })
    })
}