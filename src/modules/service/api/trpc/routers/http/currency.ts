import { publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        list: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getCurrencies()
            }),
        update: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updateCurrencies()
            }),
        listBalances: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getCurrenciesBalance()
            }),
        updateBalances: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updateCurrenciesBalance()
            })
    })
}