import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetSecurityType<T> =
    T extends AbstractExchangeClient<infer SubjectArea> ? SubjectArea['security'] :
        T extends SubjectAreaTemplate ? T['security'] : never