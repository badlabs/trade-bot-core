import {deepCopy} from "../utils";

export type Currency = {
    name: string
    ticker: string
}

export class CurrenciesStore {
    private items: Currency[] = []

    get currencies() { return deepCopy(this.items) }

    /**
     * Set all currencies
     *
     * @param currencies
     */
    updateCurrenciesAll(currencies: Currency[]) {
        this.items = deepCopy(currencies)
    }
}