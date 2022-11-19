import {TradeBot} from 'src/TradeBot'
import {ExchangeWatcher, BotLogger} from 'src/modules'
import {AbstractExchangeClient} from 'src/abstract'
import {CreateOrderOptions, OrderStatus} from 'src/types'
import {Job, JobCallback, scheduleJob} from 'node-schedule'
import {GetOrderType} from "../../types/extractors";

export class ExchangeTrader<ExchangeClient extends AbstractExchangeClient> {
    private readonly tradebot: TradeBot<ExchangeClient>
    private get watcher(): ExchangeWatcher<ExchangeClient> { return this.tradebot.watcher }
    private get logger(): BotLogger { return this.tradebot.logger }
    private get exchangeClient(): ExchangeClient { return this.tradebot.exchangeClient }

    constructor(tradebot: TradeBot<ExchangeClient>) {
        this.tradebot = tradebot
    }

    scheduleAction(action: JobCallback, date: Date): Job {
        return scheduleJob(date, action)
    }

    scheduleOrder(date: Date,
                  order: CreateOrderOptions,
                  run_id: number | undefined = undefined): Job {
        return scheduleJob(date, async () => {
            await this.sendOrder(order, run_id)
        })
    }

    async sendOrder({ ticker, lots, price, operation }: CreateOrderOptions,
                    run_id: number | undefined = undefined): Promise<OrderStatus> {
        const { watcher } = this
        this.logger.log(`${run_id ? `[algo:${run_id}] `: ''}Sending order: ${JSON.stringify({operation, ticker, lots, price})}`)
        let order: GetOrderType<ExchangeClient>
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
            default:
                throw new Error(`Wrong operation defined in order: ${JSON.stringify({ ticker, lots, price, operation })}`)
        }
        return watcher.onOrderSent(order, operation, run_id)
    }

}
