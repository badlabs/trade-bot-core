import { createExpressMiddleware } from '@trpc/server/adapters/express';
import {Express} from "express";
import {TradeBot} from "../../../../../TradeBot";
import {createContext, publicProcedure, router} from "./trpc";
import initAlgorithmRouter from './algorithm'
import initSecurityRouter from './security'
import initCurrencyRouter from './currency'
import initPortfolioRouter from './portfolio'
import initOrderRouter from './order'


const initRESTRouter = (tradeBot: TradeBot) => {
    return router({
        test: publicProcedure.query(() => 'hello'),
        algorithm: initAlgorithmRouter(tradeBot),
        security: initSecurityRouter(tradeBot),
        currency: initCurrencyRouter(tradeBot),
        portfolio: initPortfolioRouter(tradeBot),
        order: initOrderRouter(tradeBot)
    })
}

export const registerExpressRoutes = ({tradeBot, express}: {tradeBot: TradeBot, express: Express}) => {
    express.use('/trpc', createExpressMiddleware({
        router: initRESTRouter(tradeBot),
        createContext
    }))
}