import {observable} from '@trpc/server/observable'
import {z} from 'zod'
import {TradeBot} from "../../../../../../TradeBot";
import {publicProcedure, router} from "./trpc";
import {SocketLogs} from "../../../../../../types";
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
            .subscription(({ input, ctx }) => {
                return observable<SocketLogs>((emit) => {
                    if (!tradeBot.auth.authByToken(input.auth?.token)) {
                        emit.error(new TRPCError({
                            code: 'UNAUTHORIZED'
                        }))
                        tradeBot.logger.log({
                            type: 'warning',
                            message: `Unauthorized attempt of reading logs`,
                            attachment: {
                                remote: ctx.req.socket.remoteAddress
                            }
                        })
                        return () => {}
                    }
                    tradeBot.logger.log({
                        type: 'info',
                        message: `Logs subscription started`,
                        attachment: {
                            remote: ctx.req.socket.remoteAddress
                        }
                    })
                    const onLog = (log: SocketLogs) => {
                        emit.next(log)
                    }
                    tradeBot.logger.subscribe(onLog)

                    return () => {
                        tradeBot.logger.log({
                            type: 'info',
                            message: `Logs subscription finished`,
                            attachment: {
                                remote: ctx.req.socket.remoteAddress
                            }
                        })
                        tradeBot.logger.unsubscribe(onLog)
                    }
                })
        })
    })
}