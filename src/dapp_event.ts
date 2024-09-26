// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {Pletyvo as Pletyvo, PletyvoQuery} from './pletyvo.js'
import {DappAuthHeader} from './dapp_auth.js'
import {BytesFromString, BytesToString} from './bytes.js'

export interface DappEventRaw {
	id: string
	author: string
	auth: DappAuthHeader
	body: string
}

export class DappEvent<data = unknown> {
	static fromRaw<data>(raw: DappEventRaw) {
		const e = new DappEvent<data>
		e.id = raw.id
		e.author = raw.author
		e.auth = raw.auth
		e.body = BytesFromString(raw.body)
		return e
	}

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
		return JSON.parse( atob( BytesToString( this.body.slice(5) ) ) ) as data
	}
}

export async function DappEventGet(p: Pletyvo, id: string) {
	return DappEvent.fromRaw( await p.get(`/dapp/v1/events/${id}`) )
}

export async function DappEventList(p: Pletyvo, query?: PletyvoQuery) {
	return ( await p.get<DappEventRaw[]>(`/dapp/v1/events`, query) ).map(DappEvent.fromRaw)
}

export async function DappEventCreate<data>(p: Pletyvo, event: number, aggregate: number, version: number, protocol: number, data: data) {
	const body = btoa( String.fromCharCode(0, event, aggregate, version, protocol) + JSON.stringify(data) )
	return (await p.post< {id: string} >( '/dapp/v1/events', {
		auth: p.auth( BytesFromString(body) ),
		body,
	} ) ).id
}

