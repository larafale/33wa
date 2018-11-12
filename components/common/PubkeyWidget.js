import React, { Component } from 'react'
import PropTypes from 'prop-types'
import keys from 'lodash/keys'
import take from 'lodash/take'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
})
export default class PubkeyWidget extends Component {

  constructor(props){
    super(props)

    this.state = { 
        id: new Date%500
      , pubkey: ''
      , derivations: []
      , info: {}
    }

    this.derivePubkey = this.derivePubkey.bind(this)
    this.onPubkeyChange = this.onPubkeyChange.bind(this)
  }

  componentDidMount(){

    const { pubkey } = this.props
    
    pubkey && this.derivePubkey(pubkey)
      .then(({data}) => {
        this.setState({ 
            pubkey
          , derivations: data[0]
          , info: data[1] 
        })
      })
  }

  async onPubkeyChange(e) {
    const { onChange, server, serverError } = this.props
    const cta = $(e.target)
    // spinOn(cta)


    const el = e.target
    const pubkey = el.value

    // forward input change
    onChange && onChange({ pubkey })

    // clean pre call
    this.setState({ 
        pubkey
      , derivations: []
      , info: {}
    })

    pubkey && this.derivePubkey(pubkey)
      .then(({data}) => {
        this.setState({ 
            derivations: data[0]
          , info: data[1] 
        })
      })
      .catch(serverError)
      .finally(spinOff(cta))
  }

  // proxy http call handler
  async derivePubkey(pubkey) {
    const { server } = this.props
    return server.get(`/utils/derive/${pubkey}`)
  }


  render() {

    const { title, onChange } = this.props
    const { id, pubkey, derivations, info } = this.state

      
    // <Debug d={object} />
    const Debug = (data) => (<div className="bg-light my-3 p-3">
      <span>DEBUG</span>
      <small><pre>{JSON.stringify(data, null, 2)}</pre></small>
    </div>)


    const KeyValueLabels = ({ obj }) => <div>
      { keys(obj).map((key, i) => <div key={i}>
        <div><strong>{key} :</strong><small>{'  '+obj[key]}</small></div>
      </div>)}
    </div>

    return (<div>

      <div className="">
        <div className="row">
        <div className="col-12">
          <input id={id} type="text" onChange={this.onPubkeyChange} value={pubkey} className="form-control" placeholder="Paste a pubkey" />
        </div>
        </div>

        { derivations.length > 0 && <div className="row">
          <div className="col-12">
            <div className="row py-3">

              <div className="col-12 col-md-6 mb-2">
                <div className="bg-light p-3">
                  { take(derivations, 2).map((wif, i) => <div key={i}>
                    <div><span className="badge badge-warning">{i+1}</span><small>{'  '+wif}</small></div>
                  </div>)}
                  <div><span className="badge badge-warning">{3}</span><small>{'  '+'...'}</small></div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="bg-light p-3">
                  <KeyValueLabels obj={info} />
                </div>
              </div>

            </div>
          </div>
        </div>}

      </div>

    </div>)
  }
}
