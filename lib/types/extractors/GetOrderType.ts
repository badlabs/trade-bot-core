import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetOrderType<T> =
    T extends AbstractExchangeClient<any, SubjectAreaTemplate<any, any, any, infer OrderType>> ? OrderType :
        T extends SubjectAreaTemplate<any, any, any, infer OrderType> ? OrderType : never