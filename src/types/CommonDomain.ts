import {DomainTemplate} from "./DomainTemplate";
import {Currency, PortfolioPosition, Security, Order, CurrencyBalance} from '../db'

export type OrderStatus = 'new' | 'cancelled' |
    'fill' | 'partially_fill' | 'replaced' |
    'rejected' | 'pending_new' | 'pending_replace' | 'pending_cancel' | 'undefined'

export type OperationType = 'limit_buy' | 'limit_sell' |
    'market_buy' | 'market_sell' |
    'buy_or_cancel' | 'sell_or_cancel' | 'undefined'

type CommonCurrency = Currency
type CommonCurrencyBalance = CurrencyBalance
type CommonSecurity = Security
type CommonOrder = Omit<Order, 'status_first'> & {
    status_first: OrderStatus
}
type CommonPortfolio = PortfolioPosition

export type CommonDomain = DomainTemplate<
    CommonCurrency, CommonCurrencyBalance, CommonSecurity, CommonOrder, CommonPortfolio>