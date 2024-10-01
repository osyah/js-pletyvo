# `js-pletyvo`

Universal, typed and tree-shakable JavaScript client for [the Pletyvo decentralized platform](https://pletyvo.osyah.com/).

## Install

```sh
pnpm add pletyvo
```

## Pletyvo

`Pletyvo` class is the entry point for interacting with all Pletyvo protocols:

```ts
import {Pletyvo} from 'pletyvo'

const pletyvo = new Pletyvo( {
	// configuration options
} )
```

Configuration options are the following:

- `signer(): DappAuthSigner` – authentication
- `urlBase(): string | URL` – base URL of API gateway
- `network(): string` – [network identifier](https://pletyvo.osyah.com/reference#network-identify) for multi-network gateways

## Signer

A signer is an object that makes it possible for Pletyvo to identify you. Without passing `signer` option to the client you won't be able to perform actions that require authentication, such as creating events.

```ts
import {DappAuthSigner, DappAuthAddressCreate, Pletyvo, DappEventCreate} from 'pletyvo'

declare const signer: DappAuthSigner

DappAuthAddressCreate(signer) // returns your address

const client = new Pletyvo( {
	signer: () => signer,
} )
DappEventCreate(client, 0, 0, 0, 0, 'Hello, world!') // won't throw "Missing signer" error
```

### ED25519

The library includes a signer implementation for ED25519 algorithm using [`@noble/ed25519`](https://github.com/paulmillr/noble-ed25519).

```ts
import {DappAuthEd25519} from 'pletyvo'

const signer = new DappAuthEd25519(yourPrivateKey)
```

If private key is not provided, [a random one will be generated](https://github.com/paulmillr/noble-ed25519?tab=readme-ov-file#utils). You can access it through the `signer.privateKey` property.


## Querying lists

Functions that return lists accept optional parameter of type `PletyvoQuery`, which is an interface representing [Pletyvo query options](https://pletyvo.osyah.com/reference#query-option):

```ts
export interface PletyvoQuery {
	after?: string
	before?: string
	limit?: number
	order?: 'asc' | 'desc'
}
```

## Protocols

### dApp

[Platform docs: dApp](https://pletyvo.osyah.com/protocols/dapp)

Functions for fetching events return `DappEvent` objects containing methods for accessing event type bytes and parsing event data as JSON.

```ts
const createdEventId = await DappEventCreate( p, 1, 2, 3, 4, 'Hello world!' )

const fullEventInfo = await DappEventGet(p, createdEventId)
fullEventInfo.event() // 1
fullEventInfo.aggregate() // 2
fullEventInfo.version() // 3
fullEventInfo.protocol() // 4
fullEventInfo.data() // "Hello world!"

const previousEvents = await DappEventList( p, {before: fullEventInfo.id} )
```

### Registry

[Platform docs: Registry](https://pletyvo.osyah.com/protocols/registry)

### Delivery

[Platform docs: Delivery](https://pletyvo.osyah.com/protocols/delivery)
