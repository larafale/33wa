import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { SpinnerBox } from '../common/Spinner'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
})
export default class Wallets extends Component {

  constructor(props){
    super(props)
    this.state = { wallets: [], mounted: false }
    this.add = this.add.bind(this)
  }

  componentDidMount() {
    const { server, serverError, editWallet } = this.props

    server.get(`/wallets`)
      .then(({data}) => {
        this.setState({ mounted: true, wallets: data })
        // editWallet(data[0]) // DEV: display first item on mount
      })
      .catch(e => {
        serverError(e)
      })
  }

  async add(e) {
    const { editWallet, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    server.post(`/wallets`)
      .then(({data}) => { editWallet(data) })
      .catch(serverError)
  }

  render() {

    const { editWallet } = this.props
    const { mounted, wallets } = this.state

    return (<div className="">

      <div className="d-flex justify-content-between align-items-center flex-row-reverse">
        <a onClick={this.add} className="btn btn-outline-dark" href='javascript:'>
          <i className="fa fa-plus" />
          Add
        </a>
        <div className="h3 m-0 d-none d-lg-block">Wallets</div>
      </div>
      <hr/>

      { !mounted && <SpinnerBox />}

      { mounted && <div>
        
        { wallets.length == 0 && <div className="text-center">
          <img className="img-fluid" src={'/static/img/noresult.png'} style={{width: '500px'}} />
        </div>}
        { wallets.length > 0 && <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
          { wallets.map((s, i) =>
            <tr key={i} onClick={()=>editWallet(s)} key={i} className="cursor">
              <td>{s.name}</td>
            </tr>
          )}
          </tbody>
        </table>}

      </div>}
 

    </div>)

  }

}