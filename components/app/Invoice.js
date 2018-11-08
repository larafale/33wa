import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { spinOn, spinOff } from '../../lib/util'
import { formatPrice } from '../../lib/btc-price'
import moment from 'moment'
import { Prices } from '../common'
import Widget from '../widget/index.js'



@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
  setUser: PropTypes.func,
})
export default class Invoice extends Component {

  constructor(props){
    super(props)
    const { invoice, auth, wallets } = props

    const form = {
        wid: invoice.wid || (wallets[0] && wallets[0].id)
      , price: invoice.price || false
    }

    this.state = { form }

    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  async save(e) {
    const { invoice, editInvoice, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    const method = invoice.id ? 'put' : 'post'
    server[method](`/invoices/${invoice.id||''}`, form)
      .then(({ data }) => editInvoice(data))
      .catch(serverError)
      .finally(spinOff(cta))
  } 

  async delete(e) {
    const { invoice, editInvoice, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.delete(`/invoices/${invoice.id}`)
      .then((d) => editInvoice(false))
      .catch(serverError)
      .finally(spinOff(cta))
  }

  render () {

    const { editInvoice, invoice, wallets } = this.props
    const { form } = this.state
    const { price } = invoice
    const wallet = _.find(wallets, s => s.id === form.wid) || wallets[0] || {}

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    const setPrice = price => {
      this.setState({ form: { ...form, price } })
    }

    const Spread = ({ spread }) => {
      return ((spread > 0 || spread < 0) && <div className="badge badge-danger">{spread>0?'+':''}{formatPrice(spread, 'satoshis', 'btc')}</div>)
    }

    const statusColors = {
        pending: 'warning'
      , received: 'primary'
      , confirmed: 'success'
      , expired: 'dark'
    }

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center">
        <div className="h3 m-0 d-none d-lg-block">{ invoice.id ? '':'Create' } Invoice</div>
        
        <a onClick={()=>window.history.back()} className="btn btn-outline-dark d-lg-none" href='javascript:'>
          <i className="fa fa-arrow-left" />
          Back
        </a>
        
        <div className={`more-actions ${invoice.id?'':'d-none'}`}>
          <a className="btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" href="#" role="button">
            <i className="fa fa-cog"/>
            More
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <Link href={`/root?page=widget&id=${invoice.id}`} as={`/invoice/${invoice.id}${invoice.network=='testnet'?'?network=testnet':''}`}>
              <a className="dropdown-item">
                <i className="fa fa-chain" />
                 Public Link
              </a>
            </Link>
            <div className="dropdown-divider"></div>
            <a onClick={this.delete} className="dropdown-item" href='javascript:'>
              <i className="fa fa-refresh fa-spin d-none" />
              <i className="fa fa-trash" />
               Delete
            </a>
          </div>
        </div>
      </div>
      <hr/>

      
      <div className="row">

        <div className="col-12 col-lg-6">
          { invoice.id && <div>

            <table className="table table-sm table-hover">
              <tbody>
                <tr>
                  <td><label>ID</label></td>
                  <td className="text-right">{invoice.id}</td>
                </tr>
                <tr>
                  <td><label>Date</label></td>
                  <td className="text-right">{moment(invoice.cat).format('DD MMM YYYY HH:mm')}</td>
                </tr>
                <tr>
                  <td><label>Status</label></td>
                  <td className="text-right">
                    <span className={`badge badge-${statusColors[invoice.status]}`}>{invoice.status}</span>
                    <Spread spread={invoice.spread} />
                  </td>
                </tr>
                { price && price.ts && <tr>
                  <td><label>Fiat</label></td>
                  <td className="text-right">{invoice.price.fiat_formated}</td>
                </tr>}
                { price && price.ts && <tr>
                  <td><label>BTC</label></td>
                  <td className="text-right">{invoice.price.btc}</td>
                </tr>}
                <tr className="d-none d-sm-table-row">
                  <td><label>Wallet</label></td>
                  <td className="text-right">{(_.find(wallets, w => w.id === invoice.wid) || {}).name}</td>
                </tr>
                <tr className="d-none d-sm-table-row">
                  <td><label>Address</label></td>
                  <td className="text-right">
                    <span className={`text-secondary mt-2 selectable ${invoice.address.length>34 ? 'fs-11':'fs-11'}`} style={{lineHeight:'23px'}}>{invoice.address}</span>
                  </td>
                </tr>
                <tr>
                  <td><label>Network</label></td>
                  <td className="text-right">{invoice.network}</td>
                </tr>
                { invoice.tx.height > 0 && <tr>
                  <td><label>Height</label></td>
                  <td className="text-right">{invoice.tx.height}</td>
                </tr>}
              </tbody>
            </table>
          </div>}

          { !invoice.id && <div>
            <div className="form-group">
              <label>Wallet</label>
              <select onChange={setForm('wid')} className="form-control">
                { wallets.map((s, i) =>
                  <option key={i} value={s.id}>
                    {s.name}
                  </option>
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <Prices ticker={wallet.ticker} fiatTicker={wallet.fiat} onPrice={setPrice} price={form.price} />
            </div>
          </div>}


          <div className="mt-5">
            <hr/>
            <div className="d-flex justify-content-between">
              <a onClick={()=>window.history.back()} className="btn btn-outline-dark mr-2" href='javascript:'>
                <i className="fa fa-arrow-left" />
                Back
              </a>
              { !invoice.status && <a onClick={this.save} className="btn btn-warning" href='javascript:'>
                <i className="fa fa-refresh fa-spin d-none" />
                <i className="fa fa-pencil" />
                Save
              </a>}
            </div>
          </div>

        </div>

        <div className="col-12 col-lg-6 d-none d-lg-block">
          { invoice.id && <Widget framed={true} id={invoice.id} onStatus={editInvoice} invoice={invoice} wallet={wallet} />}
        </div>

      </div>

      <style jsx>{`
        .more-actions .dropdown-toggle::after, .more-actions .dropdown-toggle::before {
          display: none;
        }
      `}</style>  

    </div>)

  }

}
