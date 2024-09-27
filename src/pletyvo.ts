// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {bytesToHex} from '@noble/hashes/utils'
import {DappAuthHeader, DappAuthSigner} from './dapp_auth.js'

export interface PletyvoQuery {
	after?: string
	before?: string
	limit?: number
	order?: 'asc' | 'desc'
}

export class Pletyvo {
	constructor(config: Partial<Pletyvo>) {
		Object.assign(this, config)
	}

	get<data>(endpoint: string, query?: PletyvoQuery) {
		return this.request<data>('get', endpoint, undefined, query)
	}

	post<data>(endpoint: string, body: unknown) {
		return this.request<data>('post', endpoint, body, undefined)
	}

	async request<data>(method: 'get' | 'post', endpoint: string, body: unknown, query: PletyvoQuery = {}) {
		const headers = new Headers
		const network = this.network()
		network && headers.set('Network', network)

		const response = await fetch( String(this.urlBase() ?? '').replace(/\/$/, '') + endpoint + '?' + new URLSearchParams(query as any), {
			method,
			body: body === undefined ? undefined : JSON.stringify(body),
			headers,
		} )

		if (response.status !== 200) {
			throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`)
		}
		return response.json() as data
	}

	signer(): DappAuthSigner {
		throw new Error('Missing signer')
	}

	auth(msg: Uint8Array): DappAuthHeader {
		const signer = this.signer()
		return {
			sch: signer.schema(),
			pub: btoa( bytesToHex( signer.public() ) ),
			sig: btoa( bytesToHex( signer.sign(msg) ) ),
		}
	}

	network() {
		return null as string | null
	}

	urlBase() {
		return undefined as string | URL | undefined
	}
}
