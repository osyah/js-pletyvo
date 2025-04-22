// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import { base64 } from "@scure/base"
import { DappAuthHeader } from "./dapp_auth.js"
import { Pletyvo, PletyvoVariable } from "./pletyvo.js"
import { PletyvoHttpGet, PletyvoHttpPost } from "./pletyvo_http.js"
import { PletyvoQuery } from "./pletyvo_query.js"
import { BytesFromString, BytesToString } from "./bytes.js"
import { DappSigner } from "./dapp_signer.js"

export type DappEventCreateInput =
	& {
		type: number
		data: unknown
		// dataType?: DappEventDataType
	}
	& (
		| {version?: DappEventVersion.basic}
		| {version: DappEventVersion.linked, parent: string}
	)

export async function DappEventCreate(
	input: DappEventCreateInput,
	pletyvo = PletyvoVariable.get(),
) {
	const signer = pletyvo[DappSigner]
	if(!signer) throw new Error('Signer missing')

	const metaString = String.fromCharCode(
		input.version ?? DappEventVersion.basic,
		DappEventDataType.json, // input.dataType ?? DappEventDataType.json,
		input.type >> 8,
		input.type & 8,
	)
	const data = BytesFromString( JSON.stringify(input.data) )
	const bodyString =
		metaString +
		(input.version === DappEventVersion.linked ? input.parent : '') +
		base64.encode(data)
	const body = base64.encode( BytesFromString(bodyString) )
	const auth: DappAuthHeader = {
		sch: signer.schema,
		pub: signer.public,
		sig: signer.sign(data),
	}
	const resp = await PletyvoHttpPost< {id: string} >('/dapp/v1/events', {body, auth}, pletyvo)
	return resp.id
}

export async function DappEventList(
	query: PletyvoQuery = {},
	pletyvo = PletyvoVariable.get(),
) {
	console.log({pletyvo,query})
	const raw = await PletyvoHttpGet<eventRaw[]>('/dapp/v1/events', query, pletyvo)
	return raw.map(eventFromRaw)
}

export async function DappEventGet(
	id: string,
	pletyvo = PletyvoVariable.get(),
) {
	const raw = await PletyvoHttpGet<eventRaw>(`/dapp/v1/events/${id}`, {}, pletyvo)
	return eventFromRaw(raw)
}

interface eventRaw {
	id: string
	body: string
	auth: DappAuthHeader
}

function eventFromRaw<data>(raw: eventRaw) {
	const body = base64.decode(raw.body)
	const linked = body[0] === 2
	const event = new (linked ? DappEventLinked : DappEventBasic)<data>
	event.id = raw.id
	event.auth = raw.auth
	event.dataType = body[1]
	event.type = body[3] | (body[2] << 8)
	event.data = JSON.parse( BytesToString( body.slice(linked ? 36 : 4) ) )
	if(linked) (event as DappEventLinked).parent = base64.encode( body.slice(4, 36) )
	return event
}

export const enum DappEventDataType {
	json = 1,
}

export const enum DappEventVersion {
	basic = 1,
	linked = 2,
}

export type DappEvent<data> = DappEventBasic<data> | DappEventLinked<data>

export abstract class DappEventBase<data = unknown> {
	abstract get version(): DappEventVersion
	id!: string
	auth!: DappAuthHeader
	dataType!: DappEventDataType
	type!: number
	data!: data
}

export class DappEventBasic<data = unknown> extends DappEventBase<data> {
	get version() {
		return DappEventVersion.basic as const
	}
}

export class DappEventLinked<data = unknown> extends DappEventBase<data> {
	parent!: string

	get version() {
		return DappEventVersion.linked as const
	}
}
