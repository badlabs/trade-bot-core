import React, {useEffect, useState} from "react"
import { io } from "socket.io-client"
import {BotConfig} from "../models"
import {SocketLogs} from "../../src"
import {Newline, Text} from "ink";

export default (props: {
    botConfig: BotConfig
}) => {
    const [logs, setLogs] = useState<SocketLogs[]>([])
    const [status, setStatus] = useState('disconnected')
    useEffect(() => {
        const connection = io(
            `http://${props.botConfig.host}:${props.botConfig.port}`,
            { extraHeaders: { Authorization: `Bearer ${props.botConfig.token}`}
            })
        connection.on('connect', () => {
            setStatus('connected')
        })
        connection.on('connect_error', (err) => {
            console.error(err)
            setStatus(`error: ${JSON.stringify(err)}`)
            connection.close()
        })
        connection.on('log', (event: string) => {
            logs.push(JSON.parse(event))
            setLogs(logs)
        })
        return () => {
            connection.close()
        }
    })
    return <>
        <Text>{status}</Text>
        {logs.map(log => <>
                <Text>{log.timestamp} </Text>
                <Text color="cyan">[{log.type}] </Text>
                { log.algorithm ? <Text color="yellow">({log.algorithm.name}:{log.algorithm.run_id}) </Text> : <Text/> }
                <Text>{log.message}</Text>
                <Newline />
            </>)}
    </>
}