import React from 'react'
import AddTaskRow from './AddTaskRow'
import TaskSummaryRow from './TaskSummaryRow'
import TaskForm from './TaskForm'
import { createBooking, fetchQuote, PICKUP, DROPOFF } from '../../redux/bookings'
import DateTimePicker from 'react-datetime-picker';
import './CreateBookingForm.css'

const INITIAL_BOOKING = { description: "", vehicle_type: "motorbike", service_type: "one_hour", tasks: null, start_at: (new Date) }

export default class CreateBookingForm extends React.Component {

  constructor() {
    super()

    this.state = { 
      booking: INITIAL_BOOKING,
      addPickup: false,
      addDropoff: false,
      scheduled: false,
    }
  }

  render() {    
    return <div className='CreateBookingForm'>
      { this.renderJobDetails() }
      { this.renderPickups() }
      { this.renderDropoffs() }
      { this.renderSubmit() }
      { this.state.quote ? this.renderQuoteAvailable() : this.renderQuoteUnavailable() }
    </div>
  }

  submit() {
    if(this.state.quote) {
      createBooking(this.state.booking, () => {
        this.setState({ booking: INITIAL_BOOKING, quote: null, scheduled: false })
        this.props.updateMap({...INITIAL_BOOKING, tasks: []})
      })
    } else {
      alert("Quote Unavailable - Please ensure your job has been input correctly")
    }
  }

  updateQuote = (quote) => this.setState({ quote })
  requestQuote = (booking) => fetchQuote(booking, this.updateQuote.bind(this))

  handleChange(event) {
    const booking = {...this.state.booking, [event.target.name]: event.target.value}
    this.setState({ booking })
    if(['vehicle_type', 'service_type'].includes(event.target.name)) this.requestQuote(booking)
  }

  saveTask(task) {
    let tasks = (this.state.booking.tasks || [])

    if(task.id) {
      let oldTask = tasks.find(t => t.id === task.id)
      tasks[tasks.indexOf(oldTask)] = task
    } else {
      task.id = Date.now() // Used as a unique reference locally
      tasks.push(task)
    }

    const booking ={ ...this.state.booking, tasks}

    this.setState({ booking, addPickup: false, addDropoff: false })
    this.requestQuote(booking)
    this.props.updateMap(booking)
  }

  renderQuoteAvailable() {
    return <div className="quote">
      <h2>£{this.state.quote}</h2>
      <p>Your booking is valid and our couriers are waiting on your request! Have a question? Speak to a member of our 
        customer services team now by <span onClick={() => window.Intercom('show')}>clicking here</span>!</p>
    </div>
  }

  renderQuoteUnavailable() {
    return <div className="quote">
      <h2>Quote Unavailable</h2>
      <p>Please ensure you have finshed inputing your job. Have a question? Speak to a member of our customer
        services team now by <span onClick={() => window.Intercom('show')}>clicking here</span>!</p>
    </div>
  }
  
  renderJobDetails() {
    const { vehicle_type, description, service_type } = this.state.booking

    return <div className="section">
      <h2>Job Details</h2>
      <div className="boxy JobDetails">
        <label>Job Reference *</label>
        <input type="text" name="description" value={description} onChange={this.handleChange.bind(this)} />
        
        <label>Vehicle Required</label>
        <select name="vehicle_type" onChange={this.handleChange.bind(this)} value={vehicle_type}>
          <option value="bicycle">Push Bike</option>
          <option value="motorbike">Motorbike</option>
          <option value="car">Car</option>
          <option value="small_van">Small Van</option>
          <option value="large_van">Large Van</option>
        </select>

        <label>Service Type</label>
        <select name="service_type" onChange={this.handleChange.bind(this)} value={service_type}>
          <option value="one_hour">One Hour</option>
          <option value="two_hours">Two Hours</option>
          <option value="three_hours">Three Hours</option>
          <option value="four_hours">Four Hours</option>
          <option value="sameday">Sameday</option>
        </select>

        { this.renderStartAt() }
      </div>
    </div>
  }

  renderStartAt() {    
    return <div>
      <label>Start Time</label>

      <div className="scheduled">
        <button onClick={this.toggleScheduled.bind(this)} className={this.state.scheduled ? null : 'active'}>Now</button>
        <button onClick={this.toggleScheduled.bind(this)} className={this.state.scheduled ? 'active' : null}>Later</button>
      </div>
    
      { this.state.scheduled ? <DateTimePicker onChange={this.onDateChange.bind(this)} value={this.state.booking.start_at} /> : null }
    </div>
  }

  onDateChange(start_at) {
    this.setState({booking: {...this.state.booking, start_at}})
  }

  toggleScheduled() {
    const scheduled = !this.state.scheduled
    const start_at = scheduled ? new Date : null
    this.setState({scheduled, start_at})
  }

  renderPickups() {
    const tasks = (this.state.booking.tasks || []).filter(t => t.type === PICKUP)

    const onAddClick = () => this.setState({addPickup: true})
    const onFormCancel = () => this.setState({addPickup: false})

    const newTaskForm = <TaskForm type={PICKUP} cancel={onFormCancel} save={this.saveTask.bind(this)} />
    const addTaskRow = <AddTaskRow type="Pickup" onClick={onAddClick.bind(this)} />

    const taskRows = tasks.map(task => {
      if(task.active) {
        const cancel = () => this.saveTask({...task, active: false})
        return <TaskForm task={task} cancel={cancel.bind(this)} save={this.saveTask.bind(this)} />
      } else {
        const edit = () => this.saveTask({...task, active: true})
        return <TaskSummaryRow key={task.id} task={task} edit={edit} />
      }
    })

    return <div className="section">
      <h2>Pickups</h2>
      <div>
        { taskRows }
        { this.state.addPickup ? newTaskForm : addTaskRow }
      </div>
    </div>
  }

  renderDropoffs() {
    const tasks = (this.state.booking.tasks || []).filter(t => t.type === DROPOFF)

    const onAddClick = () => this.setState({addDropoff: true})
    const onFormCancel = () => this.setState({addDropoff: false})

    const newTaskForm = <TaskForm type={DROPOFF} cancel={onFormCancel} save={this.saveTask.bind(this)} />
    const addTaskRow = <AddTaskRow type="Dropoff" onClick={onAddClick.bind(this)} />

    const taskRows = tasks.map(task => {
      if(task.active) {
        const cancel = () => this.saveTask({...task, active: false})
        return <TaskForm task={task} cancel={cancel.bind(this)} save={this.saveTask.bind(this)} />
      } else {
        const edit = () => this.saveTask({...task, active: true})
        return <TaskSummaryRow key={task.id} task={task} edit={edit} />
      }
    })

    return <div className="section">
      <h2>Dropoffs</h2>
      <div>
        { taskRows }
        { this.state.addDropoff ? newTaskForm : addTaskRow }
      </div>
    </div>
  }

  renderSubmit() {
    const valid = this.state.quote && (this.state.booking.description || "").length > 0

    return <div className="section">
      <div />
      <div className={`submit ${valid ? 'active' : 'inactive'}`} onClick={this.submit.bind(this)}>
        <h2>Submit Job</h2>
      </div>
    </div>
  }

}
