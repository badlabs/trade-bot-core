import {AbstractExchangeClient} from "../../abstract";
import {SubjectAreaTemplate} from "../SubjectAreaTemplate";

export type GetPortfolioType<T> =
    T extends AbstractExchangeClient<infer SubjectArea> ? SubjectArea['portfolio'] :
        T extends SubjectAreaTemplate ? T['portfolio'] : never