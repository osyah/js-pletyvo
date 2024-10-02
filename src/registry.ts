// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {Dapp} from './dapp.js'
import {PletyvoClient} from './pletyvo_client.js'
import {PletyvoProtocol} from './pletyvo_protocol.js'

export interface RegistryNetwork {
	id: string
	author: string
	name: string
}

export class Registry implements PletyvoProtocol {
	name = 'registry' as const
	client!: PletyvoClient

	async network(id: string) {
		return await this.client.get<RegistryNetwork>(`/registry/v1/network/${id}`)
	}

	async networkCreate( input: {name: string} ) {
		return await this.client.protocol(Dapp).eventCreate(0, 1, 0, 1, input)
	}

	async networkUpdate( input: {name: string} ) {
		return await this.client.protocol(Dapp).eventCreate(0, 1, 0, 1, input)
	}
}
