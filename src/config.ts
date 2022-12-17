import 'dotenv/config'

export const config = {
  exchange: {
    exchangeToken: process.env.TINKOFF_SANDBOX_API_KEY || '',
  },
  auth: {
    token: process.env.BOT_TOKEN || '',
    required: true
  },
  api: {
    port: 4268,
    host: '0.0.0.0'
  },
  logs: {
    directory: './logs'
  }
}
