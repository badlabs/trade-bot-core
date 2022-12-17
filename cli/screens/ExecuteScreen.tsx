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
        switch (item.value) {
            case 'portfolio.get':
                client.portfolio.get.query().then(res => setResponse(res))
                break
            case 'portfolio.update':
                client.portfolio.update.mutate().then(res => setResponse(res))
                break
            case 'portfolio.clear':
                client.portfolio.clear.mutate().then(res => setResponse(res))
                break
            case 'algorithms.list':
                client.algorithms.list.query().then(res => setResponse(res))
                break
            case 'currencies.list':
                client.currencies.list.query().then(res => setResponse(res))
                break
            case 'currencies.update':
                client.currencies.update.mutate().then(res => setResponse(res))
                break
            case 'currencies.listBalances':
                client.currencies.listBalances.query().then(res => setResponse(res))
                break
            case 'currencies.updateBalances':
                client.currencies.updateBalances.mutate().then(res => setResponse(res))
                break
            case 'securities.list':
                client.securities.list.query().then(res => setResponse(res))
                break
            case 'securities.update':
                client.securities.update.mutate().then(res => setResponse(res))
                break
            case 'securities.listFollowed':
                client.securities.listFollowed.query().then(res => setResponse(res))
                break
        }
    }
    return <>
        <SelectInput
            onSelect={handleSelect}
            items={[
                {label: 'portfolio.get()', value: 'portfolio.get'},
                {label: 'portfolio.update()', value: 'portfolio.update'},
                {label: 'portfolio.clear()', value: 'portfolio.clear'},
                {label: 'algorithms.list()', value: 'algorithms.list'},
                {label: 'currencies.list()', value: 'currencies.list'},
                {label: 'currencies.update()', value: 'currencies.update'},
                {label: 'currencies.listBalances()', value: 'currencies.listBalances'},
                {label: 'currencies.updateBalances()', value: 'currencies.updateBalances'},
                {label: 'securities.list()', value: 'securities.list'},
                {label: 'securities.update()', value: 'securities.update'},
                {label: 'securities.listFollowed()', value: 'securities.listFollowed'}
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