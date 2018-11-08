import { md2Html } from './utils'

const o = {

		"hero": "a Ƀitcoin service provider :)"

	, "subhero": `The 8333.io platform provides tooling, apps & services on top of any bip32 compatible Bitcoin wallet. It's a service layer on top of the Bitcoin network, offering powerful utilities for users and/or developpers, via a browser or our API & SDK's.`

	, "price": "We believe in free market and value creation, it really matters to us that 8333 can sustain itself via the right model. Until we gather enough feedbacks to decide for a model, our services will be free."

	, "what": `
8333 is a Bitcoin Service Provider, and also :

- non custodial (trustless aka no private keys involved)
- works with any bip32 wallet (electrum, trezor, ledger, samourai...)
- testnet compatible

It provides :

- invoices management
- currency support: usd,eur,jpy,gbp,cad
- payment widget
- utxos scanning (aka wallet balance)
- price utilities
- API & SDK's

Understand that it is:

- not custodial
- not a payment provider. 
- not a wallet
- not a third party

What's in the pipe ?

- CMS extensions (wordpress, prestashop, name it)
- LN support
- i18n
- ...
`
, "tech": `
Our software stack, named "coretool", is nodeJS based, and was built from scratch using modern Javascript. A lot of time and effort is being put in the design and architecture of the 8333 platform. In a nutshell, we monitor the Bitcoin network (mainnet or testnet) through multiple bitcoin core instances (for redundancy et reliability), all running the same versions (0.17.0 to date). 

All our SDK's are open source, and everyone is free to contribute to the 8333 ecosystem. We want & are building a platform that can be consumed by any types of clients, in a trustless manner, providing frictionless & valuable services for the Bitcoin community. It's just the start :)
`
	
	, "who": `We are a small team digging deep down the Ƀitcoin rabit hole, there is no going back. We fully embrace the new paradigm, Ƀitcoin is a rare gift, we better make it right. As cypherpunks, and as parents, we feel it's our reponsibility to build for Bitcoin. It's our future we are talking about, we have skin in the game, so we code, without asking permissions.

For now the team is only one person, me :) I'm Louis, i've been crafting software since forever, and I also happen to be a Ƀitcoin maximalist (I think they call it "Bitcoin terrorists" this days :) Anyway, 8333 is currently what's on my mind, my soulmate can relate ♥`

	, "price": "We believe in free markets and value creation, it really matters to us that 8333 can sustain itself via the right model.  Until we gather enough feedbacks to decide for a revenue model, our services will be free. Please get in touch and give us insights on which revenue model you think is best."

	, "ux": `
Building interactive Bitcoin payments interfaces is not a trivial task. 
One of 8333 value proposition is our unique and carefuly crafted **\`Payment Widget\`** :)
Every invoice you create on the platform comes with a unique payment url, displaying this widget.
You can also integrate the widget directly in your applications, by using our SDK's.
Click the different steps/dots to get a look at the process. This is a demo, don't send bitcoin.
`

	, "why": `
Since almost 10 years, Bitcoin has not failed to deliver on the fondamentals. The smartest minds on the planet get sucked by this phenomal force. Deep down Bitcoin is mind blowing, it's a master piece on so many levels. The force is so big that we had no choices but to embrace Bitcoin. 8333 is our humble initiative.
`

	, "context": `
As mentionned above, for now it's only 1 person carrying the vision and the stack. The goal is to make a living out of our value propositions. We have not decided on the proper business model yet and the project will be free to use until enough feedbacks are gathered from early adopters. We really welcome your insights, please get in touch at [yo@8333.io](yo@8333.io)`

}


const Lib = {
    t: (key) => (o[key] || `key ${key} not found`)
	, md: (key) => md2Html(Lib.t(key))
}

export default Lib