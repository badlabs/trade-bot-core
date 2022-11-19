import {deepCopy} from "../utils";
import {SecuritiesStore} from "./SecuritiesStore";

export type CurrencyBalance = {
    type: 'currency'
    currencyTicker: string
    amount: number
}

export type SecurityBalance = {
    type: 'security'
    securityTicker: string
    amount: number
}

export type PortfolioPosition = CurrencyBalance | SecurityBalance

export class PortfolioStore {
    // TODO: Create Proxy on updates
    private items: PortfolioPosition[] = []
    private securitiesStore: SecuritiesStore

    private findPosition(position: PortfolioPosition, searchIn: PortfolioPosition[] = this.items) {
        return searchIn.find(item => {
            if (item.type === 'security' && position.type === 'security') {
                return item.securityTicker === position.securityTicker
            }
            if (item.type === 'currency' && position.type === 'currency') {
                return item.currencyTicker === position.currencyTicker
            }
            return false
        })
    }

    setSecuritiesStore(store: SecuritiesStore){
        if (!this.securitiesStore)
            this.securitiesStore = store
    }

    get portfolio() { return deepCopy(this.items) }
    get currencies() { return this.portfolio.filter(item => item.type === 'currency') as CurrencyBalance[] }
    get securities() { return this.portfolio.filter(item => item.type === 'security') as SecurityBalance[] }

    /**
     * Update amount of existing items, add new items.
     *
     * @param positions
     */
    updatePositions(...positions: PortfolioPosition[]){
        for (let position of deepCopy(positions)) {
            const foundPosition = this.findPosition(position)
            if (!foundPosition) {
                this.items.push(position)
            } else {
                foundPosition.amount = position.amount
            }
            if (position.type === 'security') {
                this.securitiesStore.follow(position.securityTicker)
            }
        }
    }

    /**
     * Update amount of existing items, add new items.
     *
     * If some item does not exist in provided positions, it will be deleted from store.
     *
     * @param positions
     */
    updatePositionsAll(positions: PortfolioPosition[]){
        for (let item of this.items) {
            const foundItem = this.findPosition(item, positions)
            if (!foundItem) {
                this.items.splice(this.items.indexOf(item), 1)
            }
        }
        this.updatePositions(...positions)
    }
}