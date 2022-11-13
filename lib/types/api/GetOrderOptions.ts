import {OperationType} from "../CommonSubjectArea";

export type GetOrdersOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: OperationType,
    runId?: number
}