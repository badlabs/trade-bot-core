import {ExchangeWatcher} from "./index";
import {OrderDetails, OrderStatus} from "lib/utils/orderDetails";
import {TradeBot} from "../../TradeBot";
import {Job} from "node-schedule";
import { BotLogger } from "./BotLogger";
import {AbstractExchangeClient} from "../../AbstractExchangeClient";
import {extractOrderType} from "../../utils/extractTypes";
const schedule = require('node-schedule');

export class ExchangeTrader<ExchangeClient extends AbstractExchangeClient<any, any, any, any, any, any, any>> {
    private readonly tradebot: TradeBot<ExchangeClient>
    private get watcher(): ExchangeWatcher<ExchangeClient> { return this.tradebot.watcher }
    private get logger(): BotLogger { return this.tradebot.logger }
    private get exchangeClient(): ExchangeClient { return this.tradebot.exchangeClient }

    constructor(tradebot: TradeBot<ExchangeClient>) {
        this.tradebot = tradebot
    }

    scheduleAction(action: Function, date: Date): Job {
        return schedule.scheduleJob(date, action)
    }

    scheduleOrder(date: Date, order: OrderDetails, run_id: number | null = null, ): Job {
        return schedule.scheduleJob(date, async () => {
            await this.sendOrder(order, run_id)
        })
    }

    async sendOrder({ ticker, lots, price, operation }: OrderDetails, run_id: number | null = null): Promise<OrderStatus> {
        const { watcher } = this
        this.logger.log(`${run_id ? `[algo:${run_id}] `: ''}Sending order: ${JSON.stringify({operation, ticker, lots, price})}`)
        let order: extractOrderType<ExchangeClient>
        switch (operation){
            case 'limit_buy':
                order = await this.exchangeClient.tradeModule.buy({ ticker, lots, price, operation })
                break
            case 'buy_or_cancel':
                order = await this.exchangeClient.tradeModule.buyOrCancel()
                break
            case 'limit_sell':
                order = await this.exchangeClient.tradeModule.sell({ ticker, lots, price, operation })
                break
            case 'sell_or_cancel':
                order = await this.exchangeClient.tradeModule.sellOrCancel()
                break
            case "market_buy":
                order = await this.exchangeClient.tradeModule.marketBuy({ ticker, lots, price, operation })
                break
            case "market_sell":
                order = await this.exchangeClient.tradeModule.marketSell({ ticker, lots, price, operation })
                break
        }
        return watcher.onOrderSent(order, operation, run_id)
    }

}
