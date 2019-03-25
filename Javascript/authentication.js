import axios from 'axios'
import { store } from '../index'
import { fetchAllBookings } from './bookings'
import { subscribeToClient } from '../pubnub'
import Cookies from 'universal-cookie'

const LOGIN_LOADING    = 'LOGIN_LOADING'
const LOGIN_SUCCEEDED  = 'LOGIN_SUCCEEDED'
const LOGIN_FAILED     = 'LOGIN_FAILED'

const cookies = new Cookies();

const LOGIN_URL = 'http://booking-api.merlin-dispatch.com/v1/authentication/login'
const PROFILE_URL = 'http://booking-api.merlin-dispatch.com/v1/profile'

export function authenticationHeaders(email = null, token = null) {
  if(email === null || token === null) {
    const user = store.getState().authentication.user
    email = user.email
    token = user.auth_token
  }

  return {
    'x-authentication-email': email,
    'x-authentication-token': token
  }
}

async function peformLoginRequest(email, password) {
  axios.post(LOGIN_URL, { email, password })
    .then(res => store.dispatch(loginSucceeded(res.data)))
    .catch(e => {
      if(e.response) {
        store.dispatch(loginFailed(e.response.data.errors))
      } else {
        store.dispatch(loginFailed([e.toString()]))
      }
    })
}

export function submitLoginCredentials(email, password) {
  peformLoginRequest(email, password)

  return {
    type: LOGIN_LOADING,
    payload: {}
  }
}

export function loginSucceeded(user) {
  cookies.set('email', user.email, {path: '/'});
  cookies.set('auth_token', user.auth_token, {path: '/'});

  // Dealy to allow store to update
  setTimeout(fetchAllBookings, 10);
  subscribeToClient(user.client.uuid);

  // Temp - Polling orders every 15 seconds
  setInterval(fetchAllBookings, 15000);

  return {
    type: LOGIN_SUCCEEDED,
    payload: user
  }
}

export function loginFailed(errors) {
  return {
    type: LOGIN_FAILED,
    payload: errors
  }
}

export function logout() {
  cookies.remove('email', {path: '/'});
  cookies.remove('auth_token', {path: '/'});

  return {
    type: LOGIN_FAILED,
    payload: []
  }
}

function loadFromCookies(){
  const email = cookies.get('email')
  const token = cookies.get('auth_token')

  if (email !== undefined && token !== undefined) {
    fetchProfile(email, token)
    return true
  } else {
    return false
  }
}

function fetchProfile(email, token) {
  axios({ method: 'GET', url: PROFILE_URL, headers: authenticationHeaders(email, token) })
    .then(res => store.dispatch(loginSucceeded(res.data)))
    .catch(e => store.dispatch(loginFailed([])))
}

const ACTION_HANDLERS = {
  [LOGIN_LOADING]   : (state, action) => ({ ...state, loading: true }),
  [LOGIN_SUCCEEDED] : (state, action) => ({ ...state, loading: false, loadingFromCookies: false, errors: [], user: action.payload }),
  [LOGIN_FAILED]    : (state, action) => ({ ...state, loading: false, loadFromCookies: false, errors: action.payload, user: null }),
}

const initialState = { user: null, errors: [], loading: false, loadingFromCookies: loadFromCookies()  }

export default function authenticationReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
