// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {DappAuthSchema} from './dapp_auth.js'
import {blake3} from '@noble/hashes/blake3'
import {bytesToHex} from '@noble/hashes/utils'
import { PletyvoVariable } from './pletyvo.js'
import { PletyvoHttpGet } from './pletyvo_http.js'

export function DappHash(schema: DappAuthSchema, key: string) {
	return blake3(schema.toString(16).padStart(2, '0') + key)
}

export function DappHashToString(address: Uint8Array) {
	return '0x' + bytesToHex(address)
}

export async function DappHashGet(
	id: string,
	pletyvo = PletyvoVariable.get(),
) {
	const resp = await PletyvoHttpGet<{ id: string }>(`/dapp/v1/hash/${id}`, {}, pletyvo)
	return resp.id
}
