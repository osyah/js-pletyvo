import {etc, getPublicKey, sign, utils} from '@noble/ed25519'
import {sha512} from '@noble/hashes/sha512'
import {DappAuthSchema} from './dapp_auth.js'
import {DappSigner} from './dapp_signer.js'

export class DappSignerEd25519 implements DappSigner {
	static randomPrivateKey = utils.randomPrivateKey

	schema = DappAuthSchema.ed25519
	public: Uint8Array
	private: Uint8Array

	constructor(private_: Uint8Array) {
		etc.sha512Sync ??= (...m) => sha512( etc.concatBytes(...m) )

		this.public = getPublicKey(this.private = private_)
	}

	sign(data: Uint8Array) {
		return sign(data, this.private)
	}
}
