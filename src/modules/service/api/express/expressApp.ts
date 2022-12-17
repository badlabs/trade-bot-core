import express from 'express'
import cors from 'cors'
import { apiRouter } from './routers'
import {TradeBot} from "../../../../TradeBot";
import {getTradeBotFromExpress} from "../../../../utils/rest";

export function initExpress(tradeBot: TradeBot){
    const app = express()
    app.use(express.json())
    app.use(cors())

    const packageJson = require('../../../../../package.json')

    app.use((req, res, next) => {
        getTradeBotFromExpress(req).logger.log({
            type: 'info',
            message: `Incoming HTTP request: ${req.method} ${req.path}`,
            attachment: {
                remote: req.socket.remoteAddress,
                params: req.query,
                body: req.body
            }
        })
        next()
    })

    app.get('/', function (req, res) {
        res.send(`This is tradebot v${packageJson.version}`)
    })

    app.use('/api', apiRouter)

    app.set('tradeBot', tradeBot)

    return app
}