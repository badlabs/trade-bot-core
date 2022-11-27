import React from "react";
import {HomeScreen} from "./screens/HomeScreen";
import {BotConnectScreen} from "./screens/BotConnectScreen";
import {BotConfig} from "./models";

export default (props: {
    botConfig: BotConfig
}) => {
    let CurrentScreen: JSX.Element = <HomeScreen/>
    if (!props.botConfig?.id)
        CurrentScreen = <BotConnectScreen/>
    return (<>
            {CurrentScreen}
        </>)
}