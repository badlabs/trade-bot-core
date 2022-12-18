import {runTradeBot} from "@badlabs/tradebot-core";
import {ExchangeClient} from "./exchange-client";
import {initAlgorithms} from "./algorithms";
import {useConfig} from "../../lib/config";

useConfig({
  exchange: {
    exchangeToken: process.env.TINKOFF_SANDBOX_API_KEY || ''
  },
  auth: {
    token: process.env.BOT_TOKEN || '',
    required: true
  }
})

runTradeBot({
  mode: 'production',
  exchangeClient: new ExchangeClient(),
  initAlgorithmsCallback: initAlgorithms
})


