**Unstable version. Things may change.**

# `js-pletyvo`

Universal, typed and tree-shakable JavaScript client for [the Pletyvo decentralized platform](https://pletyvo.osyah.com/).

## Install

```sh
pnpm add pletyvo
```

## Usage

Firstly, you will need a client. A client is an object containing all necessary logic to interact with a Pletyvo gateway. Create one with `PletyvoClient`:

```ts
const client = new PletyvoClient( {
	gateway: 'http://testnet.pletyvo.osyah.com/api',
	network: '0191e5b0-b730-7167-965a-083f5b759c32',
} )
```

Valid configuration options are:

- `gateway?: string`
- `network?: string` – [identifier of network to use](https://pletyvo.osyah.com/reference#network-identify)
- `fetch?: (url: string, init: RequestInit) => Promise<Response>` – override HTTP client

Protocols are the fundamental concept in Pletyvo. This module represents them as classes with functionality implemented as methods. To use a protocol, you must instantiate it and register it in the client through client's `with` method. The first protocol you'll most likely need is [dApp](#dapp), implemented by `PletyvoDapp` class:

```ts
const pletyvo = client.with( [
	new Dapp(),
] )
```

The value returned by `PletyvoClient..with` is a handy object with all registered protocols as fields:

```ts
await pletyvo.dapp.events() // Array<DappEvent>
```

Some protocols may depend on other protocols. In particular, practically all protocols depend on [dApp](#dapp). To use a dependant protocol or some of its features, you should manually configure and register its dependencies, which are typically listed in protocol's documentation.

## Built-in protocols

### dApp

[Platform docs: dApp](https://pletyvo.osyah.com/protocols/dapp)

- creating events with `dapp.eventCreate` requires [configuring authentication](#dapp-cryptography)
- `dapp.event`/`dapp.events` wrap fetched events in `DappEvent` objects containing methods for accessing event type bytes and parsing their data (not cached!)

```ts
const createdEventId = await pletyvo.dapp.eventCreate( 0, 2, 0, 2, {
	content: 'Hello, dApp!',
	channel: '0191e5b1-6f26-7c0f-b87c-72712e48f42b'
} ) // string

const detailedEventInfo = await pletyvo.dapp.event(createdEventId) // DappEvent
detailedEventInfo.data() // "Hello, dApp!"
detailedEventInfo.event() // 1
detailedEventInfo.aggregate() // 2
detailedEventInfo.version() // 3
detailedEventInfo.protocol() // 4

const twentyPreviousEvents = await pletyvo.dapp.events( {limit: 20, before: detailedEventInfo.id} ) // Array<DappEvent>
twentyPreviousEvents.length // 20
```

#### dApp: cryptography

Creating events requires from you to pass `signer` option to `Dapp`, whose value must be an object implementing `DappSigner` interface.

This package includes a signer for the only cryptographic algorithm supported by Pletvyo at the moment, ED25519, implementing it as a thin wrapper around [`@noble/ed25519`](https://github.com/paulmillr/noble-ed25519).

To use the signer, firstly generate a private key through `DappSignerEd25519.randomPrivateKey` (an alias to `@noble/ed25519`-s `utils.randomPrivateKey`) or use the one you already have, then pass it to a new signer instance.

```ts
const privateKey = DappSignerEd25519.randomPrivateKey()
const signer = new DappSignerEd25519(privateKey)

const pletyvo = client.with( [
	new Dapp( {signer} ),
] )

await pletyvo.dapp.eventCreate( 0, 2, 0, 2, {
	content: 'Hello, dApp!',
	channel: '0191e5b1-6f26-7c0f-b87c-72712e48f42b'
} )
```

### Delivery

[Platform docs: Delivery](https://pletyvo.osyah.com/protocols/dapp)

### Registry

[Platform docs: Registry](https://pletyvo.osyah.com/protocols/regitry)

### Advanced: custom protocols

A protocol is a class that implements a simple interface:

```ts
interface PletyvoProtocol {
	get name(): string
	set client(next: PletyvoClient)
}
```

Start by adding the `name` field and making it `readonly` or adding `as const` to the literal for client's type magic to work, then define `client` field without initializing it (non-null assertion is okay there):

```ts
class Custom implements Protocol {
	name = 'custom' as const
	client!: Client
}
```

There you go. Now the protocol is registerable through `Client..with`, so you can start implementing its functionality.

As already stated, every Pletyvo protocol in fact depends on dApp. Besides, depending on other protocols may be helpful to you. To access them, use `Client..protocol` method which acts as a service locator:

```ts
class Custom implements Protocol {
	name = 'custom' as const
	client!: Client

	async doSomething() {
		const dapp = this.client.protocol(Dapp)
		return await dapp.eventCreate( 7, 7, 7, 7, {do: 'something'} )
	}
}
```
