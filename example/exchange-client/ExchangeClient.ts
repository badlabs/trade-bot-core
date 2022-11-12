import OpenAPI, {
  Currency,
  CurrencyPosition,
  MarketInstrument,
  Operation,
  Portfolio
} from '@tinkoff/invest-openapi-js-sdk'
import {Order} from '../types'
import {AbstractExchangeClient} from '../../lib/abstract'
import { TradeModule } from './TradeModule'
import { InfoModule } from './InfoModule'
import {Translator} from "./Translator"

export class ExchangeClient extends AbstractExchangeClient<
  OpenAPI,
  Currency, CurrencyPosition,
  MarketInstrument, Order,
  Portfolio, Operation >{
  public readonly api
  public readonly tradeModule
  public readonly infoModule
  public readonly translator

  constructor(token: string){
    super()
    this.api = new OpenAPI({
        apiURL: 'https://api-invest.tinkoff.ru/openapi/sandbox',
        socketURL: 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws',
        secretToken: token
    })
    this.infoModule = new InfoModule(this)
    this.tradeModule = new TradeModule(this)
    this.translator = new Translator(this)
    this.initAccount()
  }

  protected async initAccount(){
    const { api } = this
    // await api.sandboxClear()
    // await api.setCurrenciesBalance({ currency: 'USD', balance: 1_000_000 })
    // await api.setCurrenciesBalance({ currency: 'RUB', balance: 1_000_000 })
    // await api.setCurrenciesBalance({ currency: 'EUR', balance: 1_000_000 })
    // // @ts-ignore
    // const { figi: appleFigi } = await api.searchOne({ ticker: 'AAPL' })
    // await api.setPositionBalance({ balance: 100, figi: appleFigi })
    this.isAccountInitialized = true
  }

  async getPortfolio(): Promise<Portfolio> {
    const { api } = this
    return await api.portfolio()
  }

  async getCurrenciesBalance(): Promise<CurrencyPosition[]> {
    const { api } = this
    return (await api.portfolioCurrencies()).currencies
  }

  async getOperationsAll(from: Date = new Date(0), to: Date = new Date()): Promise<Operation[]> {
    const { api } = this
    const operations = await api.operations({
      from: from.toISOString(),
      to: to.toISOString()
    })
    return operations.operations
  }

  async getOperationsBySecurity(ticker: string, from: Date = new Date(0), to: Date = new Date()): Promise<Operation[]> {
    const { api, infoModule } = this
    const security = await infoModule.getSecurity(ticker)
    const operations = await api.operations({
      from: from.toISOString(),
      to: to.toISOString(),
      figi: security?.figi
    })
    return operations.operations
  }
}
