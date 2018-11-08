import 'isomorphic-fetch'
import React, { Component } from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Error from 'next/error'
import { compose, withState, withContext, getContext } from 'recompose'

import {
    Menu
  , InvoicesPanel
  , WalletsPanel
  , SettingsPanel
  , BillingPanel
} from './'

import {
    Auth
  , BlackBox
} from '../common'




@getContext({
  router: PropTypes.object,
  server: PropTypes.func,
  user: PropTypes.object,
  panel: PropTypes.string,
  setPanel: PropTypes.func,
  auth: PropTypes.object,
  authed: PropTypes.bool,
})
export default class Application extends Component {

  componentDidMount(){
    const { authed, setPanel, panel } = this.props
    !authed && $('.body').addClass('bg-dark')
    if(!panel) setPanel('invoices', true)
  }

  componentDidUpdate(prevProps){
    const { query } = this.props.router
    const { setPanel } = this.props

    if(prevProps.panel != query.panel) setPanel(query.panel)
  }

  constructor(props){
    super(props)
  }

  render () {
    // console.log(this.props)
    const { panel, user, authed, auth } = this.props

    return (<div className="">

      { auth.role == 'root' && <BlackBox />}

      <div className="container">

        { !authed && <div className="row py-5">
          <Auth />
        </div>}

        
        { authed && <div className="row pt-0 pb-3 py-lg-5">
          <div className="panel col-lg-3 p-0 p-lg-3">
            <Menu/>
          </div>
          <div className="col-lg-9">
            { panel == 'invoices' && <InvoicesPanel /> }
            { panel == 'wallets' && <WalletsPanel /> }
            { panel == 'settings' && <SettingsPanel /> }
            { panel == 'billing' && <BillingPanel /> }
          </div>
        </div>}
      
      </div>


      <style jsx>{`

        @media (min-width: 992px){
          .panel {
            border-right: 2px solid #eee;
          }
        }

      `}</style>



    </div>)
  }
}

