import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        getAll: publicProcedure
            .input(z.null())
            .query(() => {
                return tradeBot.analyzer.tradeAlgos.description
            }),
        getRuns: publicProcedure
            .input(
                z.object({
                    name: z.string()
                })
            )
            .query(async ({ input }) => {
                return await tradeBot.analyzer.getAlgorithmRunsByAlgorithm(input.name)
            }),
        run: publicProcedure
            .input(
                z.object({
                    name: z.string(),
                    inputs: z.any()
                })
            )
            .mutation(async ({ input }) => {
                return await tradeBot.analyzer.tradeAlgos.runAlgorithm(input.name, input.inputs)
            }),
        stop: publicProcedure
            .input(
                z.object({
                    name: z.string(),
                    id: z.number().int().min(0)
                })
            )
            .mutation(async ({ input }) => {
                return await tradeBot.analyzer.tradeAlgos.stopAlgorithm(input.name, input.id)
            }),
        resume: publicProcedure
            .input(
                z.object({
                    name: z.string(),
                    id: z.number().int().min(0)
                })
            )
            .mutation(async ({ input }) => {
                return await tradeBot.analyzer.tradeAlgos.continueAlgorithm(input.name, input.id)
            })
    })
}