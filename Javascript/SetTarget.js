import React, { Component } from "react";

class SetTarget extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", target: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch("http://192.168.1.9:3001/target", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ target: data.target });
      });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log(event);
    console.log(this.state.value);
    fetch("http://192.168.1.9:3001/target", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: this.state.value
      })
    }).then(response => {
      console.log(response);
      return response.json();
    });
  }

  render() {
    return (
      <div>
        <div style={{ textAlign: "center" }} className="tableText">
          <h1 style={{ fontSize: "60px", marginTop: 0, paddingTop: "40px" }}>
            Telesales target this month is:
          </h1>
          <p style={{ color: "#02D002", fontSize: "50px" }}>
            {this.state.target}
          </p>
        </div>
        <form
          style={{ textAlign: "center", paddingTop: "100px" }}
          onSubmit={this.handleSubmit}
        >
          <label style={{ fontSize: "30px", color: "white" }}>
            Enter New Target
          </label>
          <div>
            <input
              style={{ fontSize: "30px", margin: "30px" }}
              type="number"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input type="submit" value="Submit" className="submitButton" />
          </div>
        </form>
      </div>
    );
  }
}
export default SetTarget;
