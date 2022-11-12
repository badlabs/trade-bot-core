import { config } from '../config'
import {
    BotApi,
    BotAuth,
    BotLogger,
    ExchangeAnalyzer,
    ExchangeTrader,
    ExchangeWatcher
} from "./modules";
import {AbstractExchangeClient, AbstractTradeAlgorithm} from './abstract'

export class TradeBot<ExchangeClient extends AbstractExchangeClient<any, any, any, any, any, any, any>> {
    public readonly exchangeClient: ExchangeClient
    public readonly analyzer: ExchangeAnalyzer<ExchangeClient>
    public readonly trader: ExchangeTrader<ExchangeClient>
    public readonly watcher: ExchangeWatcher<ExchangeClient>
    public readonly api: BotApi
    public readonly logger: BotLogger
    public readonly auth: BotAuth

    constructor({exchangeClient, botToken, initAlgorithmsCallback}: {
        exchangeClient: ExchangeClient,
        botToken?: string,
        initAlgorithmsCallback?:
            (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient, any, any, any>[]
    }) {
        this.logger = new BotLogger(this)
        this.logger.log('TradeBot Initialization...')
        this.exchangeClient = exchangeClient
        this.analyzer = new ExchangeAnalyzer(this, initAlgorithmsCallback)
        this.trader = new ExchangeTrader(this)
        this.watcher = new ExchangeWatcher(this)
        this.api = new BotApi(this)
        this.auth = new BotAuth(botToken || config.auth.token)
        this.logger.log('All modules are initialized...')
        this.analyzer.updateCurrencies()
    }
}
