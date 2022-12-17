import {observable} from '@trpc/server/observable'
import {z} from 'zod'
import {TradeBot} from "../../../../../TradeBot";
import {publicProcedure, router} from "./trpc";
import {SocketLogs} from "../../../../../types";
import {TRPCError} from "@trpc/server";

export const initLogRouter = (tradeBot: TradeBot) => {
    return router({
        onEvent: publicProcedure
            .input(
                z.object({
                    auth: z.object({
                        token: z.string().optional()
                    }).optional()
                })
            )
            .subscription(({ input }) => {
                return observable<SocketLogs>((emit) => {
                    if (!tradeBot.auth.authByToken(input.auth?.token)) {
                        emit.error(new TRPCError({
                            code: 'UNAUTHORIZED'
                        }))
                        return () => {}
                    }
                    const onLog = (log: SocketLogs) => {
                        emit.next(log)
                    }
                    tradeBot.logger.subscribe(onLog)

                    return () => {
                        tradeBot.logger.unsubscribe(onLog)
                    }
                })
        })
    })
}