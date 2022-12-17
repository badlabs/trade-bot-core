import { publicProcedure, router } from './trpc'
import { TradeBot } from "../../../../../../TradeBot";
import {getOrdersOptions} from "../../schemas/GetOrdersOptions";

export default (tradeBot: TradeBot) => {
    return router({
        list: publicProcedure
            .input(getOrdersOptions)
            .query(async ({input}) => {
                return await tradeBot.analyzer.getOrders(input)
            })
    })
}