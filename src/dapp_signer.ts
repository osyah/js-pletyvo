// Copyright (c) 2024 Osyah
// SPDX-License-Identifier: MIT

import {DappAuthSchema} from './dapp_auth.js'

export const DappSigner = Symbol('DappSigner')

declare module './pletyvo.js' {
	export interface Pletyvo {
		[DappSigner]?: DappSigner
	}
}

export interface DappSigner {
	get schema(): DappAuthSchema
	get public(): string
	sign(data: Uint8Array): string
}
