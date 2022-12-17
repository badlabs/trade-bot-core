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
            case 'algorithm.getAll':
                client.algorithm.getAll.query().then(res => setResponse(res))
                break
            case 'currency.getAll':
                client.currency.getAll.query().then(res => setResponse(res))
                break
            case 'currency.updateAll':
                client.currency.updateAll.mutate().then(res => setResponse(res))
                break
            case 'currency.getAllBalances':
                client.currency.getAllBalances.query().then(res => setResponse(res))
                break
            case 'currency.updateAllBalances':
                client.currency.getAllBalances.query().then(res => setResponse(res))
                break
            case 'security.getAll':
                client.security.getAll.query().then(res => setResponse(res))
                break
            case 'security.updateAll':
                client.security.updateAll.mutate().then(res => setResponse(res))
                break
            case 'security.getAllFollowed':
                client.security.getAllFollowed.query().then(res => setResponse(res))
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
                {label: 'algorithm.getAll()', value: 'algorithm.getAll'},
                {label: 'currency.getAll()', value: 'currency.getAll'},
                {label: 'currency.updateAll()', value: 'currency.updateAll'},
                {label: 'currency.getAllBalances()', value: 'currency.getAllBalances'},
                {label: 'currency.updateAllBalances()', value: 'currency.updateAllBalances'},
                {label: 'security.getAll()', value: 'security.getAll'},
                {label: 'security.updateAll()', value: 'security.updateAll'},
                {label: 'security.getAllFollowed()', value: 'security.getAllFollowed'}
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