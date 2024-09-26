import {etc, getPublicKey, sign, utils} from '@noble/ed25519'
import {sha512} from '@noble/hashes/sha512'
import {DappAuthSchema, DappAuthSigner} from './dapp_auth.js'

etc.sha512Sync = (...m) => sha512( etc.concatBytes(...m) )

export class DappAuthEd25519 implements DappAuthSigner {	
	readonly publicKey: Uint8Array

	constructor(
		readonly privateKey = utils.randomPrivateKey()
	) {
		this.publicKey = getPublicKey(this.privateKey)
	}
	
	schema(): DappAuthSchema {
		return DappAuthSchema.ed25519
	}

	public(): Uint8Array {
		return this.publicKey
	}

	sign(msg: Uint8Array) {
		return sign(msg, this.privateKey)
	}
}