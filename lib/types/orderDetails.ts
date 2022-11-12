import { OperationType } from "./database";

export type OrderDetails = {
    operation: OperationType
    ticker: string
    lots: number
    price: number
}

export type OrderStatus = 'new' | 'cancelled' |
    'fill' | 'partially_fill' | 'replaced' |
    'rejected' | 'pending_new' | 'pending_replace' | 'pending_cancel'
