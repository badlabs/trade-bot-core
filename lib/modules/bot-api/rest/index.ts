import express from 'express'
var cors = require('cors')
import { NextFunction, Router, Request, Response } from "express";

const app = express()
app.use(express.json())

// create routes
const router = Router();

app.use(cors());

app.get('/', function (req, res) {
    res.send('This is tradebot v0.5.0')
})

import {algosRouter} from "./algorithms.router";
import { stateRouter } from "./state.router";
import { authRouter } from './auth.router'
import { getTradeBotFromExpress } from '../utils';
router.use('/auth', authRouter)
router.use((req: Request, res: Response, next: NextFunction) => {
    if (getTradeBotFromExpress(req).auth.authByRequest(req)) next()
    else res.status(401).send('Error: Not Authorized')
})
router.use('/algos', algosRouter)
router.use('/state', stateRouter)

app.use('/api', router)

// export app
export const expressApp = app
