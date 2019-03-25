import React, { Component } from 'react';
import './LoginScene.css'
import RicoLogo from '../../assets/logo.png'
import { submitLoginCredentials } from '../../redux/authentication'
import { store } from '../../index'
import { connect } from 'react-redux'

class LoginScene extends Component {

  constructor() {
    super()
    this.state = { email: '', password: '' }
  }

  render() {
    return(
      <div className='LoginScene'>
        <div className='wrapper'>
          <img src={RicoLogo} alt='Rico Sameday B2B' />
          <h1>Log in to Rico Sameday</h1>

          { this.props.errors.map(e => <p className='error'>{e}</p>) }

          <form>
            <input type='text' placeholder='Email' value={this.state.email} onChange={this.emailChanged.bind(this)} />
            <input type='password' placeholder='Password' value={this.state.password} onChange={this.passwordChanged.bind(this)} />
            <input type='submit' value='Log in' onClick={this.onSubmit.bind(this)} disabled={this.props.loading} />
          </form>

          <a href=''>Forgot Password?</a>
        </div>
      </div>
    )
  }

  emailChanged(input) { this.setState({'email': input.target.value}) }
  passwordChanged(input) { this.setState({'password': input.target.value}) }

  onSubmit() {
    const { email, password} = this.state
    store.dispatch(submitLoginCredentials(email, password))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      errors: state.authentication.errors,
      loading: state.authentication.loading,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScene)
