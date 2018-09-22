import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };
    // add bind here if needed
  }

  handleSubmit = e => {
    e.preventDefault();

    const inputObject = {
      description: e.target[0].value,
      amount: e.target[1].value,
      frequency: e.target[2].value,
      startOrOccuranceDate: e.target[3].value,
      incomeOrExpense: e.target[4].checked
    };

    // TRUE MEANS IT'S INCOME!!!
    let incomeItemList = [];
    let expenseItemList = [];

    if (inputObject.incomeOrExpense) {
      incomeItemList = this.state.items.push(inputObject);
    } else {
      expenseItemList = this.state.items.push(inputObject);
    }
    // const updatedItemList = this.state.items.push(inputObject);
    this.setState((this.state.items: incomeItemList));
    console.log(inputObject.incomeOrExpense);
  };

  render() {
    return (
      <div>
        <h1 className="App-header App-title">Practical Balance Sheet</h1>
        <ItemTable items={this.state.items} />
        <InputBox handleSubmit={this.handleSubmit} />
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
    );
  }
}

class ItemRow extends React.Component {
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

// let ITEM = [
//   {
//     description: "salary",
//     amount: 50,
//     frequency: "bi-weekly",
//     startOrOccuranceDate: 2018
//   },
//   {
//     description: "side cash",
//     amount: 60,
//     frequency: "bi-weekly",
//     startOrOccuranceDate: 2018
//   }
// ];

//INPUT BOX START
class InputBox extends React.Component {
  render() {
    return (
      <form className="form" onSubmit={this.props.handleSubmit}>
        <input type="text" placeholder="Add description" />
        <input type="text" placeholder="Add amount" />
        <select name="frequency">
          <option value="One-time">One-time</option>
          <option value="Weekly">Weekly</option>
          <option value="Bi-weekly">Bi-weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Annually">Annually</option>
        </select>
        <input type="text" placeholder="Add start/occurance date" />
        <input name="incomeOrExpense" type="checkbox" checked={null} />
        <button type="submit">Add Item</button>
      </form>
    );
  }
}

//INPUT BOX END

ReactDOM.render(<App />, document.getElementById("root"));
