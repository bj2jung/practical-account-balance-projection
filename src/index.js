import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1 className="App-header App-title">Practical Balance Sheet</h1>
        <Items items={this.props.items} />
      </div>
    );
  }
}

class Items extends React.Component {
  render() {
    return (
      <div>
        {this.props.items.description}
        {this.props.items.amount}
        {this.props.items.occurance}
        {this.props.items.startOrOccuranceDate}
      </div>
    );
  }
}

let ITEM = {
  description: "salary",
  amount: 50,
  occurance: "bi-weekly",
  startOrOccuranceDate: 2018
};

ReactDOM.render(<App items={ITEM} />, document.getElementById("root"));
