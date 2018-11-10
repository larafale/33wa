require('promise.prototype.finally').shim()
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Router, { withRouter } from 'next/router'
import Link from 'next/link'
import moment from 'moment'
import { compose, withState, withContext, getContext } from 'recompose'
import withIo from './hoc/Io'
import cookies from 'cookies-js'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import jwt from 'jsonwebtoken'
import DaDocs from './docs/DaDocs'

import {
    Layout
  , Header
} from './common'

import Explorer from './explorer'
import Site from './site/Home.js'
import Appication from './app/App.js'

import Widget from './widget/index.js'



// common toasts
toast.saved = () => toast.success('Saved !', { className: 'bg-green', autoClose: true })


@compose(
    withIo(p => p.api, n => n.network)
  , withRouter
  , withState('page', 'setPage', p => p.router.query.page)
  , withState('panel', 'setPanel', p => p.router.query.panel)
  , withState('user', 'setUser', p => p.user || {})
  , withContext({ 
        router: PropTypes.object
      , url: PropTypes.object
      , io: PropTypes.object
      , api: PropTypes.string
      , token: PropTypes.string
      , setToken: PropTypes.func
      , server: PropTypes.func        // api http client
      , serverError: PropTypes.func   // server catch() helper
      , auth: PropTypes.object        
      , authed: PropTypes.bool
      , user: PropTypes.object
      , setUser: PropTypes.func
      , page: PropTypes.string
      , setPage: PropTypes.func
      , panel: PropTypes.string
      , setPanel: PropTypes.func
      , network: PropTypes.string
      , setNetwork: PropTypes.func
    }, p => ({
        ...p
      , server: axios.create({
            baseURL: p.api
          , headers: { common: { 'Authorization': `apikey ${p.token}` } }
          // , params: { apikey: p.token }
          // , withCredentials: false
        })
      , serverError: err => {
          const { response = {} } = err
          const data = response.data || { error: err.message || 'server error' }
          console.log('[server] err', data)
          if(data.error) toast.error(data.error)
          if(data.errors) Object.keys(data.errors).forEach(k => {
            const e = data.errors[k]
            toast.error(e.message || e)
          })
        }
      , setNetwork: n => {
          cookies('app_network', n)
          setTimeout(()=>location.reload(), 0)
        }
      , setToken: (t, redirect) => {
          cookies('app_token', t, { expires: Infinity })
          setTimeout(()=> redirect 
            ? window.location.replace(redirect)
            : window.location.reload()
          , 0)
        }
      , setPanel: (panel, replace) => {
          p.setPanel(panel)
          Router[replace?'replace':'push'](`/root?page=app&panel=${panel}`, `/app/${panel}`, { shallow: true })
        }

    }))
)
@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  router: PropTypes.object,
  user: PropTypes.object,
  api: PropTypes.string,
  network: PropTypes.string,
})
export default class App extends Component {

  constructor(props){
    super(props)
    console.log('[api]', this.props.api)
  }

  async componentDidMount(){
    // console.log('[app] mounted')

    // set network cookie
    cookies('app_network', this.props.network || cookies('app_network') || 'mainnet')

    // delegate popover (broken on ios safari)
    $('body').tooltip({ selector: '[rel="tooltip"]' })

    AOS.init({
      disable: 'mobile',
      // offset: 200,
      // duration: 600,
      // easing: 'ease-in-sine',
      // delay: 100,
    })
  }

  render() {
    //console.log('------------------')
    //console.log('[app] render')
    const { router, auth } = this.props
    const { page } = router.query
    const framed = page == 'widget'
    const noHeaders = page == 'widget'

    return (
      <Layout noHeaders={noHeaders}>

        { page == 'widget' && <Widget padded={true} />}

        <ToastContainer className={'toast'} autoClose={3000} closeButton={false} position={'bottom-right'} />

        { !framed && <div className="main-container">
          { page == 'explorer' && <Explorer />}
          { page == 'site' && <Site />}
          { page == 'app' && <Appication />}
          { page == 'docs' && <DaDocs source='https://raw.githubusercontent.com/83x33/docs/master/main.md' />}
        </div>}

      </Layout>
    )
  }
}

