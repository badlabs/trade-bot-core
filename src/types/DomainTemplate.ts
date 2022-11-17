export type DomainTemplate<
    CurrencyType = any,
    CurrencyBalanceType = any,
    SecurityType = any,
    OrderType = any,
    PortfolioType = any> = {
    currency: CurrencyType
    currencyBalance: CurrencyBalanceType
    security: SecurityType
    order: OrderType
    portfolio: PortfolioType
}