import React, {useState} from 'react';
import Layout from "./Layout";
import Navigation from "./Navigation";

export default () => {
    const [botConfig, setBotConfig] = useState({
        id: '',
        host: 'localhost',
        port: 4268,
        token: '',
    })

    return (<>
        <Layout>
            <Navigation botConfig={botConfig} />
        </Layout>
    </>)
}