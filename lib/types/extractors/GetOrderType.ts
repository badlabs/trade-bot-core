import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetOrderType<T> =
    T extends AbstractExchangeClient<infer SubjectArea> ? SubjectArea['order'] :
        T extends SubjectAreaTemplate ? T['order'] : never