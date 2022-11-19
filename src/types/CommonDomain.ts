import {DomainTemplate} from "./DomainTemplate";
import {Order} from '../db'
import {Currency, CurrencyBalance, SecurityBalance, Security} from '../store'


export type CommonDomain = DomainTemplate<Currency, CurrencyBalance, Security, SecurityBalance, Order>