export type SubjectAreaTemplate<
    CurrencyType = any,
    CurrencyBalanceType = any,
    SecurityType = any,
    OrderType = any,
    PortfolioType = any,
    OperationType = any> = {
    currency: CurrencyType
    currencyBalance: CurrencyBalanceType
    security: SecurityType
    order: OrderType
    portfolio: PortfolioType
    operation: OperationType
}