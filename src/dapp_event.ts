import {BytesToString} from './bytes.js'
import {DappAuthHeader} from './dapp_auth.js'

export class DappEvent<data = unknown> {
	id!: string
	author!: string
	body!: Uint8Array
	auth!: DappAuthHeader

	event() {
		return this.body[1]
	}
	aggregate() {
		return this.body[2]
	}
	version() {
		return this.body[3]
	}
	protocol() {
		return this.body[4]
	}

	data() {
		return JSON.parse( BytesToString( this.body.slice(5) ) ) as data
	}
}
