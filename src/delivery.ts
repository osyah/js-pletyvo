// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {DappEventCreate} from './dapp_event.js'
import {Pletyvo, PletyvoQuery} from './pletyvo.js'

export interface DeliveryChannel {
	id: string
	name: string
	author: string
}

export interface DeliveryMessage {
	id: string
	channel: string
	author: string
	content: string
}

export async function DeliveryChannelGet(p: Pletyvo, id: string) {
	return p.get<DeliveryChannel>(`/delivery/v1/channels/${id}`)
}

export async function DeliveryChannelCreate( p: Pletyvo, input: {name: string} ) {
	return await DappEventCreate(p, 0, 1, 0, 2, input)
}

export async function DeliveryChannelUpdate( p: Pletyvo, input: {name: string} ) {
	return await DappEventCreate(p, 1, 1, 0, 2, input)
}

export async function DeliveryMessageList(p: Pletyvo, channel: string, query?: PletyvoQuery) {
	return await p.get<DeliveryMessage[]>(`/delivery/v1/channels/${channel}/messages`, query)
}

export async function DeliveryMessageGet( p: Pletyvo, input: {channel: string, id: string} ) {
	return await p.get<DeliveryMessage>(`/delivery/v1/channels/${input.channel}/messages/${input.id}`)
}

export async function DeliveryMessageCreate(p: Pletyvo, input: {channel: string, content: string} ) {
	return await DappEventCreate(p, 0, 2, 0, 2, input)
}

export async function DeliveryMessageUpdate( p: Pletyvo, input: {channel: string, message: string, content: string} ) {
	return await DappEventCreate(p, 1, 2, 0, 2, input)
}