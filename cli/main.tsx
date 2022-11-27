#!/usr/bin/env node

import React from 'react';
import {render} from 'ink';
import Layout from "./Layout";
import {Navigation} from "./Navigation";
import {Provider} from "react-redux";
import {store} from "./store";

render(
    <Provider store={store}>
        <Layout>
            <Navigation />
        </Layout>
    </Provider>
    );