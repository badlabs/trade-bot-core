import { createExpressMiddleware } from '@trpc/server/adapters/express';
import {Express} from "express";
import {TradeBot} from "../../../../../../TradeBot";
import {createContext, publicProcedure, router} from "./trpc";
import initAlgorithmRouter from './algorithm'
import initSecurityRouter from './security'
import initCurrencyRouter from './currency'
import initPortfolioRouter from './portfolio'
import initOrderRouter from './order'


const initHTTPRouter = (tradeBot: TradeBot) => {
    return router({
        algorithms: initAlgorithmRouter(tradeBot),
        securities: initSecurityRouter(tradeBot),
        currencies: initCurrencyRouter(tradeBot),
        portfolio: initPortfolioRouter(tradeBot),
        orders: initOrderRouter(tradeBot)
    })
}

export const registerExpressRoutes = ({tradeBot, express}: {tradeBot: TradeBot, express: Express}) => {
    express.use('/api/trpc', createExpressMiddleware({
        router: initHTTPRouter(tradeBot),
        createContext
    }))
}

export type HTTPRouter = ReturnType<typeof initHTTPRouter>