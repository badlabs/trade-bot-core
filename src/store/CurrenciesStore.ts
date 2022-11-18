import {deepCopy} from "../utils";
import {PortfolioStore} from "./PortfolioStore";

export type Currency = {
    name: string
    ticker: string
    /**
     * Ticker used to buy and sell currency on exchange
     */
    exchangeTicker: string
}

export class CurrenciesStore {
    private items: Currency[] = []
    private portfolioStore: PortfolioStore

    setPortfolioStore(store: PortfolioStore){
        if (!this.portfolioStore)
            this.portfolioStore = store
    }

    get currencies() { return deepCopy(this.items) }

    /**
     * Set all currencies
     *
     * @param currencies
     */
    updateCurrenciesAll(currencies: Currency[]) {
        this.items = deepCopy(currencies)
    }

    getBalanceOf(currencyTicker: string) {
        const currency = this.items.find(c => c.ticker === currencyTicker || c.exchangeTicker === currencyTicker)
        if (!currency) return
        return this.portfolioStore.currencies
                .find(cur => cur.currencyTicker === currency.ticker || cur.currencyTicker === currency.exchangeTicker) ??
                { currencyTicker, type: 'currency', amount: 0 }
    }
}