import {WSRouter, HTTPRouter} from './routers'
import {createTRPCProxyClient, createWSClient, httpLink, wsLink, CreateTRPCProxyClient} from '@trpc/client'

type ClientOptions = {
    host: string
    port: number
}

type HTTPClientOptions = ClientOptions & {
    token?: string
}

export const initWSClient = ({host, port}: ClientOptions) => {
    const wsClient = createWSClient({
        url: `ws://${host}:${port}`,
    })
    return createTRPCProxyClient<WSRouter>({
        links: [
            wsLink({
                client: wsClient,
            }),
        ],
    })
}

export const initHTTPClient = ({host, port, token}: HTTPClientOptions): CreateTRPCProxyClient<HTTPRouter> => {
    return createTRPCProxyClient<HTTPRouter>({
        links: [
            httpLink({
                url: `http://${host}:${port}/api/trpc`,
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined
                }
            })
        ],
    })
}

export type TRPCRouterHTTP = HTTPRouter
export type TRPCRouterWS = WSRouter