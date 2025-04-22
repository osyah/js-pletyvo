import {variable} from '@reatom/core'

/** Should be augmented by other modules. */
export interface Pletyvo {
}
export function Pletyvo(config: Pletyvo) {
	return config
}

export const PletyvoVariable = variable<Pletyvo>()
