import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetOperationType<T> =
    T extends AbstractExchangeClient<
            any, SubjectAreaTemplate<any, any, any, any, any, infer OperationType>> ? OperationType :
        T extends SubjectAreaTemplate<any, any, any, any, any, infer OperationType> ? OperationType : never