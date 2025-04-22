// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {etc, getPublicKey, sign, utils} from '@noble/ed25519'
import {sha512} from '@noble/hashes/sha512'
import {DappAuthSchema} from './dapp_auth.js'
import {DappSigner} from './dapp_signer.js'
import { base64 } from '@scure/base'

export class DappSignerEd25519 implements DappSigner {
	static randomPrivateKey = utils.randomPrivateKey

	schema = DappAuthSchema.ed25519
	public: string
	private: Uint8Array

	constructor(privateKey: Uint8Array) {
		etc.sha512Sync ??= (...m) => sha512( etc.concatBytes(...m) )

		this.public = base64.encode( getPublicKey(this.private = privateKey) )
	}

	sign(data: Uint8Array) {
		return base64.encode( sign(data, this.private) )
	}
}
