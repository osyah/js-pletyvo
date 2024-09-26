# `js-pletyvo`

Universal, typed and tree-shakable JavaScript client for [the Pletyvo decentralized platform](https://pletyvo.osyah.com/).

## Install

```sh
pnpm add js-pletyvo
```

## Pletyvo

`Pletyvo` class is the entry point for interacting with all Pletyvo protocols:

```ts
import {Pletyvo} from 'js-pletyvo'

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
declare const signer: DappAuthSigner

DappAuthAddressCreate(signer) // returns your address

const client = new Pletyvo( {
	signer: () => signer,
} )
DappEventCreate(client, 0, 0, 0, 0, 'Hello, world!') // won't throw "Missing signer" error
```

### ED25519

Currently, the library includes only one implementation of `DappAuthSigner`, `DappAuthEd25519`, which uses [`@noble/ed25519`](https://github.com/paulmillr/noble-ed25519) under the hood.

```ts
const signer = new DappAuthEd25519(yourPrivateKey)
```

If private key is not provided, [a random one will be generated](https://github.com/paulmillr/noble-ed25519?tab=readme-ov-file#utils). You can access it through the `signer.privateKey` property.
