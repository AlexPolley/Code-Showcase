import React, { Component } from "react"
import PhoneIcon from "../../assets/phone.png"
import EmailIcon from "../../assets/email.png"
import ClockIcon from "../../assets/clock.png"
import PencilIcon from "../../assets/pencil.png"
import "./TaskSummaryRow.css"

export default class TaskSummaryRow extends Component {
    render() {
        const { address, recipient } = this.props.task

        const addressLabel = [address.line_1, address.line_2, address.city, address.postcode].filter(a => a !== "").join(", ")
        const recipientLabel = [recipient.first_name, recipient.last_name].filter(a => a !== "").join(" ")

        return <div className="TaskSummaryRow boxy" onClick={this.props.onClick}>
            <div className="left">
                <div className="top">
                    <p>{recipientLabel} - {addressLabel}</p>
                </div>

                <div className="bottom">
                    <img src={PhoneIcon} alt="Phone Number" />
                    <p>{recipient.phone_number}</p>
                    
                    <img src={EmailIcon} alt="Email" />
                    <p>{recipient.email}</p>

                    <img src={ClockIcon} alt="Scheduled" />
                    <p>ASAP</p>
                </div>
            </div>

            <div className="right" onClick={this.props.edit}>
                <img src={PencilIcon} alt="Edit" />
            </div>
        </div>
    }
}