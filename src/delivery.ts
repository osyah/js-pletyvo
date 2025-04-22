import { DappEventCreate, DappEventVersion } from "./dapp.js"
import { PletyvoVariable } from "./pletyvo.js"
import { PletyvoHttpGet } from "./pletyvo_http.js"
import { PletyvoQuery } from "./pletyvo_query.js"

export interface DeliveryChannel {
	id: string
	hash: string
	author: string
	name: string
}

export async function DeliveryChannelGet(
	id: string,
	pletyvo = PletyvoVariable.get(),
) {
	return await PletyvoHttpGet<DeliveryChannel>(`/delivery/v1/channel/${id}`, {}, pletyvo)
}

export async function DeliveryChannelCreate(
	data: {name: string},
	pletyvo = PletyvoVariable.get(),
) {
	return await DappEventCreate( {
		type: 3,
		data,
	}, pletyvo )
}

export async function DeliveryChannelUpdate(
	channel: string,
	data: {name: string},
	pletyvo = PletyvoVariable.get(),
) {
	return await DappEventCreate( {
		type: 4,
		data,
	} )
}

export async function DeliveryPostCreate(
	channel: string,
	data: {content: string},
	pletyvo = PletyvoVariable.get(),
) {
	return await DappEventCreate( {
		type: 5,
		data: {channel, ...data},
	}, pletyvo )
}

export async function DeliveryPostUpdate(
	channel: string,
	data: {content: string},
	pletyvo = PletyvoVariable.get(),
) {
	return await DappEventCreate( {
		type: 5,
		data: {channel, ...data},
	}, pletyvo )
}

export interface DeliveryPost {
	id: string
	hash: string
	author: string
	channel: string
	content: string
}

export async function DeliveryPostGet(
	channel: string,
	id: string,
	pletyvo = PletyvoVariable.get(),
) {
	return await PletyvoHttpGet<DeliveryPost>(`/delivery/v1/channel/${channel}`, {}, pletyvo)
}

export async function DeliveryPostList(
	channel: string,
	query: PletyvoQuery = {},
	pletyvo = PletyvoVariable.get(),
) {
	return await PletyvoHttpGet<DeliveryPost[]>(`/delivery/v1/channel/${channel}`, query, pletyvo)
}
