import {SecuritiesStore} from "./SecuritiesStore";
import {PortfolioStore} from "./PortfolioStore";
import {CurrenciesStore} from "./CurrenciesStore";

export class TradeBotStore {
    readonly securitiesStore: SecuritiesStore
    readonly portfolioStore: PortfolioStore
    readonly currenciesStore: CurrenciesStore

    constructor() {
        this.securitiesStore = new SecuritiesStore()
        this.portfolioStore = new PortfolioStore()
        this.currenciesStore = new CurrenciesStore()

        this.securitiesStore.setPortfolioStore(this.portfolioStore)
        this.currenciesStore.setPortfolioStore(this.portfolioStore)
        this.portfolioStore.setSecuritiesStore(this.securitiesStore)
    }
}