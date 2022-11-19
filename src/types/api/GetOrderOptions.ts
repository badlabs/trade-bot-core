import {OperationType} from "src/types";

export type GetOrdersOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: OperationType,
    runId?: number
}