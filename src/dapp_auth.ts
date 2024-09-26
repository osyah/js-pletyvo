// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {blake3} from '@noble/hashes/blake3'
import {bytesToHex} from '@noble/hashes/utils'

export interface DappAuthHeader {
	sch: DappAuthSchema
	pub: string
	sig: string
}

export interface DappAuthSigner {
	schema(): DappAuthSchema
	public(): Uint8Array
	sign(msg: Uint8Array): Uint8Array
}

export const enum DappAuthSchema {
	ed25519 = 0x0,
}

export function DappAuthAddressCreate(signer: DappAuthSigner) {
	return blake3( signer.schema().toString(16).padStart(2, '0') + signer.public() )
}

export function DappAuthAddressString(address: Uint8Array) {
	return '0x' + bytesToHex(address)
}