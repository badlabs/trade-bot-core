import {IncomingHttpHeaders} from "http";

export interface IHttpHeadersCarrier {
    headers: IncomingHttpHeaders
}