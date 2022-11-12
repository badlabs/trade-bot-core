import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectArea";

export type GetOrderType<T> =
    T extends AbstractExchangeClient<any, SubjectAreaTemplate<any, any, any, infer OrderType>> ? OrderType :
        T extends SubjectAreaTemplate<any, any, any, infer OrderType> ? OrderType : never