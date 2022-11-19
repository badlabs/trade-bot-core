import {OperationType} from "../index";

export type CreateOrderOptions = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}