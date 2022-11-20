# @badlabs/tradebot-core

## Getting started

Install core: 

```sh
npm install @badlabs/tradebot-core
```

### Describe your domain

Domain includes types of entities in the integrated exchange. 

Technically, you can provide `any` types for `DomainTemplate`. But it is not recommended, as these types will be helpful in process of creating other modules.

```typescript
import {DomainTemplate} from '@badlabs/tradebot-core'
import {
    CurrencyType,
    CurrencyBalanceType,
    SecurityType,
    SecurityBalanceType,
    OrderType
} from '@exchange/sdk'

// Order of arguments matters
export type Domain = DomainTemplate<CurrencyType, CurrencyBalanceType, SecurityType, SecurityBalanceType, OrderType>
```

### Implement ExchangeClient

`ExchangeClient` is layer between exchange and tradebot internal logic. 

It also includes two submodules for splitting logic:
- `InfoModule` - get different information from exchange;
- `TradeModule` - send requests to place orders to exchange;
- `Translator` - for translation exchange types to tradebot types.

You can access `ExchangeClient` instance with `this.exchangeClient` from these modules.

Note, that you can provide object containing API methods to exchange (`API` in example). It will be available in `ExchangeClient` instance as `api`.

```typescript
import {AbstractExchangeClient} from '@badlabs/tradebot-core'
import API from '@exchange/sdk'

import {Domain} from '../Domain'
import {TradeModule} from './TradeModule'
import {InfoModule} from './InfoModule'
import {Translator} from "./Translator"

export class ExchangeClient extends AbstractExchangeClient<Domain, API>{
    constructor(token: string){
        super({
            infoModule: new InfoModule(),
            tradeModule: new TradeModule(),
            translator: new Translator()
        }, new OpenAPI({
            apiURL: 'https://api-invest.tinkoff.ru/openapi/sandbox',
            socketURL: 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws',
            secretToken: token
        }))
    }

    protected async initAccount(){
        const { api } = this
        // Something to prepare your client
        this.isAccountInitialized = true
    }

    async getPortfolio() {/*...*/}

    async getCurrenciesBalance() {/*...*/}
}
```

Don't forget to implement `InfoModule` and `TradeModule`.

```typescript
import {AbstractInfoModule} from '@badlabs/tradebot-core'

import {ExchangeClient} from './ExchangeClient'

export class InfoModule extends AbstractInfoModule<ExchangeClient>{/*...*/}
```

```typescript
import {AbstractTradeModule} from '@badlabs/tradebot-core'

import {ExchangeClient} from './ExchangeClient'

export class TradeModule extends AbstractTradeModule<ExchangeClient>{/*...*/}
```

Also, you should implement `Translator` to make it possible for tradebot to understand types of your exchange. 

Internal domain of tradebot is provided by `CommonDomain` type in core library.

```typescript
import {OperationType, OrderStatus, CommonDomain,
    AbstractTranslator,
    GetCurrencyBalanceType,
    GetCurrencyType,
    GetOrderType,
    GetSecurityBalanceType,
    GetSecurityType} from '@badlabs/tradebot-core'

import {ExchangeClient} from './ExchangeClient'
import {Domain} from "../Domain";
export class Translator extends AbstractTranslator<ExchangeClient>{
    async currency(currency: GetCurrencyType<Domain>): Promise<GetCurrencyType<CommonDomain>>{
        //...
    }
    //...
}
```

Note, that you can extract specific domains types from `Domain` or `ExchangeClient` with following generic types:
- `GetCurrencyType<T>`
- `GetCurrencyBalanceType<T>`
- `GetSecurityType<T>`
- `GetSecurityBalanceType<T>`
- `GetOrderType<T>`

### Start tradebot

Finally, start tradebot with `runTradeBot` function:

```typescript
import {runTradeBot} from '@badlabs/tradebot-core'

import {ExchangeClient} from './exchange-client'
import {initAlgorithms} from './algorithms'

runTradeBot({
  exchangeClient: new ExchangeClient(/*your exchange client args*/),
  botToken: process.env.BOT_TOKEN || '',
  initAlgorithmsCallback: initAlgorithms
})
```
