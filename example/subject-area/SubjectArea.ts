import {SubjectAreaTemplate} from "../../lib/types";
import {Currency, CurrencyPosition, MarketInstrument, Operation, Portfolio} from "@tinkoff/invest-openapi-js-sdk";
import {Order} from "../types";

export type SubjectArea = SubjectAreaTemplate<
    Currency, CurrencyPosition,
    MarketInstrument, Order,
    Portfolio, Operation>