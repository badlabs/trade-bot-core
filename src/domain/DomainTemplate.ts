export type DomainTemplate<
    CurrencyType = any,
    CurrencyBalanceType = any,
    SecurityType = any,
    SecurityBalanceType = any,
    OrderType = any> = {
    currency: CurrencyType
    currencyBalance: CurrencyBalanceType
    security: SecurityType
    securityBalance: SecurityBalanceType
    order: OrderType
}