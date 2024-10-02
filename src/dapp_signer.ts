import {DappAuthSchema} from './dapp_auth.js'

export interface DappSigner {
	get schema(): DappAuthSchema
	get public(): Uint8Array
	sign(data: Uint8Array): Uint8Array
}
