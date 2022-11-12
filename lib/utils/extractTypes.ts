import {AbstractExchangeClient} from "../abstract/AbstractExchangeClient"

export type extractExchangeApiType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? ExchangeApiType : never

export type extractCurrencyType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? CurrencyType : never

export type extractCurrencyBalanceType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? CurrencyBalanceType : never

export type extractSecurityType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? SecurityType : never

export type extractOrderType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? OrderType : never

export type extractPortfolioType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? PortfolioType : never

export type extractOperationType<ExchangeClient> = ExchangeClient extends AbstractExchangeClient<
  infer ExchangeApiType,
  infer CurrencyType, infer CurrencyBalanceType,
  infer SecurityType, infer OrderType,
  infer PortfolioType, infer OperationType> ? OperationType : never
