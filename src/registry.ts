// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {DappEventCreate} from './dapp_event.js'
import {Pletyvo} from './pletyvo.js'

export interface RegistryNetwork {
	id: string
	author: string
	name: string
}

export async function RegistryNetworkGet(p: Pletyvo) {
	return await p.get(`/registry/v1/network`) as RegistryNetwork
}

export async function RegistryNetworkCreate( p: Pletyvo, input: {name: string} ) {
	return await DappEventCreate(p, 0, 1, 0, 1, input)
}

export async function RegistryNetworkUpdate( p: Pletyvo, input: {name: string} ) {
	return await DappEventCreate(p, 1, 1, 0, 1, input)
}
