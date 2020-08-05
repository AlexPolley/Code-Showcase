import axios from 'axios'
import { store } from '../index'
import { authenticationHeaders } from './authentication'

export const PICKUP   = 'Task::Pickup::B2b'
export const DROPOFF  = 'Task::Dropoff::B2b'

const CREATE_BOOKING      = 'CREATE_BOOKING'
const UPDATE_BOOKING      = 'UPDATE_BOOKING'
const SET_ALL_BOOKINGS    = 'SET_ALL_BOOKINGS'

const ACTIVE_BOOKINGS_URL = '/v1/orders/active'
const QUOTE_URL           = '/v1/orders/quote'
const BOOKING_URL         = '/v1/orders'
const ROUTING_URL         = '/v1/directions'

export async function fetchQuote(booking, callback) {
  if(booking.tasks.length < 2) return;

  const headers = authenticationHeaders()
  const data    = { order: booking }

  axios({ method: 'POST', url: QUOTE_URL, headers, data })
    .then(res => callback(res.data.estimated_price))
    .catch(e => callback(null))
}

export async function createBooking(booking, callback) {
  const headers = authenticationHeaders()

  const successHandler = res => {
    alert("Booking Sucessfully Created");
    callback();
  }

  axios({ method: 'POST', url: BOOKING_URL, headers, data: { order: booking } })
    .then(successHandler)
    .catch((err) => alert(`Error: ${err.response.data.errors}`))
}

export function updateBooking(id, params) {
  return {
    type: UPDATE_BOOKING,
    payload: (id, params),
  }
}

export async function fetchRoute(booking, successHandler) {
  const coordinates = booking.tasks.map(t => [t.address.latitude, t.address.longitude]);
  const headers = authenticationHeaders();

  if(coordinates.length < 2) { return }

  axios({ method: 'POST', url: ROUTING_URL, data: { coordinates }, headers})
    .then(res => successHandler(res.data))
    .catch(err => console.warn('Error Fetching Route'))
}

function setAllBookings(bookings) {
  return {
    type: SET_ALL_BOOKINGS,
    payload: bookings,
  }
}

export async function fetchAllBookings() {
  const headers = authenticationHeaders()

  axios({ method: 'GET', url: ACTIVE_BOOKINGS_URL, headers })
    .then(res => store.dispatch(setAllBookings(res.data)))
    .catch(e => console.log("Error Fetching Bookings"))
}

const ACTION_HANDLERS = {
  [SET_ALL_BOOKINGS]   : (state, action) => ({ ...state, bookings: action.payload }),
  [UPDATE_BOOKING]     : (state, action) => ({ ...state, loading: false }),
  [CREATE_BOOKING]     : (state, action) => ({ ...state, loading: false }),
}

const initialState = {
  bookings: []
}

export default function authenticationReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
