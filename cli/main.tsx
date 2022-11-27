#!/usr/bin/env node

import React, {useState, useEffect} from 'react';
import {render, Text} from 'ink';
import Layout from "./Layout";

const Counter = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(previousCounter => previousCounter + 1);
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return <Text color="green">{counter} tests passed</Text>;
};

render(
    <Layout>
        <Counter />
    </Layout>);