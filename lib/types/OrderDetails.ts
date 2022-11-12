import { OperationType } from "./CommonSubjectArea";

export type OrderDetails = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}
