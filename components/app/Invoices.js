import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { SpinnerBox } from '../common/Spinner'
import moment from 'moment'
import { spinOn, spinOff } from '../../lib/util'
import { formatPrice } from '../../lib/btc-price'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
})
export default class Invoices extends Component {

  constructor(props){
    super(props)
    this.state = { mounted: false, invoices: [], ticker: 'btc' }
    this.add = this.add.bind(this)
  }

  componentDidMount() {
    const { server, serverError, wallets } = this.props

    server.get(`/invoices`)
      .then(({data}) => setTimeout(()=>this.setState({ mounted: true, invoices: data }) , 0))
      .catch(e => {
        serverError(e)
      })
  }

  switchTicker() {
    const { ticker } = this.state
    const map = {btc:'mbtc',mbtc:'satoshis',satoshis:'fiat',fiat:'btc'}
    this.setState({ ticker: map[ticker] })
  }

  async add(e) {
    const { editInvoice } = this.props
    return editInvoice({})
  }

  render() {

    const { editInvoice, wallets } = this.props
    const { mounted, invoices, ticker } = this.state

    const statusColors = {
        pending: 'warning'
      , received: 'primary'
      , confirmed: 'success'
      , expired: 'dark'
    }

    const Spread = ({ spread }) => {
      return ((spread > 0 || spread < 0) && <div className="badge badge-danger">{spread>0?'+':''}{formatPrice(spread, 'satoshis', ticker)}</div>)
    }

    // const pricePrint = (price = {}, ticker = 'btc') => {
    //    price.fiat_formated) || '-'
    // }

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center flex-row-reverse">
        <div className="d-flex align-items-center">
          {/*<select id="wallet_select" className="form-control">
            { wallets.map((s, i) =>
              <option key={i} value={s.id}>
                {s.name}
              </option>
            )}
          </select>*/}
          <a onClick={this.add} className="btn btn-outline-dark" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            <i className="fa fa-plus" />
            Create
          </a>
        </div>
        <div className="h3 m-0 d-none d-lg-block">Invoices</div>
      </div>
      <hr/>

      { !mounted && <SpinnerBox />}

      { mounted && <div>

        { false && <div className="d-flex justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <input type="text" placeholder="search..." className="form-control" />
            <a onClick={()=>{}} className="btn btn-dark pull-right" href='javascript:'>
              <i className="fa fa-search" />
              Search
            </a>
          </div>
        </div>}

        { invoices.length == 0 && <div className="text-center">
          <img className="img-fluid" src={'/static/img/noresult.png'} style={{width: '500px'}} />
        </div>}

        { invoices.length > 0 && <div className="animated fadeIn">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell">ID</th>
                <th className="cursor text-md-right" onClick={()=>this.switchTicker()}>Amount</th>
                <th className="d-none d-sm-table-cell">Status</th>
                <th className="text-right">Meta</th>
              </tr>
            </thead>
            <tbody>

            

            { invoices.map((invoice, i) =>
              <tr onClick={()=>editInvoice(invoice)} key={i} className="cursor">
                <td className="d-none d-md-table-cell"><small>{invoice.id}</small></td>
                <td>
                  <div className="d-sm-none"><small>{invoice.id}</small></div>
                  <div className="text-md-right">
                    { formatPrice(invoice.price.satoshis, 'satoshis', ticker) || invoice.price.fiat_formated || '-' }
                  </div>
                </td>
                <td className="d-none d-sm-table-cell">
                  <span className={`badge badge-${statusColors[invoice.status]}`}>{invoice.status}</span>
                  <Spread spread={invoice.spread} />
                </td>
                <td className="text-right">
                  <div className="d-sm-none">
                    <span className={`badge badge-${statusColors[invoice.status]}`}>{invoice.status}</span>
                    <Spread spread={invoice.spread} />
                  </div>
                  <small className="d-none d-sm-block">
                    {moment(invoice.cat).format('DD MMM YYYY HH:mm')}
                    <br/>
                    {(_.find(wallets, w => w.id === invoice.wid) || {}).name}
                  </small>
                </td>
              </tr>
            )}
            </tbody>
          </table>

        </div>}
      </div>}


    </div>)

  }

}