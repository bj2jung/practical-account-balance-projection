import React from "react";
// import { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
// import Chart from "./components/Chart.js";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "reactstrap";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.drawLineGraph = this.drawLineGraph.bind(this);

    this.state = {
      incomeItems: [],
      expenseItems: [],
      startBalance: {},
      graphPointsArray: [],
      chartData: {
        title: "Projected Balance Over 5 Years",
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["rgba(255, 99, 132, 0.6)"]
          }
        ]
      }
    };
  }

  drawLineGraph() {
    const chartData = () => {
      return {
        labels: this.state.graphPointsArray.map(x =>
          new Date(x.date).toLocaleDateString()
        ),
        datasets: [
          {
            data: this.state.graphPointsArray.map(x => x.balance),
            backgroundColor: ["rgba(255, 99, 132, 0.6)"]
          }
        ]
      };
    };

    this.setState({ chartData });
  }

  // WHEN USER SUBMITS STARTINGBALANCE OR ITEM VIA FORM, CREATE AN ARRAY WHICH WE WILL USE TO PLOT THE GRAPH
  createGraphPoints(startingDate, startingBalance) {
    let startingGraphPointsArray = [
      { date: startingDate, balance: startingBalance }
    ];

    for (let i = 1; i < 128; i++) {
      startingGraphPointsArray.push({
        date: startingDate + i * 1209600000,
        balance: startingGraphPointsArray[i - 1].balance
      });
    }
    this.setState({ graphPointsArray: startingGraphPointsArray });
  }

  // FUNCTION THAT WILL ROUND THE INPUT TIME TO THE NEAREST INTERVAL SET BY createGraphPoints()
  roundToInterval(startOrOccuranceDate) {
    const startBalanceDate = Date.parse(this.state.startBalance.startingDate);
    return (
      Math.round(Date.parse(startOrOccuranceDate) / 1209600000) * 1209600000 -
      (Math.round(startBalanceDate / 1209600000) * 1209600000 -
        startBalanceDate)
    );
  }

  //FUNCTION THAT WILL UPDATE GRAPH
  updateGraphForOneTimeItems(array, amount, indexOfInputDate) {
    for (let i = 1; i < array.length; i++) {
      if (i >= indexOfInputDate) {
        array[i].balance += amount;
      }
    }
    this.setState({ graphPointsArray: array });
  }

  //FUNCTION THAT WILL UPDATE GRAPH FOR RECURRING ITEMS
  updateGraphForRecurringItems(array, amount, indexOfInputDate, interval) {
    for (let i = 1; i < array.length; i++) {
      if (i >= indexOfInputDate) {
        array[i].balance +=
          amount * Math.ceil((i - indexOfInputDate + 1) / interval);
      }
    }
    this.setState({ graphPointsArray: array });
  }

  // HANDLE SUBMISSION OF ITEM
  handleSubmitItem = e => {
    e.preventDefault();

    let amount = e.target[1].value === "" ? 0 : parseInt(e.target[1].value, 10);

    const inputObject = {
      description: e.target[0].value,
      amount: amount,
      frequency: e.target[2].value,
      startOrOccuranceDate: e.target[3].value,
      incomeOrExpense: e.target[4].checked
    };

    let x = 1;
    // ADD THE SUBMITTED ITEM INTO INCOME OR EXPENSE ARRAY
    if (inputObject.incomeOrExpense) {
      this.state.incomeItems.push(inputObject);
    } else {
      this.state.expenseItems.push(inputObject);
      x = -1;
    }

    // ADD THE SUBMITTED ITEM TO graphPointsArray AT CORRECT INTERVALS
    let indexOfInputDate = this.state.graphPointsArray.findIndex(
      x => x.date === this.roundToInterval(inputObject.startOrOccuranceDate)
    );

    if (inputObject.frequency === "One-time") {
      this.updateGraphForOneTimeItems(
        this.state.graphPointsArray,
        inputObject.amount * x,
        indexOfInputDate
      );
    } else if (inputObject.frequency === "Weekly") {
      this.updateGraphForRecurringItems(
        this.state.graphPointsArray,
        inputObject.amount * 2 * x,
        indexOfInputDate,
        1
      );
    } else if (inputObject.frequency === "Bi-weekly") {
      this.updateGraphForRecurringItems(
        this.state.graphPointsArray,
        inputObject.amount * x,
        indexOfInputDate,
        1
      );
    } else if (inputObject.frequency === "Monthly") {
      this.updateGraphForRecurringItems(
        this.state.graphPointsArray,
        Math.round(inputObject.amount * 0.94382) * x,
        indexOfInputDate,
        2
      );
    } else if (inputObject.frequency === "Annually") {
      this.updateGraphForRecurringItems(
        this.state.graphPointsArray,
        inputObject.amount * x,
        indexOfInputDate,
        26.2
      );
    }
  };

  // REMOVE ITEM FROM INCOME/EXPENSE TABLES
  handleRemoveItem = e => {
    e.preventDefault();

    // this.state.incomeItems = this.state.incomeItems.splice(0, 1);

    // console.log(this.state.incomeItems);
    // console.log(this.state.expenseItems);

    this.setState({ incomeItems: this.state.incomeItems });
  };

  // HANDLE SUBMISSION OF STARTINGBALANCE
  handleSubmitStartingBalance = e => {
    e.preventDefault();

    let balance =
      e.target[1].value === "" ? 0 : parseInt(e.target[1].value, 10);

    const startBalanceObject = {
      startingDate: e.target[0].value,
      startingBalance: balance
    };

    // CREATE THE INITIAL ARRAY USING THE USER INPUT FROM "STARTING BALANCE" FORM
    this.createGraphPoints(
      Date.parse(startBalanceObject.startingDate),
      startBalanceObject.startingBalance
    );

    this.setState({
      startBalance: startBalanceObject
    });

    this.drawLineGraph();
  };

  render() {
    return (
      <div>
        <h1 className="App-header App-title">Practical Balance Sheet</h1>
        <div className="container">
          <Line data={this.state.chartData} />
        </div>
        <div className="row">
          <ItemTable
            title="Income"
            items={this.state.incomeItems}
            handleRemoveItem={this.handleRemoveItem}
          />

          <ItemTable
            title="Expense"
            items={this.state.expenseItems}
            handleRemoveItem={this.handleRemoveItem}
          />
        </div>
        <div className="row">
          <AddItemBox handleSubmitItem={this.handleSubmitItem} />
          <StartingBalanceBox
            handleSubmitStartingBalance={this.handleSubmitStartingBalance}
          />
        </div>
      </div>
    );
  }
}

// ITEM TABLE START

class ItemTable extends React.Component {
  render() {
    const rows = [];

    if (this.props.items.length > 0) {
      this.props.items.forEach(item => {
        rows.push(
          <ItemRow
            item={item}
            key={item.description}
            handleRemoveItem={this.props.handleRemoveItem}
          />
        );
      });
    }

    return (
      <div className="col-lg-6">
        <h2 className="sub-header">{this.props.title}</h2>
        <div className="border">
          <Table striped>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Start/Occurance</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

class ItemRow extends React.Component {
  render() {
    const description = this.props.item.description;
    const amount = this.props.item.amount;
    const frequency = this.props.item.frequency;
    const startOrOccuranceDate = this.props.item.startOrOccuranceDate;
    // const key = this.props.key;
    return (
      <tr>
        <td className="column1">{description}</td>
        <td className="column2">{amount}</td>
        <td className="column3">{frequency}</td>
        <td className="column4">{startOrOccuranceDate}</td>
        <td className="column5">
          <button onClick={this.props.handleRemoveItem} /*id={key}*/>
            Delete Item
          </button>
        </td>
      </tr>
    );
  }
}

//ITEM TABLE END

//INPUT BOX START
class AddItemBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
  render() {
    return (
      <div className="col-lg-6">
        <h2 className="sub-header">Add Item</h2>
        <form
          className="form-group border"
          onSubmit={this.props.handleSubmitItem}
        >
          <input
            className="col-lg-2"
            name="description"
            type="text"
            placeholder="Add description"
          />
          <input
            className="col-lg-2"
            name="amount"
            type="text"
            placeholder="Add amount"
          />
          <select className="col-lg-2" name="frequency">
            <option value="One-time">One-time</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Annually">Annually</option>
          </select>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <input name="incomeOrExpense" type="checkbox" checked={null} />
          <button className="col-lg-2" type="submit" disabled={null}>
            Add Item
          </button>
        </form>
      </div>
    );
  }
}

//INPUT BOX END

// STARTING BALANCE BOX START
class StartingBalanceBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  render() {
    return (
      <div className="col-lg-6">
        <h2 className="sub-header">Starting Balance</h2>
        <form
          className="form-group border"
          onSubmit={e => this.props.handleSubmitStartingBalance(e)}
        >
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <input name="balance" type="text" placeholder="Starting balance" />
          <button type="submit" disabled={null}>
            Update
          </button>
        </form>
      </div>
    );
  }
}

// STARTING BALANCE BOX END

ReactDOM.render(<App />, document.getElementById("root"));
