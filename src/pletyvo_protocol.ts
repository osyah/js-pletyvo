import {PletyvoClient} from './pletyvo_client.js'

export interface PletyvoProtocol {
	get name(): string
	set client(next: PletyvoClient)
}
