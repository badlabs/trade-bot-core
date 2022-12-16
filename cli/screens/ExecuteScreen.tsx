import React, {useState} from "react";
import {BotConfig} from "../models";
import { TRPCRouterHTTP } from "../../src";
import {TRPCClientError, TRPCLink, createTRPCProxyClient} from '@trpc/client';
import { observable } from '@trpc/server/observable';
import axios from "axios";
import {Box, Text, Newline} from "ink";
import SelectInput from "ink-select-input";
import {AnyRouter} from "@trpc/server";

const createAxiosLink: <TRouter extends AnyRouter>(opts: {url: string}) => TRPCLink<TRouter> =
    ({ url }) => () => {
    // here we just got initialized in the app - this happens once per app
    // useful for storing cache for instance
    return ({ next, op }) => {
        // this is when passing the result to the next link
        // each link needs to return an observable which propagates results
        return observable((observer) => {
            console.log('performing operation:', op);
            axios.request({
                method: op.type === 'query' ? 'GET' : 'POST',
                url: `${url}/${op.path}`,
                params: op.type === 'query' ? op.input : {},
                data: op.type === 'query' ? undefined : op.input
            }).then(res => {
                observer.next(res.data)
                observer.complete()
            }).catch(cause => observer.error(TRPCClientError.from(cause)))
            return () => {};
        });
    };
};

export default (props: {
    botConfig: BotConfig
}) => {
    const client = createTRPCProxyClient<TRPCRouterHTTP>({
        links: [
            createAxiosLink({
                url: `http://${props.botConfig.host}:${props.botConfig.port}/trpc`
            })
        ]
    })
    const [response, setResponse] = useState<any>()
    function handleSelect(item: {label: string, value: string}) {
        if (item.value === 'getPortfolio')
            client.portfolio.get.query().then(response => setResponse(response))
    }
    return <>
        <SelectInput
            onSelect={handleSelect}
            items={[
                {label: 'getPortfolio()', value: 'getPortfolio'}
            ]} />
        <Box flexDirection="column" justifyContent="flex-start">
            {
                !response ? <Text>No response</Text> :
                JSON.stringify(response, null, 2)
                .split('\n')
                .map((line, index) => (<Text key={index}>{line}</Text> ))
            }
        </Box>
    </>
}