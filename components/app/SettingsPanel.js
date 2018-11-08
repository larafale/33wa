import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import _ from 'lodash'
import { getContext } from 'recompose'
import { toast } from 'react-toastify'
import { spinOn, spinOff } from '../../lib/util'


@getContext({
  server: PropTypes.func,
  serverError: PropTypes.func,
  auth: PropTypes.object,
  user: PropTypes.object,
  setUser: PropTypes.func,
})
export default class SettingsPanel extends Component {

  constructor(props){
    super(props)
    const { user, auth } = props

    const form = {
        email: user.email || ''
      , firstname: user.firstname || ''
      , lastname: user.lastname || ''
    }

    if(auth.role === 'root'){
      form.role = user.role || ''
    } 

    this.state = { form }

    this.save = this.save.bind(this)
  }

  async save(e) {
    const { user, setUser, server, serverError } = this.props
    const { form } = this.state
    const cta = $(e.target)

    spinOn(cta)

    server.put(`/users/${user.id}`, form)
      .then(({ data }) => {
        toast.saved()
        setUser(data)
      })
      .catch(serverError)
      .finally(spinOff(cta))
  }

  render () {

    const { user } = this.props
    const { form } = this.state

    const setForm = key => e => {
      this.setState({ form: { ...form, [key]: e.target.value } })
    }

    return (<div className="box">
      <div className="d-none d-lg-block">
        <div className="h3">Settings</div>
        <hr/>
      </div>

      <ul className="nav nav-tabs mb-3" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-toggle="tab" href="#tab-1" role="tab">Account</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#tab-2" role="tab">API Key</a>
        </li>
      </ul>

      <div className="tab-content">

        {/* ----------------------
            TAB ACCOUNT
        -------------------------*/}

        <div className="tab-pane fade show active" id="tab-1" role="tabpanel">
          <div className="form-group">
            <label>Email</label>
            <input type="email" onChange={setForm('email')} value={form.email} className="form-control" placeholder="Email" />
          </div>
          <div className="form-group">
            <label>Firstname</label>
            <input type="text" onChange={setForm('firstname')} value={form.firstname} className="form-control" placeholder="Firstname" />
          </div>
          <div className="form-group">
            <label>Lastname</label>
            <input type="text" onChange={setForm('lastname')} value={form.lastname} className="form-control" placeholder="Lastname" />
          </div>
          { ('role' in form) && <div className="form-group">
            <label>Role</label>
            <input type="text" onChange={setForm('role')} value={form.role} className="form-control" placeholder="Role" />
          </div>}
          {/*<div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" />
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input"  />
            <label>Check me out</label>
          </div>*/}
          <a onClick={this.save} className="btn btn-warning" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            Save
          </a>
        </div>


        {/* ----------------------
            TAB APIKEY
        -------------------------*/}

        <div className="tab-pane fade" id="tab-2" role="tabpanel">

          <div className="form-group">
            <label>Secret</label>
            <input type="text" readOnly className="form-control" value={user.apikeys[0]} />
          </div>

          <a onClick={this.save} className="btn btn-warning" href='javascript:'>
            <i className="fa fa-refresh fa-spin d-none" />
            Save
          </a>
        </div>

      </div>

 

    </div>)

  }

}
