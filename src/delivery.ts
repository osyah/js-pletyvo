// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {Dapp} from './dapp.js'
import {PletyvoClient} from './pletyvo_client.js'
import {PletyvoProtocol} from './pletyvo_protocol.js'
import {PletyvoQuery} from './pletyvo_query.js'

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

export class Delivery implements PletyvoProtocol {
	name = 'delivery' as const
	client!: PletyvoClient

	async channel(id: string) {
		return this.client.get<DeliveryChannel>(`/delivery/v1/channels/${id}`)
	}

	async channelCreate( input: {name: string} ) {
		return await this.client.protocol(Dapp).eventCreate(0, 1, 0, 2, input)
	}

	async channelUpdate( input: {name: string} ) {
		return await this.client.protocol(Dapp).eventCreate(1, 1, 0, 2, input)
	}

	async messages(channel: string, query?: PletyvoQuery) {
		return await this.client.get<DeliveryMessage[]>(`/delivery/v1/channels/${channel}/messages`, query)
	}

	async message( input: {channel: string, id: string} ) {
		return await this.client.get<DeliveryMessage>(`/delivery/v1/channels/${input.channel}/messages/${input.id}`)
	}

	async messageCreate(input: {channel: string, content: string} ) {
		return await this.client.protocol(Dapp).eventCreate(0, 2, 0, 2, input)
	}

	async messageUpdate( input: {channel: string, message: string, content: string} ) {
		return await this.client.protocol(Dapp).eventCreate(1, 2, 0, 2, input)
	}
}
