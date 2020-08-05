import React, { Component } from "react";

const moment = require("moment");

class PersonalStats extends Component {
  constructor() {
    super();
    this.state = {
      persons: [],
      persons1: [],
      persons2: [],
      totalSales: 0,
      own: 0,
      transfer: 0,
      out: 0,
      totalOutHours: 0,
      totalHours: 0,
      showing1: true
    };

    setInterval(() => {
      this.setState({ showing1: !this.state.showing1 });
    }, 10000);
  }

  componentWillMount() {
    fetch("http://192.168.1.9:3001/day")
      // fetch("http://192.168.1.18:3001/mbsecure-day")
      //fetch("/day")
      .then(results => {
        return results.json();
      })
      .then(data => {
        let number = 0;
        let totalSales = 0;
        let own = 0;
        let transfer = 0;
        let out = 0;
        let totalOutHour = 0;
        let totalOutMin = 0;
        let totalHour = 0;
        let totalMin = 0;
        let numberClass = "";
        //maping records
        let persons = data.recordset.map(data => {
          number = number + 1;

          if (number % 2 === 0) {
            numberClass = "yes numberClass";
          } else {
            numberClass = "no numberClass";
          }

          totalSales = totalSales + data.TotalSales;
          own = own + data.OwnSales;
          transfer = transfer + data.TransferSales;
          out = out + moment(data.OutboundCallTime).format("HH:mm");

          //total out time
          totalOutHour +=
            parseFloat(moment(data.OutboundCallTime).format("HH"), 10) - 1;
          totalOutMin += parseFloat(
            moment(data.OutboundCallTime).format("mm"),
            10
          );

          console.log(
            `${data.Agent} = ${parseFloat(
              moment(data.TotalCallTime).format("HH"),
              10
            ) - 1} ${parseFloat(
              moment(data.TotalCallTime).format("mm"),
              10
            )} and time is from moment ${moment
              .parseZone(data.TotalCallTime)
              .format("HH:mm")} and hour is ${moment(data.TotalCallTime).format(
              "HH"
            )}`
          );

          if (totalOutMin >= 60) {
            totalOutHour += 1;
            totalOutMin -= 60;
          }
          //total time
          totalHour +=
            parseFloat(moment(data.TotalCallTime).format("HH"), 10) - 1;
          totalMin += parseFloat(moment(data.TotalCallTime).format("mm"), 10);
          if (totalMin >= 60) {
            totalHour += 1;
            totalMin -= 60;
          }

          let outTimeInMinutes =
            parseFloat(
              moment.parseZone(data.OutboundCallTime).format("HH"),
              10
            ) *
              60 +
            parseFloat(moment(data.OutboundCallTime).format("mm"), 10);
          let totalTimeInMinutes =
            parseFloat(moment.parseZone(data.TotalCallTime).format("HH"), 10) *
              60 +
            parseFloat(moment(data.TotalCallTime).format("mm"), 10);
          console.log(`total out times = ${totalHour} : ${totalMin}`);
          return (
            <tr key={data.Agent} className={numberClass}>
              <td className="tableNumbers">{number}</td>
              <td className="tableText">
                {data.Agent.replace(".", " ")
                  .replace("-", " ")
                  .replace(/(^|\s)[a-z]/g, function(f) {
                    return f.toUpperCase();
                  })}
              </td>
              <td className="tableLine">{data.TotalSales}</td>
              <td
                className={data.OwnSales > 9 ? "tableLine green" : "tableLine"}
              >
                {data.OwnSales}
              </td>
              <td
                className={
                  data.TransferSales > 9 ? "tableLine green" : "tableLine"
                }
              >
                {data.TransferSales}
              </td>
              <td
                className={
                  outTimeInMinutes >= 150 ? "tableLine green" : "tableLine"
                }
              >
                {moment.parseZone(data.OutboundCallTime).format("HH:mm")}
              </td>
              <td
                className={
                  totalTimeInMinutes >= 210 ? "tableLine green" : "tableLine"
                }
              >
                {moment.parseZone(data.TotalCallTime).format("HH:mm")}
              </td>
            </tr>
          );
        });
        //assign values to states
        let persons1 = [];
        let persons2 = [];

        if (persons.length >= 10) {
          let num = Math.round(persons.length / 2);
          persons1 = persons.slice(0, num);
          persons2 = persons.slice(num);
        }

        totalMin < 10 ? (totalMin = "0" + totalMin) : "";
        totalOutMin < 10 ? (totalOutMin = "0" + totalOutMin) : "";
        totalHour < 10 ? (totalHour = "0" + totalHour) : "";
        totalOutHour < 10 ? (totalOutHour = "0" + totalOutHour) : "";

        this.setState({
          persons: persons,
          persons1: persons1,
          persons2: persons2,
          totalSales: totalSales,
          own: own,
          transfer: transfer,
          out: out,
          totalOutHours: totalOutHour + ":" + totalOutMin,
          totalHours: totalHour + ":" + totalMin
        });
      });

    this.update();
  }

  update = () => {
    setTimeout(() => {
      this.componentWillMount();
    }, 60000);
  };

  render() {
    const carousel = () => {
      if (this.state.persons.length < 10) {
        return this.state.persons;
      } else {
        return this.state.showing1 ? this.state.persons1 : this.state.persons2;
      }
    };

    return (
      <div style={{ height: "100%" }}>
        <table>
          <thead>
            <tr>
              <th colSpan="2"></th>
              <th colSpan="3" className="personalStatsText">
                Mobility Sales
              </th>
              <th colSpan="2" className="personalStatsText">
                Call Time
              </th>
            </tr>
            <tr className="borderDownP">
              <th
                width="5%"
                className="tableLine"
                style={{ paddingBottom: "15px" }}
              ></th>
              <th
                width="25%"
                className="tableText"
                style={{ paddingBottom: "15px" }}
              >
                Agent
              </th>
              <th
                width="10%"
                className="tableText"
                style={{ paddingBottom: "15px" }}
              >
                Total
              </th>
              <th
                width="10%"
                className="tableText"
                style={{ paddingBottom: "15px" }}
              >
                Own
              </th>
              <th
                width="10%"
                className="tableText"
                style={{ paddingBottom: "15px" }}
              >
                Transfer
              </th>
              <th
                width="20%"
                className="tableText"
                style={{ paddingBottom: "15px" }}
              >
                Out
              </th>
              <th
                width="20%"
                className="tableText"
                style={{ paddingBottom: "15px" }}
              >
                Total
              </th>
            </tr>
            <tr></tr>
          </thead>
          <tbody>
            {carousel()}

            <tr className="borderUpP">
              <th></th>
              <th className="tableLine">Total: </th>
              <th className="tableLine">{this.state.totalSales}</th>
              <th
                className={
                  this.state.own >= 50 ? "tableLine green" : "tableLine"
                }
              >
                {this.state.own}
              </th>
              <th
                className={
                  this.state.transfer >= 50 ? "tableLine green" : "tableLine"
                }
              >
                {this.state.transfer}
              </th>
              <th className="tableLine">{this.state.totalOutHours}</th>
              <th className="tableLine">{this.state.totalHours}</th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default PersonalStats;
