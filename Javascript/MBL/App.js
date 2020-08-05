import React, { Component } from "react";

import MonthSales from "./Components/MonthSales";
import SetTarget from "./Components/SetTarget";
import MBSecureMonth from "./Components/MBSecure/MBSecureMonth";
import MBSecureSetTarget from "./Components/MBSecure/MBSecureSetTarget";

import PersonalHomeStats from "./Components/Telesales/PersonalHomeStats";
import PersonalStats from "./Components/Telesales/PersonalStats";
import OtherStats from "./Components/Telesales/OtherStats";
import Marketing from "./Components/Telesales/Marketing";

import MBSecurePersonalHomeStats from "./Components/MBSecure/MBSecurePersonalHomeStats";
import MBSecurePersonalStats from "./Components/MBSecure/MBSecurePersonalStats";
import MBSecureOtherStats from "./Components/MBSecure/MBSecureOtherStats";
import MBSecureMarketing from "./Components/MBSecure/MBSecureMarketing";

import { BrowserRouter, Route } from "react-router-dom";
import "./animate.css";
import "./style.css";

const moment = require("moment");

class App extends Component {
  constructor() {
    super();
    this.state = {
      homeInsurance: false,
      personalStats: false,
      otherStats: false,
      monthlySales: false,
      marketingSales: true,
      time: 20000
    };
  }

  componentWillMount() {
    this.displayTime();
    this.update();
  }

  displayTime() {
    if (this.state.homeInsurance === true) {
      this.setState({ homeInsurance: false, personalStats: true, time: 30000 });
    } else if (this.state.personalStats === true) {
      this.setState({
        personalStats: false,
        otherStats: true,
        time: 30000
      });
    } else if (this.state.otherStats === true) {
      this.setState({
        otherStats: false,
        marketingSales: true,
        time: 30000
      });
    } else if (this.state.monthlySales === true) {
      this.setState({ monthlySales: false, homeInsurance: true, time: 30000 });
    } else if (this.state.marketingSales === true) {
      this.setState({ marketingSales: false, monthlySales: true, time: 10000 });
    }
  }

  update() {
    setTimeout(() => {
      this.componentWillMount();
    }, this.state.time);
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={MonthSales} />
          <Route path="/settarget" exact component={SetTarget} />
          <Route
            path="/mbsecure/settarget"
            exact
            component={MBSecureSetTarget}
          />
          <Route path="/stats" component={PersonalStats} />

          <Route
            path="/telesales"
            exact
            render={() => (
              <section style={{ height: "100%" }}>
                <div
                  style={
                    this.state.monthlySales
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                  className="monthBackground"
                >
                  <MonthSales />
                </div>

                <div
                  style={
                    this.state.personalStats
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                >
                  <PersonalStats />
                </div>

                <div
                  style={
                    this.state.otherStats
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                >
                  <OtherStats />
                </div>

                <div
                  style={
                    this.state.homeInsurance
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                  className="homeBackground"
                >
                  <PersonalHomeStats />
                </div>
                <div
                  style={
                    this.state.marketingSales
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                  className="marketingBackground"
                >
                  <Marketing />
                </div>
              </section>
            )}
          />

          <Route
            path="/mbsecure"
            exact
            render={() => (
              <section style={{ height: "100%" }}>
                <div
                  style={
                    this.state.monthlySales
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                  className="monthBackground"
                >
                  <MBSecureMonth />
                </div>

                <div
                  style={
                    this.state.personalStats
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                >
                  <MBSecurePersonalStats />
                </div>

                <div
                  style={
                    this.state.otherStats
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                >
                  <MBSecureOtherStats />
                </div>

                <div
                  style={
                    this.state.homeInsurance
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                  className="homeBackground"
                >
                  <MBSecurePersonalHomeStats />
                </div>
                <div
                  style={
                    this.state.marketingSales
                      ? { height: "100%" }
                      : { display: "none" }
                  }
                  className="marketingBackground"
                >
                  <MBSecureMarketing />
                </div>
              </section>
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
