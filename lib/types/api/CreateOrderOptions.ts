import {OperationType} from "../CommonSubjectArea";

export type CreateOrderOptions = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}