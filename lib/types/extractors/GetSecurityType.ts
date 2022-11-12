import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectArea";

export type GetSecurityType<T> =
    T extends AbstractExchangeClient<any, SubjectAreaTemplate<any, any, infer SecurityType>> ? SecurityType :
        T extends SubjectAreaTemplate<any, any, infer SecurityType> ? SecurityType : never