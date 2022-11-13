import {OperationType} from "../CommonDomain";

export type GetOrdersOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: OperationType,
    runId?: number
}