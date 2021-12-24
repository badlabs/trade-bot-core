import OpenAPI from '@tinkoff/invest-openapi-js-sdk';

try {
    require('dotenv').config()
}catch (e){}

const openAPI = new OpenAPI({
    apiURL: 'https://api-invest.tinkoff.ru/openapi/sandbox',
    socketURL: 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws',
    secretToken: process.env.TINKOFF_SANDBOX_API_KEY || ''
})

!(async function run() {
    await openAPI.sandboxClear()
    await openAPI.setCurrenciesBalance({ currency: 'USD', balance: 1_000_000 })
})();

export const api = openAPI