import {WebSocketServer} from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import {TradeBot} from "../../../../../TradeBot";
import {router, createContext} from "./trpc";
import {initLogRouter} from "./log";

const initWSRouter = (tradeBot: TradeBot) => {
    return router({
        log: initLogRouter(tradeBot)
    })
}

export const registerWSSHandler = ({wss, tradeBot}: { wss: WebSocketServer, tradeBot: TradeBot }) => {
    const handler = applyWSSHandler({
        wss,
        router: initWSRouter(tradeBot),
        createContext })
    return handler
}

export type WSRouter = ReturnType<typeof initWSRouter>