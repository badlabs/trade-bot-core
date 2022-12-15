import {observable} from '@trpc/server/observable'
import {TradeBot} from "../../../../../TradeBot";
import {publicProcedure, router} from "./trpc";
import {SocketLogs} from "../../../../../types";

export const initLogRouter = (tradeBot: TradeBot) => {
    return router({
        onEvent: publicProcedure
            .subscription(() => {
                return observable<SocketLogs>((emit) => {
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