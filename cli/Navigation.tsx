import React from "react";
import {botConfigSlice} from "./store";
import {HomeScreen} from "./screens/HomeScreen";

export const Navigation = () => {
    let CurrentScreen: JSX.Element = <HomeScreen/>

    return (<>
            {CurrentScreen}
        </>)
}