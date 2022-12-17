import { publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        getAll: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getCurrencies()
            }),
        updateAll: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updateCurrencies()
            }),
        getAllBalances: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getCurrenciesBalance()
            }),
        updateAllBalances: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updateCurrenciesBalance()
            })
    })
}