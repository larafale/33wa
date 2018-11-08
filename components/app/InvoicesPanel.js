import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import Router from 'next/router'

import Invoices from './Invoices'
import Invoice from './Invoice'

@getContext({
  router: PropTypes.object,
  server: PropTypes.func,
  serverError: PropTypes.func,
  user: PropTypes.object,
  setPanel: PropTypes.func,
})
export default class InvoicesPanel extends Component {

  constructor(props){
    super(props)

    this.state = { 
        edit: false
      , lastEdit: false 
      , wallets: []
    }

    this.editInvoice = this.editInvoice.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    server.get(`/wallets`)
      .then(({data}) => this.setState({ wallets: data }))
      .catch(e => {
        serverError(e)
      })
  }

  componentDidUpdate(prevProps, prevState){
    const prevQuery = prevProps && prevProps.router && prevProps.router.query
    const { query } = this.props.router

    if(!query.iid && prevQuery.iid){
      Router.push(`/root?page=app&panel=invoices`, `/app/invoices`)
      this.editInvoice()
    }

    if(query.iid && !prevState.edit && prevState.lastEdit){
      this.editInvoice(prevState.lastEdit)
    }

    if(this.state.edit && !prevState.edit){
      Router.push(`/root?page=app&panel=invoices&iid=${this.state.edit.id}`, `/app/invoices/${this.state.edit.id}`)
    }
  }

  editInvoice(invoice = false) {
    this.setState({ edit: invoice, lastEdit: invoice || this.state.lastEdit })
  }

  render() {

    const { setPanel } = this.props
    const { edit, wallets } = this.state

    return (<div className="">

      { !edit && <Invoices wallets={wallets} editInvoice={this.editInvoice} />}
      { edit && <Invoice wallets={wallets} invoice={edit} editInvoice={this.editInvoice} />}

    </div>)

  }

}
