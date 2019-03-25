import React, { Component } from 'react';
import './BookingListRow.css'

const humanizedStatuses = {
  'created': 'Created',
  'picking_up': 'Picking Up',
  'dropping_off': 'Dropping Off',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
}

const humanizedServiceTypes = {
  'one_hour': 'One Hour',
  'two_hours': 'Two Hours',
  'three_hours': 'Three Hours',
  'four_hours': 'Four Hours',
  'sameday': 'Sameday',
}

const humanizedVehicleTypes = {
  'bicycle': 'Bicycle',
  'motorbike': 'Motorbike',
  'car': 'Car',
  'small_van': 'Small Van',
  'large_van': 'Large Van'
}

export default class BookingListRow extends Component {

  render() {
    const {booking} = this.props

    const pickups = booking.tasks.map(t => t.type).filter(t => t.includes('Pickup')).length
    const dropoffs = booking.tasks.length - pickups

    const onClick = () => this.props.updateCurrentBooking(booking.uuid)

    return <div className='BookingListRow' onClick={onClick.bind(this)}>
      <p className='docket-number'>Docket #{booking.id}</p>

      <div className='data'>
        <div className='left'>
          <p><strong>Ref:</strong> {booking.description}</p>
          <p><strong>Start Time:</strong> {this.formatTime(booking.start_at)}</p>
          <p><strong>Pickups:</strong> {pickups}</p>
          <p><strong>Dropoffs:</strong> {dropoffs}</p>
        </div>

        <div className='right'>
          <p><strong>Status:</strong> {humanizedStatuses[booking.status]}</p>
          <p><strong>Service Type:</strong> {humanizedServiceTypes[booking.service_type]}</p>
          <p><strong>Vehicle Type:</strong> {humanizedVehicleTypes[booking.vehicle_type]}</p>
        </div>
      </div>
    </div>
  }

  formatAddress(address) {
    if(address === null || address === undefined) return null;

    const components = [address.line_1, address.line_2, address.postcode, address.city]
    const validComponents = components.filter(c => c !== null && c !== undefined && c.length > 0)

    return validComponents.join(', ')
  }

  formatTime = (str) => {
    const date = new Date(str)
    const time = date.toLocaleTimeString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true }) 
    return [date.toLocaleDateString(), time].join(' ')
  }

}
