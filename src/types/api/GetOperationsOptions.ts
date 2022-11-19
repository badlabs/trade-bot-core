import {OperationType} from "../index";

export type GetOperationsOptions = {
    from?: Date,
    to?: Date,
    securityTicker?: string,
    operation?: OperationType
}