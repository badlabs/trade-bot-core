import { OperationType } from "./CommonSubjectArea";

// TODO: find appropriate name for the type and move if it is needed
export type OrderDetails = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}
