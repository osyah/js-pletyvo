# Pletyvo for JavaScript

A universal, typed and tree-shakable JavaScript client for [the Pletyvo decentralized platform](https://pletyvo.osyah.com/).

## Installation

Install the package with your preferred package manager:

```sh
pnpm add pletyvo
```

## Configuration

`Pletyvo` objects store all configuration used by various Pletyvo APIs. Use the eponymous function to define one. There is no fixed set of configuration options, instead, you import the configuration keys symbols manually for granular control over what's included in the bundle.

```ts
import {Pletyvo, PletyvoHttpGateway} from 'pletyvo'

export const MyPletyvoInstance = Pletyvo( {
	[PletyvoHttpGateway]: 'http://testnet.pletyvo.osyah.com/api',
} )
```

By default, a `Pletyvo` object must be passed as an argument into all APIs using it, but this can be avoided by setting `PletyvoVariable`, which is an async context variable provided by the [Reatom v1k state manager](https://github.com/reatom/reatom/tree/v1000). If you're not using Reatom, you can simply call `PletyvoVariable.set(pletyvo)` in the module scope to provide a global configuration.

```ts
import {Pletyvo, PletyvoVariable} from 'pletyvo'

export const MyPletyvoInstance = Pletyvo( {
	// …
} )

PletyvoVariable.set(MyPletyvoInstance)
```

## HTTP

These are the options for the HTTP layer:

- `[PletyvoHttpGateway]?: string`: the URL of the gateway to call; defaults to the testnet ([[https://testnet.pletyvo.osyah.com/api]])
- `[PletyvoHttpFetch]?: (url: URL, init: RequestInit) => Promise<Response>`: a `fetch`-like function to use instead of `globalThis.fetch` to make requests

## Query

Functions returning lists of some values typically support a parameter of type `PletyvoQuery`, which is a plain object with the following properties:

- `before?: string`:
- `after?: string`:
- `limit: number`: an integer from 0 to 50; defaults to 25
- `order?: 'asc' | 'desc'`; defaults to `'desc'`

## dApp

These are the functions for working with the dApp protocol:

- `DappEventGet(id: string, pletyvo?: Pletyvo)`: fetches an event by its ID
- `DappEventList(query?: PletyvoQuery, pletyvo?: Pletyvo)`: fetches multiple events
- `DappEventCreate(config: DappEventCreateConfig, pletyvo?: Pletyvo)`: creates an event; [only works if you're authorized](#dapp-signer)

Event creation options are the following:

- `data: unknown`
- `type: number`
- `version?: DappEventVersion`: the version of the event; defaults to `basic`
	- when set to `DappEventVersion.linked`:
		- `parent: string`: parent event ID

```ts
import {DappEventGet, DappEventList, DappEventCreate, DappEventVersion} from 'pletyvo'

const someEvents = await DappEventList()
const moreEvents = await DappEventList( {after: someEvents.at(-1)!.id} )

const someSpecificEvent = await DappEventGet('xxx')

await DappEventCreate( {
	version: DappEventVersion.basic,
	type: 777,
	data: {hello_to: 'the world'},
} )
```

## dApp: Signer

For creating events, you must establish your identity by providing a `DappSigner` object through the eponymous option:

- `[DappSigner]?: DappSigner`

The signer is used, apparently, to sign the payloads using your private key and a supported algorithm. The only such algorithm as of today is ED25519, implemented by `DappSignerEd25519`:

```ts
import {Pletyvo, DappSigner, DappSignerEd25519} from 'pletyvo'

const myPrivateKey = DappSignerEd25519.randomPrivateKey()

const MyPletyvoInstance = Pletyvo( {
	[DappSigner]: new DappSignerEd25519(myPrivateKey),
} )
```

## Delivery

These are the functions for working with the Delivery protocol:

- `DeliveryChannelGet`
- `DeliveryChannelCreate`
- `DeliveryChannelUpdate`
- `DeliveryPostGet`
- `DeliveryPostList`
- `DeliveryPostCreate`
- `DeliveryPostUpdate`
- `DeliveryMessageGet`
- `DeliveryMessageList`
- `DeliveryMessageSend`
- `DeliveryMessageCreate`
