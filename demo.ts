import {Dapp, DappSignerEd25519, PletyvoClient, Delivery} from './src/index.js'

const client = new PletyvoClient( {
	gateway: 'http://testnet.pletyvo.osyah.com/api',
	network: '0191e5b0-b730-7167-965a-083f5b759c32',
} )

const privateKey = DappSignerEd25519.randomPrivateKey()
const signer = new DappSignerEd25519(privateKey)

const pletyvo = client.with( [
	new Dapp( {signer} ),
	new Delivery(),
] )

const createdEventId = await pletyvo.delivery.messageCreate( {
	content:'Hello, Delivery!',
	channel: '0191e5b1-6f26-7c0f-b87c-72712e48f42b'
} )

const detailedEventInfo = await pletyvo.dapp.event(createdEventId) // DappEvent
detailedEventInfo.data() // "Hello, dApp!"
detailedEventInfo.event() // 1
detailedEventInfo.aggregate() // 2
detailedEventInfo.version() // 3
detailedEventInfo.protocol() // 4

const twentyPreviousEvents = await pletyvo.dapp.events({limit: 20, before: detailedEventInfo.id}) // Array<DappEvent>
twentyPreviousEvents.length // 20
