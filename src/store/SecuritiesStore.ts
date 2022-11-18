import {deepCopy} from "../utils";

export type Security = {
    name: string
    ticker: string
    price: number
    currencyTicker: string
}

export class SecuritiesStore {
    private items: Security[] = []
    private updateJournal: Map<string, Date> = new Map<string, Date>()

    get securities() { return deepCopy(this.items) }
    get securitiesWithUpdates() {
        return this.securities
            .map(sec => ({
                ...sec,
                updatedAt: this.updateJournal.get(sec.ticker)
            }))
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
}