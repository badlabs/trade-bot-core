import express from 'express'
import cors from 'cors'
import {createService} from "json-rpc-ts-wrapper";
import { apiRouter } from './routers'
import {initServiceMethods} from "./service";
import {TradeBot} from "../../../TradeBot";

export function initExpress(tradeBot: TradeBot){
    const app = express()
    app.use(express.json())
    app.use(cors())

    const packageJson = require('../../../../package.json')

    app.get('/', function (req, res) {
        res.send(`This is tradebot v${packageJson.version}`)
    })

    app.use('/api', apiRouter)

    app.set('tradeBot', tradeBot)
    const jsonRpcService = createService(initServiceMethods(tradeBot))

    app.post('/json-rpc', (req, res) => {
        jsonRpcService
            .receive(req.body)
            .then(response => response ? res.send(response) : res.sendStatus(204))
    })

    return app
}