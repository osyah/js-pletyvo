// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {base64} from '@scure/base'
import {DappAuthHeader} from './dapp_auth.js'
import {PletyvoClient} from './pletyvo_client.js'
import {PletyvoProtocol} from './pletyvo_protocol.js'
import {PletyvoQuery} from './pletyvo_query.js'
import {DappSigner} from './dapp_signer.js'
import {BytesFromString} from './bytes.js'
import {DappEvent} from './dapp_event.js'

export class Dapp implements PletyvoProtocol {
	name = 'dapp' as const
	client!: PletyvoClient

	constructor( readonly config: {
		signer?: DappSigner,
	} = {} ) {
	}

	async eventCreate(event: number, aggregate: number, version: number, protocol: number, data: unknown) {
		const {signer} = this.config
		if(!signer) throw new Error('Missing signer')
		const body = BytesFromString( String.fromCharCode(0, event, aggregate, version, protocol) + JSON.stringify(data) )
		return ( await this.client.post< {id: string} >( '/dapp/v1/events', {
			auth: {
				sch: signer.schema,
				pub: base64.encode(signer.public),
				sig: base64.encode( signer.sign(body) ),
			},
			body: base64.encode(body),
		} ) ).id
	}

	async event<data>(id: string) {
		return eventFrom<data>( await this.client.get(`/dapp/v1/events/${id}`) )
	}

	async events(query?: PletyvoQuery) {
		return ( await this.client.get<any[]>(`/dapp/v1/events`, query) ).map(eventFrom)
	}
}

function eventFrom<data>(raw: {
	id: string
	author: string
	auth: DappAuthHeader
	body: string
}) {
	const e = new DappEvent<data>
	e.id = raw.id
	e.author = raw.author
	e.auth = raw.auth
	e.body = base64.decode(raw.body)
	return e
}
