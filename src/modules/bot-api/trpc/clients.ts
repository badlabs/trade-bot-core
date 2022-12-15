import {WSRouter, RESTRouter} from './routers'
import {createTRPCProxyClient, createWSClient, httpLink, wsLink, CreateTRPCProxyClient} from '@trpc/client'

type ClientOptions = {
    host: string
    port: number
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

export const initRESTClient = ({host, port}: ClientOptions): CreateTRPCProxyClient<RESTRouter> => {
    return createTRPCProxyClient<RESTRouter>({
        links: [
            httpLink({
                url: `http://${host}:${port}/trpc`
            })
        ],
    })
}