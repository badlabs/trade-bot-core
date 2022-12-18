import {db} from './db'
import {
	ApiService,
	AuthService,
	LoggerService,
	ExchangeAnalyzer,
	ExchangeTrader,
	ExchangeWatcher
} from './modules'
import {AbstractExchangeClient, AbstractTradeAlgorithm} from './abstract'
import {globalStore} from './global/store'

export type TradeBotInitOptions<ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient> = {
    mode: 'production'
    exchangeClient: ExchangeClient,
    botToken?: string,
    initAlgorithmsCallback?:
        (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
} | {
    /**
     * Option for creation of `TradeBot` instance without running processes under hood.
     * Used to extract types for api client.
     */
    mode: 'no_setup'
}

export class TradeBot<ExchangeClient extends AbstractExchangeClient = AbstractExchangeClient> {
	private _exchangeClient: ExchangeClient
	private _analyzer: ExchangeAnalyzer<ExchangeClient>
	private _trader: ExchangeTrader<ExchangeClient>
	private _watcher: ExchangeWatcher<ExchangeClient>
	private _api: ApiService
	private _logger: LoggerService
	private _auth: AuthService

	get exchangeClient() { return this._exchangeClient }
	get analyzer() { return this._analyzer }
	get trader() { return this._trader }
	get watcher() { return this._watcher }
	get api() { return this._api }
	get logger() { return this._logger }
	get auth() { return this._auth }

	constructor(options: TradeBotInitOptions<ExchangeClient>) {
		if (options.mode === 'production'){
			const {exchangeClient, botToken, initAlgorithmsCallback} = options
			this.setup({exchangeClient, botToken, initAlgorithmsCallback})
		}
	}

	private async setup({exchangeClient, botToken, initAlgorithmsCallback}: {
        exchangeClient: ExchangeClient,
        botToken?: string,
        initAlgorithmsCallback?:
            (analyzer: ExchangeAnalyzer<ExchangeClient>) => AbstractTradeAlgorithm<ExchangeClient>[]
    }){
		this._logger = new LoggerService(this)
		globalStore.logger = this.logger
		this.logger.log({
			type: 'info',
			message: 'TradeBot Initialization...'
		})
		await db.initialize()
		this._exchangeClient = exchangeClient
		this._analyzer = new ExchangeAnalyzer(this, initAlgorithmsCallback)
		this._trader = new ExchangeTrader(this)
		this._watcher = new ExchangeWatcher(this)
		this._api = new ApiService(this)
		this._auth = new AuthService(botToken)
		this.logger.log({
			type: 'info',
			message: 'All modules are initialized'
		})
		await this.analyzer.start()
		await this.analyzer.updateCurrencies()
	}
}
