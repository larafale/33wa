import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import Router from 'next/router'

import Wallets from './Wallets'
import Wallet from './Wallet'

@getContext({
  router: PropTypes.object,
  server: PropTypes.func,
  serverError: PropTypes.func,
  user: PropTypes.object,
  setPanel: PropTypes.func,
})
export default class WalletsPanel extends Component {

  constructor(props){
    super(props)

    this.state = { 
        edit: false 
      , lastEdit: false 
    }

    this.editWallet = this.editWallet.bind(this)
  }

  componentDidMount() {
    const { server, serverError } = this.props

    // server.get(`/wallets`)
    //   .then(({data}) => this.setState({ wallets: data }))
    //   .catch(e => {
    //     serverError(e)
    //   })

  }

  componentDidUpdate(prevProps, prevState){
    const prevQuery = prevProps && prevProps.router && prevProps.router.query
    const { query } = this.props.router

    if(!query.wid && prevQuery.wid){
      Router.push(`/root?page=app&panel=wallets`, `/app/wallets`)
      this.editWallet()
    }

    if(query.wid && !prevState.edit && prevState.lastEdit){
      this.editWallet(prevState.lastEdit)
    }

    if(this.state.edit && !prevState.edit){
      Router.push(`/root?page=app&panel=wallets&wid=${this.state.edit.id}`, `/app/wallets/${this.state.edit.id}`)
    }
  }

  editWallet(wallet = false) {
    this.setState({ edit: wallet, lastEdit: wallet || this.state.lastEdit })
  }

  render() {

    const { setPanel } = this.props
    const { edit } = this.state

    return (<div className="">

      { !edit && <Wallets editWallet={this.editWallet} />}
      { edit && <Wallet wallet={edit} editWallet={this.editWallet} />}


    </div>)

  }

}
