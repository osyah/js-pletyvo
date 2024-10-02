// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {DappAuthSchema} from './dapp_auth.js'
import {blake3} from '@noble/hashes/blake3'
import {bytesToHex} from '@noble/hashes/utils'

export function DappAddress(schema: DappAuthSchema, key: string) {
	return blake3(schema.toString(16).padStart(2, '0') + key)
}

export function DappAuthAddressToString(address: Uint8Array) {
	return '0x' + bytesToHex(address)
}
