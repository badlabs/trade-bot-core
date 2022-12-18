import 'dotenv/config'
import merge from 'deepmerge'
import {DeepPartial} from "typeorm";

export type ConfigOpts<TExchange = any> = {
  exchange: TExchange
  auth: {
    token: string
    required: boolean
  }
  api: {
    port: number | string
    host: string
  }
  logs: {
    directory: string
  }
}

const defaultConfig: ConfigOpts = {
  exchange: {},
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

export const useConfig = <TExchange = any>(config: DeepPartial<ConfigOpts<TExchange>> | null = null) => {
  if (config) {
    const keys = Object.keys(config) as (keyof ConfigOpts)[]
    for (let prop of keys){
      defaultConfig[prop] = merge(defaultConfig[prop], config[prop] as any)
    }
  }
  return defaultConfig
}
