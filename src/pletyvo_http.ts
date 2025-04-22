// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import { Pletyvo } from "./pletyvo.js"
import { PletyvoQuery } from "./pletyvo_query.js"

export const PletyvoHttpFetch = Symbol('PletyvoHttpFetch')
export const PletyvoHttpGateway = Symbol('PletyvoHttpGateway')

declare module './pletyvo.js' {
	export interface Pletyvo {
		[PletyvoHttpFetch]?: (url: string, request: RequestInit) => Promise<Response>
		[PletyvoHttpGateway]?: string
	}
}

const gatewayTestnet = 'https://testnet.pletyvo.osyah.com/api'

export async function PletyvoHttpGet<data>(endpoint: string, query: PletyvoQuery, pletyvo: Pletyvo) {
	return await PletyvoHttpRequest<data>('get', endpoint, undefined, query, pletyvo)
}

export async function PletyvoHttpPost<data>(endpoint: string, body: unknown, pletyvo: Pletyvo) {
	return await PletyvoHttpRequest<data>('post', endpoint, body, {}, pletyvo)
}

export async function PletyvoHttpRequest<data>(
	method: 'get' | 'post',
	endpoint: string,
	body: unknown,
	query: PletyvoQuery,
	pletyvo: Pletyvo,
) {

	const headers = new Headers()
	method === 'post' && headers.set('content-type', 'json')

	const queryString = query ? ( '?' + new URLSearchParams(query as any) ) : ''
	const response = await (pletyvo[PletyvoHttpFetch] ?? fetch).call(
		globalThis,
		(pletyvo[PletyvoHttpGateway] ?? gatewayTestnet).replace(/\/$/, '') + endpoint + queryString,
		{
			method,
			body: body === undefined ? undefined : JSON.stringify(body),
			headers,
		},
	)

	if (response.status !== 200) {
		throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`)
	}
	return response.json() as data
}
