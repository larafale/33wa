import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'
import { toast } from 'react-toastify'
import { Settings as priceInfo, formatPrice } from '../../lib/btc-price'
import PubkeyWidget from '../common/PubkeyWidget'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
  setUser: PropTypes.func,
})
export default class Wallet extends Component {

  constructor(props){
    super(props)
    const { wallet, auth } = props

    const form = {
        name: wallet.name || ''
      , xpub: wallet.xpub || ''
      , hook: wallet.hook || ''
      , ticker: wallet.ticker
      , fiat: wallet.fiat
      , confs: wallet.confs
      , expires: wallet.expires
      , authOnly: wallet.authOnly
    }

    this.state = { form }

    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
    this.setForm = this.setForm.bind(this)
  }

  

  async save(e) {
    const { wallet, editWallet, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.put(`/wallets/${wallet.id}`, form)
      .then(({ data }) => {
        toast.saved()
        editWallet(data)
      })
      .catch(serverError)
      .finally(spinOff(cta))
  }

  async delete(e) {
    const { wallet, editWallet, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.delete(`/wallets/${wallet.id}`)
      .then((d) => editWallet(false))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  setForm(key) { 
    const self = this
    return e => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      self.setState({ form: { ...self.state.form, [key]: value } })
    }
  }

  render () {

    const { setForm } = this
    const { editWallet, wallet } = this.props
    const { form } = this.state

    const onPubkeyChange = ({ pubkey }) => this.setState({ form: { ...this.state.form, xpub: pubkey } })

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center flex-row-reverse">
        <div className="more-actions">
          <a className="btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" href="#" role="button">
            <i className="fa fa-cog"/>
            More
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a onClick={this.delete} className="dropdown-item" href='javascript:'>
              <i className="fa fa-refresh fa-spin d-none" />
              <i className="fa fa-trash" />
               Delete
            </a>
          </div>
        </div>
        <a onClick={()=>window.history.back()} className="btn btn-outline-dark d-lg-none" href='javascript:'>
          <i className="fa fa-arrow-left" />
          Back
        </a>
        <div className="h3 m-0 d-none d-lg-block">{form.name}</div>
      </div>
      <hr/>

      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-toggle="tab" href="#tab-1" role="tab">General</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#tab-2" role="tab">Invoices settings</a>
        </li>
      </ul>

      <div className="tab-content">

        {/* ----------------------
            TAB GENERAL
        -------------------------*/}

        <div className="tab-pane fade show active" id="tab-1" role="tabpanel">
          <div className="form-group">
            <label>Name</label>
            <input type="text" onChange={setForm('name')} value={form.name} className="form-control" placeholder="Name" />
          </div>
          <div className="form-group">
            <label>Extended Public Key (xpub, ypub, zpub, tpub, upub, vpub)</label>
            <PubkeyWidget pubkey={form.xpub } onChange={onPubkeyChange} />
          </div>
        </div>

        {/* ----------------------
            TAB SETTINGS
        -------------------------*/}

        <div className="tab-pane fade" id="tab-2" role="tabpanel">

          <div className="row">
            <div className="form-group col-6">
              <label>
                Ticker 
                <i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-title="<small class='d-inline-block'>Default ticker for invoices.<br>Can also be set at invoice creation.</small>" />
              </label>
              <select onChange={setForm('ticker')} value={form.ticker} className="form-control">
                { _.keys(priceInfo.symbols).map((ticker, i) =>
                  <option key={i} value={ticker} >
                    {priceInfo.symbols[ticker].ticker}
                  </option>
                )}
              </select>
            </div>
            <div className="form-group col-6">
              <label>
                Fiat 
                <i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-title="<small class='d-inline-block'>Default fiat currency to check price against.</small>" />
              </label>
              <select onChange={setForm('fiat')} value={form.fiat} className="form-control">
                { _.keys(priceInfo.symbols).filter(i=>(!['btc','mbtc','satoshis'].includes(i))).map((ticker, i) =>
                  <option key={i} value={ticker}>
                    {priceInfo.symbols[ticker].ticker}
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label >
                Nb confs 
                <i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-title="<small class='d-inline-block'>Blocks needed before<br>invoice change to 'confirmed'</small>" />
              </label>
              <select onChange={setForm('confs')} value={form.confs} className="form-control">
                { [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((conf, i) =>
                  <option key={i} value={conf} >
                    {conf == 0 ? 'instant (zero confirmation)' : `${conf}`}
                  </option>
                )}
              </select>
            </div>
            <div className="form-group col-6">
              <label>
                Expires 
                <i className="fa fa-info-circle" rel="tooltip" data-toggle="tooltip" data-html="true" data-title="<small class='d-inline-block'>Number of minutes before<br>invoice change to 'expired'.<br/>min = 10, max = 1440 (24h)</small>" />
              </label>
              <input type="number" onChange={setForm('expires')} value={form.expires} step="1" min="10" max="1440" className="form-control" placeholder="x minutes" />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-12 mb-0">
              <label>Status hook</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{background:'#f9f9f9',color:'#8c8c8d',fontSize:'10px',padding:'12px'}}>HTTP POST</span>
                </div>
                <input type="text" onChange={setForm('hook')} value={form.hook} className="form-control" placeholder="http(s)://www.domain.tld/endpoint?foo=bar" />
              </div>
              <div className="alert alert-light p-2 pt-3 fs-11" style={{marginTop:'-6px',zIndex:'-1'}}>
                Get live alerts of invoices status changes. Receive the following JSON: {`{ "id":"invoiceID", "status":"confirmed" }`}
              </div>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="form-group col-12">
              <div className="custom-control custom-checkbox ">
                <input id="inputAuthOnly" type="checkbox" checked={form.authOnly} onChange={setForm('authOnly')} className="custom-control-input cursor" />
                <label className="custom-control-label cursor" htmlFor="inputAuthOnly">Require passing an <strong>apikey</strong> to create invoices.</label>
              </div>
            </div>
          </div>


        </div>

        {/* ----------------------
            TAB .....
        -------------------------*/}

      </div>

      <div className="mt-5">
        <hr/>
        <div className="d-flex justify-content-between">
          <a onClick={()=>window.history.back()} className="btn btn-outline-dark mr-2" href='javascript:'>
            <i className="fa fa-arrow-left" />
            Back
          </a>
          <a onClick={this.save} className="btn btn-warning" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            <i className="fa fa-pencil" />
            Save
          </a>
        </div>
        {/*<a onClick={this.delete} className="btn btn-outline-danger" href='javascript:'>
          <i className="fa fa-refresh fa-spin d-none" />
          <i className="fa fa-trash" />
          Delete
        </a>*/}
      </div>

      <style jsx>{`
        .more-actions .dropdown-toggle::after, .more-actions .dropdown-toggle::before {
          display: none;
        }
      `}</style>  

    </div>)

  }

}
