import React, { Component } from "react"
import postcodeLookup from "../../utilities/postcode"
import "./TaskForm.css"

const NEW_TASK = {
    address: {
        line_1: "",
        line_2: "",
        city: "",
        country: "United Kingdom",
        postcode: "",
    }, 
    recipient: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    },
    note: "",
}

export default class TaskForm extends Component {

    constructor(props) {
        super(props)
        const task = props.task || {...NEW_TASK, type: props.type }
        this.state = { task, addresses: [], addressIndex: null }
    }

    save = () => this.isValid() ? this.props.save({...this.state.task, active: false}) : alert("Please complete the form")
    cancel = () => this.props.cancel()
    
    updateAddresses = (addresses) => this.setState({ addresses })

    addressChanged(e) {
        const address = { ...this.state.task.address, [e.target.name]: e.target.value }
        this.setState({ task: {...this.state.task, address }})
    }

    recipientChanged(e) {
        const recipient = { ...this.state.task.recipient, [e.target.name]: e.target.value }
        this.setState({ task: {...this.state.task, recipient }})
    }

    postcodeChanged(e) {
        const address = { ...this.state.task.address, postcode: e.target.value.replace(" ", "") }
        this.setState({ task: {...this.state.task, address }, addresses: [] })
        postcodeLookup(e.target.value, this.updateAddresses.bind(this))
    }

    specialInstructionsChanged(e) {
        this.setState({ task: {...this.state.task, note: e.target.value} })
    }

    onAddressSelected(e) {
        const addressIndex = parseInt(e.target.value, 10)
        const address = this.state.addresses[addressIndex] || {}
        this.setState({ addressIndex, task: { ...this.state.task, address }})
    }

    isValid() {
        const { recipient } = this.state.task
        if(recipient.first_name === "") return false
        if(recipient.last_name === "") return false
        if(recipient.phone_number === "") return false
        if(this.state.addressIndex === null) return false

        return true 
    }

    render() {
        return <div className="TaskForm boxy">
            { this.renderRecipient() }
            { this.renderAddress() }
            { this.renderSpecialInstructions() }
            { this.renderActions() }
        </div>
    }

    renderRecipient() {
        const recipient = this.state.task.recipient

        return <div>
            <div className="row">
                <div className="left">
                    <label>First Name *</label>
                    <input type="text" value={recipient.first_name} name="first_name" onChange={this.recipientChanged.bind(this)} />
                </div>
                <div className="right">
                    <label>Last Name *</label>
                    <input type="text" value={recipient.last_name} name="last_name" onChange={this.recipientChanged.bind(this)} />
                </div>
            </div>

            <div className="row">
                <div className="left">
                    <label>Phone Number *</label>
                    <input type="text" value={recipient.phone_number} placeholder="+44 " name="phone_number" onChange={this.recipientChanged.bind(this)} />
                </div>
                <div className="right">
                    <label>Email</label>
                    <input type="text" value={recipient.email} name="email" onChange={this.recipientChanged.bind(this)} />
                </div>
            </div>
        </div>
    }

    renderAddress() {
        const address = this.state.task.address
        const humanizedAddresses = this.state.addresses.map(a => {
           return [a.line_1, a.line_2, a.city, a.postcode.toUpperCase()].filter(x => x.length > 0).join(", ")
        })

        const editFields = <div>
            <div className="row">
                <div className="left">
                    <label>Line 1 *</label>
                    <input type="text" value={address.line_1} name="line_1" onChange={this.addressChanged.bind(this)} />
                </div>
                <div className="right">
                    <label>Line 2</label>
                    <input type="text" value={address.line_2} name="line_2" onChange={this.addressChanged.bind(this)} />
                </div>   
            </div>
            <div className="row">
                <div className="left">
                    <label>City *</label>
                    <input type="text" value={address.city} name="city" onChange={this.addressChanged.bind(this)} />
                </div>
                <div className="right">
                    <label>Address Notes</label>
                    <input type="text" value={address.note} name="note" onChange={this.addressChanged.bind(this)} placeholder="e.g. Use the left entrace" />
                </div>   
            </div>
        </div>

        return <div>
            <div className="row address">
                <div className="left">
                    <label>Postcode *</label>
                    <input type="text" value={address.postcode} name="postcode" onChange={this.postcodeChanged.bind(this)} />
                </div>
                <div className="right">
                    <label>Address Lookup</label>
                    <select onChange={this.onAddressSelected.bind(this)} value={this.state.addressIndex !== null ? this.state.addressIndex : ""} >
                        <option>Select an address</option>
                        { humanizedAddresses.map((a, i) => <option value={i} key={i}>{a}</option>)}
                    </select>
                </div>
            </div>

            { this.state.addressIndex !== null ? editFields : null }
        </div>
    }

    renderSpecialInstructions() {
        return <div className="special-instructions">
            <label>Special Instructions</label>
            <input type="text" value={this.state.task.note} placeholder="e.g. Please only deliver to Dean" onChange={this.specialInstructionsChanged.bind(this)} />
        </div>
    }

    renderActions() {
        return <div className="actions">
            <div className={`button ${this.isValid() ? 'valid' : 'invalid'}`} onClick={this.save.bind(this)}>
                <p>Save</p>
            </div>

            <div className="button" onClick={this.cancel.bind(this)}>
                <p>Cancel</p>
            </div>
        </div>
    }

}