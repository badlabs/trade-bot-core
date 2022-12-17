import { publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        list: publicProcedure
            .query(() => {
                return tradeBot.analyzer.tradeAlgos.description
            }),
        listRuns: publicProcedure
            .input(
                z.object({
                    algorithmName: z.string()
                })
            )
            .query(async ({ input }) => {
                return await tradeBot.analyzer.getAlgorithmRunsByAlgorithm(input.algorithmName)
            }),
        run: publicProcedure
            .input(
                z.object({
                    algorithmName: z.string(),
                    inputs: z.any()
                })
            )
            .mutation(async ({ input }) => {
                return await tradeBot.analyzer.tradeAlgos.runAlgorithm(input.algorithmName, input.inputs)
            }),
        stop: publicProcedure
            .input(
                z.object({
                    algorithmName: z.string(),
                    runId: z.number().int().min(0)
                })
            )
            .mutation(async ({ input }) => {
                return await tradeBot.analyzer.tradeAlgos.stopAlgorithm(input.algorithmName, input.runId)
            }),
        resume: publicProcedure
            .input(
                z.object({
                    algorithmName: z.string(),
                    runId: z.number().int().min(0)
                })
            )
            .mutation(async ({ input }) => {
                return await tradeBot.analyzer.tradeAlgos.continueAlgorithm(input.algorithmName, input.runId)
            })
    })
}