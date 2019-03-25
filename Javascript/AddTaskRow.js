import React, { Component } from "react"
import AddIcon from "../../assets/add.png"
import "./AddTaskRow.css"

export default class AddTaskRow extends Component {
    render() {
        const title = `Add ${this.props.type}`

        return <div className="AddTaskRow boxy" onClick={this.props.onClick}>
            <img src={AddIcon} alt={title} />
            <p>{title}</p>
        </div>
    }
}