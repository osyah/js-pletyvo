export interface DappAuthHeader {
	sch: DappAuthSchema
	pub: string
	sig: string
}

export const enum DappAuthSchema {
	ed25519 = 0x0
}
