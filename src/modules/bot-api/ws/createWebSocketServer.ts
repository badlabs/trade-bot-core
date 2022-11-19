import { Express } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { TradeBot } from '../../../TradeBot'

export function createWebSocketServer({expressApp, tradeBot}: { expressApp: Express, tradeBot: TradeBot }) {
    const httpServer = http.createServer(expressApp)
    const io = new Server(httpServer, {
        cors: { origin: "*" }
    })

    io.on('connection', (socket) => {
        if (!tradeBot.auth.authByRequest(socket.request)) io.close()
        socket.emit('message', 'Hello from tradebot...')
        socket.emit('log', tradeBot.logger.getLastLogs())
    });

    return {httpServer, webSocketServer: io}
}