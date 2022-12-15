import React, {useState} from "react";
import {BotConfig} from "../models";
import { initServiceMethods } from "../../src/modules/bot-api/express";
import {createClient} from "json-rpc-ts-wrapper";
import {JSONRPCClient} from 'json-rpc-2.0'
import axios from 'axios'
import {Box, Text, Newline} from "ink";
import SelectInput from "ink-select-input";

export default (props: {
    botConfig: BotConfig
}) => {
    const jsonRpcClient = new JSONRPCClient(async (jsonRPCRequest) => {
        const response = await axios.post(
            `http://${props.botConfig.host}:${props.botConfig.port}/json-rpc`,
            jsonRPCRequest,
            {
                headers: { Authorization: `Bearer ${props.botConfig.token}`}
            })
        if (response.status === 200){
            jsonRpcClient.receive(response.data)
        } else {
            throw new Error(response.statusText)
        }
    })
    const serviceMethods = initServiceMethods()
    const client = createClient(initServiceMethods(), jsonRpcClient)
    const [response, setResponse] = useState<any>()
    function handleSelect(item: {label: string, value: string}) {
        if (item.value === 'getPortfolio')
            client.getPortfolio().then(response => setResponse(response))
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