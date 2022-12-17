import { publicProcedure, router } from './trpc'
import { z } from 'zod'
import { TradeBot } from "../../../../../../TradeBot";

export default (tradeBot: TradeBot) => {
    return router({
        list: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getSecurities()
            }),
        update: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updateSecurities()
            }),
        listFollowed: publicProcedure
            .query(async () => {
                return await tradeBot.analyzer.getFollowedSecurities()
            }),
        updateFollowed: publicProcedure
            .mutation(async () => {
                return await tradeBot.analyzer.updateFollowedSecurities()
            }),
        follow: publicProcedure
            .input(
                z.object({
                    securityTicker: z.string()
                })
            )
            .mutation(async ({input}) => {
                return await tradeBot.analyzer.followSecurity(input.securityTicker)
            }),
        unfollow: publicProcedure
            .input(
                z.object({
                    securityTicker: z.string()
                })
            )
            .mutation(async ({input}) => {
                return await tradeBot.analyzer.unfollowSecurity(input.securityTicker)
            })
    })
}