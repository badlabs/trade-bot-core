import {OperationType} from "../index";

export type GetOrdersOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: OperationType,
    runId?: number
}