import {OperationType} from "../CommonDomain";

export type CreateOrderOptions = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}