import React, { Component } from 'react';
import DateRangePicker from 'react-daterange-picker'
import Navigation from '../../shared/Navigation'
import { connect } from 'react-redux'
import BookingListRow from './BookingListRow'
import Map from '../../shared/Map/Map'
import './BookingListScene.css'
import 'react-daterange-picker/dist/css/react-calendar.css'

let defaultStartTime = new Date
defaultStartTime.setHours(0,0,0)

let defaultEndTime = new Date
defaultEndTime.setHours(23,59,59,999)

class BookingListScene extends Component {

  constructor() {
    super()
    this.state = { 
      current_booking_uuid: null, 
      query: '', 
      tab: 'active', 
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      displayDatePicker: false
    }
  }

  updateQuery = (query) => this.setState({query})
  updateCurrentBooking = (uuid) => this.setState({ current_booking_uuid: uuid })

  render() {
    const booking = this.props.bookings.find(b => b.uuid === this.state.current_booking_uuid)

    return(
      <div className='BookingListScene'>
        <Navigation />
        <div className='wrapper'>
          { this.renderSidebar() }
          <div className='map'>
            { booking ? <Map key={booking.uuid} booking={booking} /> : null }
          </div>
        </div>
      </div>
    )
  }

  renderSidebar() {
    const onActivePressed = () => this.setState({ tab: 'active' })
    const onQueryPressed = () => this.setState({ tab: 'query' })

    const bookings = this.state.tab === 'active' ? this.props.bookings : []

    return <div className='sidebar'>      
      <div className='tab'>
        <p className={this.state.tab === 'active' ? 'selected' : ''} onClick={onActivePressed.bind(this)} >Active</p>
        <p className={this.state.tab === 'query' ? 'selected' : ''} onClick={onQueryPressed.bind(this)}>Query</p>
      </div>

      { this.state.tab === 'query' ? this.renderDatePicker() : null }

      { bookings.map(this.renderBooking.bind(this)) }
    </div>
  }

  renderBooking(booking) {
    return <BookingListRow
              key={booking.uuid}
              booking={booking}
              active={booking.uuid === this.state.current_booking_uuid}
              updateCurrentBooking={this.updateCurrentBooking.bind(this)} />
  }

  renderDatePicker() {
    if(this.state.displayDatePicker) {
      return <DateRangePicker
              onSelect={this.onDateSelect.bind(this)}
              value={{start: this.state.start_time, end: this.state.end_time}}
              initialRange={{start: this.state.start_time, end: this.state.end_time}} />
    }

    let dateString = ''
    if(this.state.start_time === defaultStartTime && this.state.end_time === defaultEndTime) {
        dateString = 'Today'
    } else {
        dateString = `${this.state.start_time.toDateString()} - ${this.state.end_time.toDateString()}`
    }

    return <div className='filter'>
      <p>Date Range: </p>
      <div className="date-range" onClick={this.toggleDatePicker.bind(this)}>
        { dateString }
      </div>
    </div>
  }

  onDateSelect(dateRange) { 
    let end_time = dateRange.end._i
    end_time.setHours(23,59,59,999);

    this.setState({
        displayDatePicker: false,
        start_time: dateRange.start._i, 
        end_time
    })
  }

  toggleDatePicker() {
    this.setState({displayDatePicker: !this.state.displayDatePicker})
  }
}



const mapStateToProps = (state, ownProps) => {
  return {
    bookings: state.bookings.bookings
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingListScene)
