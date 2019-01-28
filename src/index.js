import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemTable from "./components/itemTable.js";
import AddItemBox from "./components/addItemBox.js";
import StartingBalanceBox from "./components/startingBalanceBox";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.drawLineGraph = this.drawLineGraph.bind(this);

    this.handleRemoveItem = this.handleRemoveItem.bind(this);

    this.state = {
      incomeItems: [],
      expenseItems: [],
      startBalance: {},
      graphPointsArray: [],
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Projected Balance",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
          }
        ]
      }
    };
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    this.drawLineGraph();
  }

  hydrateStateWithLocalStorage() {
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);

        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          this.setState({ [key]: value });
        }
      }
    }
  }

  drawLineGraph() {
    const chartData = () => {
      return {
        labels: this.state.graphPointsArray.map(x =>
          new Date(x.date).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Projected Balance",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.state.graphPointsArray.map(x => x.balance)
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

  // FUNCTION THAT WILL UPDATE graphPointsArray
  updateGraphPointsArray(array, amount, indexOfInputDate, interval) {
    if (interval === 0) {
      for (let i = 1; i < array.length; i++) {
        if (i >= indexOfInputDate) {
          array[i].balance += amount;
        }
      }
    } else {
      for (let i = 1; i < array.length; i++) {
        if (i >= indexOfInputDate) {
          array[i].balance +=
            amount * Math.ceil((i - indexOfInputDate + 1) / interval);
        }
      }
    }
    this.setState({ graphPointsArray: array });
    localStorage.setItem("graphPointsArray", JSON.stringify(array));
  }

  // FUNCITON THAT IDENTIFIES CORRECT INTERVALS
  intervalSeparator(inputObject, indexOfInputDate, x) {
    if (inputObject.frequency === "One-time") {
      this.updateGraphPointsArray(
        this.state.graphPointsArray,
        inputObject.amount * x,
        indexOfInputDate,
        0
      );
    } else if (inputObject.frequency === "Weekly") {
      this.updateGraphPointsArray(
        this.state.graphPointsArray,
        inputObject.amount * 2 * x,
        indexOfInputDate,
        1
      );
    } else if (inputObject.frequency === "Bi-weekly") {
      this.updateGraphPointsArray(
        this.state.graphPointsArray,
        inputObject.amount * x,
        indexOfInputDate,
        1
      );
    } else if (inputObject.frequency === "Monthly") {
      this.updateGraphPointsArray(
        this.state.graphPointsArray,
        Math.round(inputObject.amount * 0.94382) * x,
        indexOfInputDate,
        2
      );
    } else if (inputObject.frequency === "Annually") {
      this.updateGraphPointsArray(
        this.state.graphPointsArray,
        inputObject.amount * x,
        indexOfInputDate,
        26.2
      );
    }
  }

  // ADD ADDED ITEM INTO INCOME/EXPENSE TABLES AND CALL FUNCTION THAT UPDATES graphPointsArray
  handleSubmitItem = e => {
    e.preventDefault();

    let amount = e.target[1].value === "" ? 0 : parseInt(e.target[1].value, 10);

    const inputObject = {
      description: e.target[0].value,
      amount: amount,
      frequency: e.target[2].value,
      startOrOccuranceDate: e.target[3].value,
      incomeBubble: e.target[4].checked,
      expenseBubble: e.target[5].checked
    };

    let x = 1;
    if (inputObject.incomeBubble) {
      this.state.incomeItems.push(inputObject);
    } else if (inputObject.expenseBubble) {
      this.state.expenseItems.push(inputObject);
      x = -1;
    } // ADD THE SUBMITTED ITEM INTO INCOME OR EXPENSE ARRAY

    const expenseItems = [...this.state.expenseItems];
    const incomeItems = [...this.state.incomeItems];

    let indexOfInputDate = this.state.graphPointsArray.findIndex(
      x => x.date === this.roundToInterval(inputObject.startOrOccuranceDate)
    ); // ADD THE SUBMITTED ITEM TO graphPointsArray AT CORRECT INTERVALS

    this.intervalSeparator(inputObject, indexOfInputDate, x);

    localStorage.setItem("expenseItems", JSON.stringify(expenseItems));
    localStorage.setItem("incomeItems", JSON.stringify(incomeItems));
    e.target.reset();
  };

  // REMOVE ITEM FROM INCOME/EXPENSE TABLES
  handleRemoveItem(item) {
    const incomeItems = [...this.state.incomeItems];
    const expenseItems = [...this.state.expenseItems];

    const inputObject = {
      description: item.description,
      amount: item.amount,
      frequency: item.frequency,
      startOrOccuranceDate: item.startOrOccuranceDate,
      incomeBubble: item.incomeBubble,
      expenseBubble: item.expenseBubble
    };

    let indexOfInputDate = this.state.graphPointsArray.findIndex(
      x => x.date === this.roundToInterval(inputObject.startOrOccuranceDate)
    );

    if (item.incomeBubble) {
      let incomeItemsUpdated = incomeItems.filter(items => items !== item);
      this.setState({ incomeItems: incomeItemsUpdated });
      localStorage.setItem("incomeItems", JSON.stringify(incomeItemsUpdated));
    } else {
      let expenseItemsUpdated = expenseItems.filter(items => items !== item);
      this.setState({ expenseItems: expenseItemsUpdated });
      localStorage.setItem("expenseItems", JSON.stringify(expenseItemsUpdated));
    }

    let x = inputObject.incomeBubble ? 1 : -1;

    this.intervalSeparator(inputObject, indexOfInputDate, -x);
  }

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

    e.target.reset();
  };

  resetData = () => {
    localStorage.clear();
    this.setState({
      incomeItems: [],
      expenseItems: [],
      startBalance: {},
      graphPointsArray: [],
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Projected Balance",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
          }
        ]
      }
    });
  };

  render() {
    return (
      <div>
        <h1 className="App-header App-title">
          5-Year Account Balance Projection
        </h1>
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
        <button onClick={this.resetData}>Reset Data</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
