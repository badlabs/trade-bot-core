import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetOperationType<T> =
    T extends AbstractExchangeClient<infer SubjectArea> ? SubjectArea['operation'] :
        T extends SubjectAreaTemplate ? T['operation'] : never