export type OperationType = 'limit_buy' | 'limit_sell' | 'market_buy' | 'market_sell' | 'buy_or_cancel' | 'sell_or_cancel'

export type OperationId = { exchange_id: string } | { created_at: Date }
export type OrderId = { exchange_id: string } | { created_at: Date }

export type GetOperationsOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: string
}

export type GetOrdersOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: OperationType,
    runId?: number
}
