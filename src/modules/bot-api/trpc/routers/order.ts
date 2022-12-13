import { publicProcedure, router } from '../trpc'
import { TradeBot } from "../../../../TradeBot";
import {getOrderOptions} from "../schemas/GetOrderOptions";

export default (tradeBot: TradeBot) => {
    return router({
        list: publicProcedure
            .input(getOrderOptions)
            .query(async ({input}) => {
                return await tradeBot.analyzer.getOrders(input)
            })
    })
}