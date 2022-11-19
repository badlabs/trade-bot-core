import { config } from './config'
import {db} from './db'
import {
    BotApi,
    BotAuth,
    BotLogger,
    ExchangeAnalyzer,
    ExchangeTrader,
    ExchangeWatcher
} from "./modules";
import {AbstractExchangeClient, AbstractTradeAlgorithm} from './abstract'

export class TradeBot<ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient> {
    private _exchangeClient: ExchangeClient
    private _analyzer: ExchangeAnalyzer<ExchangeClient>
    private _trader: ExchangeTrader<ExchangeClient>
    private _watcher: ExchangeWatcher<ExchangeClient>
    private _api: BotApi
    private _logger: BotLogger
    private _auth: BotAuth

    get exchangeClient() { return this._exchangeClient }
    get analyzer() { return this._analyzer }
    get trader() { return this._trader }
    get watcher() { return this._watcher }
    get api() { return this._api }
    get logger() { return this._logger }
    get auth() { return this._auth }

    constructor({exchangeClient, botToken, initAlgorithmsCallback}: {
        exchangeClient: ExchangeClient,
        botToken?: string,
        initAlgorithmsCallback?:
            (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
    }) {
        this.setup({exchangeClient, botToken, initAlgorithmsCallback})
    }

    private async setup({exchangeClient, botToken, initAlgorithmsCallback}: {
        exchangeClient: ExchangeClient,
        botToken?: string,
        initAlgorithmsCallback?:
            (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
    }){
        this._logger = new BotLogger(this)
        this._logger.log('TradeBot Initialization...')
        await db.initialize()
        this._exchangeClient = exchangeClient
        this._analyzer = new ExchangeAnalyzer(this, initAlgorithmsCallback)
        this._trader = new ExchangeTrader(this)
        this._watcher = new ExchangeWatcher(this)
        this._api = new BotApi(this)
        this._auth = new BotAuth(botToken || config.auth.token)
        this._logger.log('All modules are initialized...')
        await this._analyzer.updateCurrencies()
    }
}
