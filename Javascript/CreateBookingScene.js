import React, { Component } from 'react'
import Navigation from '../../shared/Navigation'
import './CreateBookingScene.css'
import CreateBookingForm from './CreateBookingForm'
import Map from '../../shared/Map/Map'

export default class CreateBookingScene extends Component {

  constructor() {
    super()
    this.state = { booking: { tasks: [] } }
  }

  updateBooking = (booking) => { this.setState({booking}) }

  render() {
    return <div className="CreateBookingScene">
      <Navigation />

      <div className='wrapper'>
        <CreateBookingForm
          updateMap={this.updateBooking} />

        <Map booking={this.state.booking} />
      </div>
    </div>
  }

}