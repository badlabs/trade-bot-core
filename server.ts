import {TradeBot} from "./lib/TradeBot";
import {ExchangeClient} from "./src/ExchangeClient";
const tradebot = new TradeBot({
  exchangeClient: new ExchangeClient(process.env.TINKOFF_SANDBOX_API_KEY || ''),
  botToken: process.env.BOT_TOKEN || ''
})


