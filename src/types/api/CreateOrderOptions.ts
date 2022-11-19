import {OperationType} from "src/types";

export type CreateOrderOptions = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}