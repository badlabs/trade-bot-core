import {DomainTemplate} from "./DomainTemplate";
import {D_Currency, D_PortfolioPosition, D_Security, D_Operation, D_Order, D_CurrencyBalance} from '@prisma/client'

export type OrderStatus = 'new' | 'cancelled' |
    'fill' | 'partially_fill' | 'replaced' |
    'rejected' | 'pending_new' | 'pending_replace' | 'pending_cancel' | 'undefined'

export type OperationType = 'limit_buy' | 'limit_sell' |
    'market_buy' | 'market_sell' |
    'buy_or_cancel' | 'sell_or_cancel' | 'undefined'

type CommonCurrency = D_Currency
type CommonCurrencyBalance = D_CurrencyBalance
type CommonSecurity = D_Security
type CommonOrder = Omit<D_Order, 'status_first'> & {
    status_first: OrderStatus
}
type CommonPortfolio = D_PortfolioPosition
type CommonOperation = Omit<D_Operation, 'operation_type'> & {
    operation_type: OperationType
}

export type CommonDomain = DomainTemplate<
    CommonCurrency, CommonCurrencyBalance, CommonSecurity, CommonOrder, CommonPortfolio, CommonOperation>