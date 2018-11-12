import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { getContext } from 'recompose'

import Network from './Network'

export default class Footer extends Component {

  render () {

    return (<footer className="py-2 py-lg-4 bg-dark text-light">

      <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>8333.io</strong>
          <span className="d-none d-sm-inline">
            <span className="social-links fs-16 ml-3">
              <a className="mr-2" href="https://github.com/83x33" title="github"><i className="fab fa-github" /></a>
              <a className="mr-2" href="irc://freenode/8333io" title="IRC channel #8333io"><i className="fas fa-hashtag" /></a>
              <a className="mr-2" href="https://twitter.com/_8333_" title="twitter"><i className="fab fa-twitter" /></a>
            </span>
             {/*y <a className="text-warning">larafale</a>.*/}
          </span>
        </div>
        <div>
          <Network />
        </div>
      </div>
      </div>


    </footer>)

  }

}