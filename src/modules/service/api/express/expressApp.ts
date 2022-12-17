import express from 'express'
import cors from 'cors'
import { apiRouter } from './routers'
import {TradeBot} from "../../../../TradeBot";

export function initExpress(tradeBot: TradeBot){
    const app = express()
    app.use(express.json())
    app.use(cors())

    const packageJson = require('../../../../../package.json')

    app.get('/', function (req, res) {
        res.send(`This is tradebot v${packageJson.version}`)
    })

    app.use('/api', apiRouter)

    app.set('tradeBot', tradeBot)

    return app
}