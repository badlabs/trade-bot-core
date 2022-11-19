export type DomainTemplate<
    CurrencyType = unknown,
    CurrencyBalanceType = unknown,
    SecurityType = unknown,
    SecurityBalanceType = unknown,
    OrderType = unknown> = {
    currency: CurrencyType
    currencyBalance: CurrencyBalanceType
    security: SecurityType
    securityBalance: SecurityBalanceType
    order: OrderType
}