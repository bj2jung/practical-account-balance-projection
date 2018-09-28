import React from "react";
// import { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

/* 
week = 604800000 ms
bi-week = 1209600000 ms
year = 30758400000 ms
*/

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      incomeItems: [],
      expenseItems: [],
      startBalance: {},
      graphPointsArray: []
    };
  }

  // WHEN USER SUBMITS STARTINGBALANCE FORM, CREATE AN ARRAY WHICH WE WILL USE TO PLOT THE GRAPH
  createGraphPoints(startingDate, startingBalance) {
    let graphPointsArray = [{ date: startingDate, balance: startingBalance }];

    for (let i = 1; i < 128; i++) {
      graphPointsArray.push({
        date: startingDate + i * 1209600000,
        balance: graphPointsArray[i - 1].balance
      });
    }

    this.setState({ graphPointsArray: graphPointsArray });
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

  // FUNCTION THAT WILL UPDATE THE BALANCE GRAPH FOR "ONE-TIME" ITEMS
  updateGraphForOneTime(targetArray) {}

  // HANDLE SUBMISSION OF ITEM
  handleSubmit = e => {
    e.preventDefault();

    const inputObject = {
      description: e.target[0].value,
      amount: parseInt(e.target[1].value),
      frequency: e.target[2].value,
      startOrOccuranceDate: e.target[3].value,
      incomeOrExpense: e.target[4].checked
    };

    // ADD THE SUBMITTED ITEM INTO INCOME OR EXPENSE ARRAY
    if (inputObject.incomeOrExpense) {
      this.state.incomeItems.push(inputObject);
    } else {
      this.state.expenseItems.push(inputObject);
    }

    // ADD THE SUBMITTED ITEM TO balanceOverTimeArray AT CORRECT INTERVALS
    if (inputObject.frequency === "One-time") {
      const i = this.state.graphPointsArray.findIndex(
        x => x.date === this.roundToInterval(inputObject.startOrOccuranceDate)
      );
      this.state.graphPointsArray[i].balance += inputObject.amount;
    } else if (inputObject.frequency === "Weekly") {
    } else if (inputObject.frequency === "Bi-weekly") {
    } else if (inputObject.frequency === "Monthly") {
    } else if (inputObject.frequency === "Annually") {
    }

    this.setState((this.state.incomeItems, this.state.expenseItems));
  };

  // HANDLE SUBMISSION OF STARTINGBALANCE
  handleSubmitStartingBalance = e => {
    e.preventDefault();

    const startBalanceObject = {
      startingDate: e.target[0].value,
      startingBalance: parseInt(e.target[1].value)
    };

    // CREATE THE INITIAL ARRAY USING THE USER INPUT FROM "STARTING BALANCE" FORM
    this.createGraphPoints(
      Date.parse(startBalanceObject.startingDate),
      startBalanceObject.startingBalance
    );

    this.setState({
      startBalance: startBalanceObject
    });
  };

  render() {
    return (
      <div>
        <h1 className="App-header App-title">Practical Balance Sheet</h1>
        <ItemTable title="Income" items={this.state.incomeItems} />
        <ItemTable title="Expense" items={this.state.expenseItems} />
        <InputBox handleSubmit={this.handleSubmit} />
        <StartingBalanceBox
          handleSubmitStartingBalance={this.handleSubmitStartingBalance}
        />
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
        rows.push(<ItemRow item={item} key={item.description} />);
      });
    }

    return (
      <div>
        <h2>{this.props.title}</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Frequency</th>
              <th>Start/Occurance</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

class ItemRow extends React.Component {
  //   propTypes: {
  //     description: ReactProptypes.string.isRequired
  //   };

  render() {
    const description = this.props.item.description;
    const amount = this.props.item.amount;
    const frequency = this.props.item.frequency;
    const startOrOccuranceDate = this.props.item.startOrOccuranceDate;
    return (
      <tr>
        <td>{description}</td>
        <td>{amount}</td>
        <td>{frequency}</td>
        <td>{startOrOccuranceDate}</td>
      </tr>
    );
  }
}

//ITEM TABLE END

//INPUT BOX START
class InputBox extends React.Component {
  render() {
    return (
      <div>
        <form className="form" onSubmit={this.props.handleSubmit}>
          <h2>Add Item</h2>
          <input name="description" type="text" placeholder="Add description" />
          <input name="amount" type="text" placeholder="Add amount" />
          <select name="frequency">
            <option value="One-time">One-time</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Annually">Annually</option>
          </select>
          <input
            name="startOrOccuranceDate"
            type="text"
            placeholder="Add start/occurance date"
          />
          <input name="incomeOrExpense" type="checkbox" checked={null} />
          <button type="submit" disabled={null}>
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
  render() {
    return (
      <div>
        <form
          className="form"
          onSubmit={e => this.props.handleSubmitStartingBalance(e)}
        >
          <h2>Starting Balance</h2>
          <input name="startDate" type="text" placeholder="Start date" />
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
