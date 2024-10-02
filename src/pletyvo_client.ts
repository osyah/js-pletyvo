import {PletyvoProtocol} from './pletyvo_protocol.js'
import {PletyvoQuery} from './pletyvo_query.js'

export class PletyvoClient {
	//#region Protocols

	protocols?: Map<Function, object>

	with<proto extends PletyvoProtocol>( protocols: proto[] ) {
		if(this.protocols) throw new Error('Protocols already configured')
		this.protocols = new Map
		const acc = {} as { [ k in proto['name'] ]: Extract< proto, {name: k} > }
		for(const p of protocols) {
			this.protocols.set(p.constructor, p)
			;(acc as any)[p.name] = p
			p.client = this
		}
		return acc
	}

	protocol<p>(constructor: new(...args: any) => p) {
		if(!this.protocols) throw new Error(`Protocols not configured`)
		const p = this.protocols.get(constructor) as p
		if(!p) throw new Error(`Protocol "${constructor.name}" not registered`)
		return p
	}

	//#endregion
	//#region Making requests

	gateway?: string
	network?: string
	fetch: (url: string, init: RequestInit) => Promise<Response> = globalThis.fetch

	constructor( config: Partial< Pick< PletyvoClient, 'gateway' | 'network' | 'fetch' > > ) {
		Object.assign(this, config)
	}

	get<data>(endpoint: string, query?: PletyvoQuery) {
		return this.request<data>('get', endpoint, undefined, query)
	}

	post<data>(endpoint: string, body: unknown) {
		return this.request<data>('post', endpoint, body, undefined)
	}

	async request<data>(method: 'get' | 'post', endpoint: string, body: unknown, query?: PletyvoQuery) {
		const headers = new Headers()
		method === 'post' && headers.set('content-type', 'json')
		this.network && headers.set('Network', this.network)


		const queryString = query ? ( '?' + new URLSearchParams(query as any) ) : ''
		console.log(`${method} ${(this.gateway ?? '').replace(/\/$/, '') + endpoint + queryString}`, {body, headers})
		const response = await this.fetch( (this.gateway ?? '').replace(/\/$/, '') + endpoint + queryString, {
			method,
			body: body === undefined ? undefined : JSON.stringify(body),
			headers,
		} )

		if (response.status !== 200) {
			throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`)
		}
		return response.json() as data
	}

	//#endregion
}
