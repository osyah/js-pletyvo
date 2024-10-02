// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {DappAuthSchema} from './dapp_auth.js'

export interface DappSigner {
	get schema(): DappAuthSchema
	get public(): Uint8Array
	sign(data: Uint8Array): Uint8Array
}
