import {deepCopy} from "../utils";
import {PortfolioStore} from "./PortfolioStore";

export type Security = {
    name: string
    ticker: string
    price: number
    currencyTicker: string
}

export class SecuritiesStore {
    private items: Security[] = []
    private followList: string[] = []
    private updateJournal: Map<string, Date> = new Map<string, Date>()
    private portfolioStore: PortfolioStore

    setPortfolioStore(store: PortfolioStore){
        if (!this.portfolioStore)
            this.portfolioStore = store
    }

    get securities() { return deepCopy(this.items) }
    get followedSecurities() {
        return this.securities.filter(s => this.followList.includes(s.ticker))
    }
    get securitiesWithUpdates() {
        return this.securities
            .map(sec => ({
                ...sec,
                updatedAt: this.updateJournal.get(sec.ticker)
            }))
    }

    follow(securityTicker: string){
        if (!this.followList.includes(securityTicker))
            this.followList.push(securityTicker)
    }
    unfollow(securityTicker: string){
        const index = this.followList.indexOf(securityTicker)
        if (index !== -1)
            this.followList.splice(index, 1)
    }

    updateSecurities(...securities: Security[]){
        for (let security of deepCopy(securities)) {
            const foundSecurity = this.items.find(item => item.ticker === security.ticker)
            if (!foundSecurity) {
                this.items.push(deepCopy(security))
            } else {
                foundSecurity.price = security.price
            }
            this.updateJournal.set(security.ticker, new Date())
        }
    }

    getBalanceOf(securityTicker: string) {
        const security = this.items.find(s => s.ticker === securityTicker)
        if (!security) return
        return this.portfolioStore.securities
                .find(sec => sec.securityTicker === securityTicker) ??
                { securityTicker, type: 'security', amount: 0 }
    }
}