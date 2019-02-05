import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Line, Doughnut } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemTable from "./components/itemTable.js";
// import AddItemBox from "./components/addItemBox.js"; //won't need
import StartingBalanceBox from "./components/startingBalanceBox";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.changeChartPeriod = this.changeChartPeriod.bind(this);
    this.handleSubmitItem = this.handleSubmitItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this); //TODO: revisit

    this.state = {
      incomeItems: [],
      expenseItems: [],
      startBalance: { startingDate: new Date(), startingBalance: 0 },
      arrayOfAllItems: [],
      accountBalanceArray: [],
      accumulatedIncomeArray: [],
      accumulatedExpenseArray: [],
      chartPeriod: 27,
      incomeTotal: 0,
      expenseTotal: 0
    };
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    const storedState = JSON.parse(localStorage.getItem("state"));

    for (let key in storedState) {
      let value = storedState[key];
      this.setState({ [key]: value });
    }
  }

  updatePieChartInfo() {
    const incomeChartLabels = [];
    const incomeChartData = [];
    const expenseChartLabels = [];
    const expenseChartData = [];
    const arrayOfAllItems = this.state.arrayOfAllItems;
    const accountBalanceArray = this.state.accountBalanceArray;
    const colors = [
      "#ff6384",
      "#ff9f40",
      "#ffcd56",
      "#4bc0c0",
      "#36a2eb",
      "#ff6384",
      "#ff9f40",
      "#ffcd56",
      "#4bc0c0",
      "#36a2eb",
      "#ff6384",
      "#ff9f40",
      "#ffcd56",
      "#4bc0c0",
      "#36a2eb",
      "#ff6384",
      "#ff9f40",
      "#ffcd56",
      "#4bc0c0",
      "#36a2eb"
    ];

    arrayOfAllItems.forEach(item => {
      let arr = this.handleItem(item, accountBalanceArray);
      let accumulatedTotal = arr[this.state.chartPeriod - 1];

      if (accumulatedTotal > 0) {
        incomeChartLabels.push(item.description);
        incomeChartData.push(accumulatedTotal);
      } else if (0 > accumulatedTotal) {
        expenseChartLabels.push(item.description);
        expenseChartData.push(-accumulatedTotal);
      }
    });

    return {
      incomePieChartData: {
        labels: incomeChartLabels,
        datasets: [
          {
            data: incomeChartData,
            backgroundColor: colors
          }
        ]
      },
      expensePieChartData: {
        labels: expenseChartLabels,
        datasets: [
          {
            data: expenseChartData,
            backgroundColor: colors
          }
        ]
      }
    };
  }

  calculateTotals(incomeChartData, expenseChartData) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    this.setState({
      incomeTotal: incomeChartData.reduce(reducer, 0),
      expenseTotal: expenseChartData.reduce(reducer, 0)
    });
  }

  changeChartPeriod(e) {
    this.setState({ chartPeriod: Number(e.target.value) }, () => {
      this.updateLineChartArrays();
    });
  }

  createLineChartData() {
    const lineChartData = this.state.accountBalanceArray.map(x => x.balance);
    const lineChartLabels = this.state.accountBalanceArray.map(x =>
      new Date(x.date).toLocaleDateString()
    );
    return {
      labels: lineChartLabels,
      datasets: [
        {
          label: "Balance",
          fill: false,
          lineTension: 0.3,
          backgroundColor: "rgba(255,61,61,0.4)",
          borderColor: "rgba(255,61,61,.8)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(255,61,61,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255,61,61,1)",
          pointHoverBorderColor: "rgba(255,61,61,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: lineChartData
        },
        {
          label: "Accumulated Income",
          fill: "origin",
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
          pointHoverBorderColor: "rgba(75,192,192,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.accumulatedIncomeArray
        },
        {
          label: "Accumulated Expense",
          fill: "origin",
          lineTension: 0.1,
          backgroundColor: "rgba(244,191,66,0.4)",
          borderColor: "rgba(244,191,66,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(244,191,66,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(244,191,66,1)",
          pointHoverBorderColor: "rgba(244,191,66,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.accumulatedExpenseArray
        }
      ]
    };
  }

  // FUNCTION THAT CREATES AN ARRAY OF GRAPH POINTS, USING arrayOfAllItems & startBalance states
  updateLineChartArrays() {
    const arrayOfAllItems = this.state.arrayOfAllItems;
    const startBalance = this.state.startBalance;

    const accountBalanceArray = [
      {
        date: Date.parse(startBalance.startingDate),
        balance: startBalance.startingBalance
      }
    ];

    for (let i = 1; i < this.state.chartPeriod; i++) {
      accountBalanceArray.push({
        date: accountBalanceArray[0].date + i * 1209600000,
        balance: accountBalanceArray[i - 1].balance
      });
    }

    const accumulatedIncomeArray = new Array(this.state.chartPeriod).fill(0);
    const accumulatedExpenseArray = new Array(this.state.chartPeriod).fill(0);

    arrayOfAllItems.forEach(item => {
      let arr = this.handleItem(item, accountBalanceArray);
      for (let i = 0; i < this.state.chartPeriod; i++) {
        accountBalanceArray[i].balance += arr[i];
        item.incomeOrExpense === "Income"
          ? (accumulatedIncomeArray[i] += arr[i])
          : (accumulatedExpenseArray[i] += arr[i]);
      }
    });

    this.setState(
      {
        accountBalanceArray: accountBalanceArray,
        accumulatedIncomeArray: accumulatedIncomeArray,
        accumulatedExpenseArray: accumulatedExpenseArray
      },
      () => {
        this.updatePieChartInfo();
        localStorage.setItem("state", JSON.stringify(this.state));
      }
    );
  }

  // FUNCTION THAT DETERMINES HOW TO UPDATE accountBalanceArray FOR A SINGLE ITEM
  handleItem(item, accountBalanceArray) {
    let interval;
    let amount;
    let incomeOrExpense = item.incomeOrExpense === "Income" ? 1 : -1;

    let startDateIndex = accountBalanceArray.findIndex(
      i => i.date === this.roundToInterval(item.startOrOccuranceDate)
    );

    if (startDateIndex < 0) {
      startDateIndex = this.state.chartPeriod;
    }

    let endDateIndex = accountBalanceArray.findIndex(
      i => i.date === this.roundToInterval(item.endDate)
    );

    if (item.endDateExists) {
      endDateIndex =
        endDateIndex === -1 ? this.state.chartPeriod - 1 : endDateIndex;
    } else {
      endDateIndex = this.state.chartPeriod - 1;
    }

    // const endDateIndex = item.endDateExists
    //   ? accountBalanceArray.findIndex(
    //       i => i.date === this.roundToInterval(item.endDate)
    //     )
    //   : this.state.chartPeriod;

    if (item.frequency === "One-time") {
      interval = 0;
      amount = item.amount;
    } else if (item.frequency === "Weekly") {
      interval = 1;
      amount = item.amount * 2;
    } else if (item.frequency === "Bi-weekly") {
      interval = 1;
      amount = item.amount;
    } else if (item.frequency === "Monthly") {
      interval = 2;
      amount = Math.round(item.amount * 0.94382);
    } else if (item.frequency === "Annually") {
      interval = 26;
      amount = item.amount;
    }

    return this.createArray(
      interval,
      amount,
      incomeOrExpense,
      startDateIndex,
      endDateIndex
    );
  }

  //FUNCTION THAT CREATES AN ARRAY TO BE USED TO UPDATE accountBalanceArray USING PARAMETERS SET IN handleItem
  createArray(interval, amount, incomeOrExpense, startDateIndex, endDateIndex) {
    const arr = [];
    if (interval === 0) {
      for (let i = 0; i < this.state.chartPeriod; i++) {
        startDateIndex <= i
          ? (arr[i] = amount * incomeOrExpense)
          : (arr[i] = 0);
      }
    } else if (interval === 1) {
      for (let i = 0; i < this.state.chartPeriod; i++) {
        if (i <= startDateIndex) {
          arr[i] = 0;
        } else if (startDateIndex <= i && i <= endDateIndex) {
          arr[i] = amount * (i - startDateIndex + 1) * incomeOrExpense;
        } else if (endDateIndex < i) {
          arr[i] = arr[endDateIndex];
        }
      }
    } else {
      for (let i = 0; i < this.state.chartPeriod; i++) {
        if (i < startDateIndex) {
          arr[i] = 0;
        } else if (startDateIndex <= i && i <= endDateIndex) {
          arr[i] =
            Math.ceil((i + 1 - startDateIndex) / interval) *
            amount *
            incomeOrExpense;
        } else if (endDateIndex < i) {
          arr[i] = arr[endDateIndex];
        }
      }
    }
    return arr;
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

  // ADD ADDED ITEM INTO INCOME/EXPENSE TABLES AND CALL FUNCTION THAT UPDATES accountBalanceArray
  handleSubmitItem(item) {
    const inputObject = {
      description: item.description,
      amount: item.amount === "" ? 0 : parseInt(item.amount, 10),
      frequency: item.frequency,
      startOrOccuranceDate: item.startDate,
      endDateExists: item.endDateExists,
      endDate: item.endDate,
      incomeOrExpense: item.incomeOrExpense,
      key: item.key
    };

    const incomeItems = this.state.incomeItems;
    const expenseItems = this.state.expenseItems;
    const arrayOfAllItems = this.state.arrayOfAllItems;

    if (inputObject.incomeOrExpense === "Income") {
      incomeItems.push(inputObject);
      this.setState({ incomeItems: incomeItems });
    } else {
      expenseItems.push(inputObject);
      this.setState({ expenseItems: expenseItems });
    }

    arrayOfAllItems.push(inputObject);

    this.setState(
      {
        incomeItems: incomeItems,
        expenseItems: expenseItems,
        arrayOfAllItems: arrayOfAllItems
      },
      () => {
        this.updateLineChartArrays();
      }
    );
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  // REMOVE ITEM FROM INCOME/EXPENSE TABLES
  handleRemoveItem(item) {
    const incomeItems = this.state.incomeItems;
    const expenseItems = this.state.expenseItems;
    const incomeItemsUpdated = incomeItems.filter(items => items !== item);
    const expenseItemsUpdated = expenseItems.filter(items => items !== item);
    const arrayOfAllItemsUpdated = [];

    incomeItemsUpdated.forEach(item => arrayOfAllItemsUpdated.push(item));
    expenseItemsUpdated.forEach(item => arrayOfAllItemsUpdated.push(item));

    this.setState(
      {
        incomeItems: incomeItemsUpdated,
        expenseItems: expenseItemsUpdated,
        arrayOfAllItems: arrayOfAllItemsUpdated
      },
      () => {
        this.updateLineChartArrays();
      }
    );
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  // HANDLE SUBMISSION OF STARTINGBALANCE
  handleSubmitStartingBalance = e => {
    e.preventDefault();

    const startBalance = {
      startingDate: e.target[0].value,
      startingBalance:
        e.target[1].value === "" ? 0 : parseInt(e.target[1].value, 10)
    };

    this.setState({ startBalance: startBalance }, () => {
      this.updateLineChartArrays();
      localStorage.setItem("state", JSON.stringify(this.state));
    });

    e.target.reset();
  };

  resetData = () => {
    localStorage.clear();
    this.setState(
      {
        incomeItems: [],
        expenseItems: [],
        startBalance: { startingDate: new Date(), startingBalance: 0 },
        arrayOfAllItems: [],
        accountBalanceArray: [],
        accumulatedIncomeArray: [],
        accumulatedExpenseArray: [],
        chartPeriod: 27,
        incomeTotal: 0,
        expenseTotal: 0
      },
      () => {
        this.updateLineChartArrays();
      }
    );
  };

  render() {
    return (
      <div>
        <h1 className="App-header App-title">
          Practical Account Balance Projection
        </h1>
        <div className="chartsDiv">
          <div className="lineChartDiv">
            <Line
              className="lineChart"
              data={this.createLineChartData()}
              width={800}
              height={500}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: "Account Balance Projection",
                  fontSize: 19
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        callback: value => {
                          return "$" + value;
                        }
                      }
                    }
                  ]
                }
              }}
            />
          </div>
          <div className="incomePieChartDiv">
            <Doughnut
              className="pieChart"
              data={this.updatePieChartInfo().incomePieChartData}
              width={400}
              height={500}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: `Total Income: $${
                    this.state.accumulatedIncomeArray[
                      this.state.chartPeriod - 1
                    ]
                  }`,
                  fontSize: 19
                }
              }}
            />
          </div>
          <div className="expensePieChartDiv">
            <Doughnut
              className="pieChart"
              data={this.updatePieChartInfo().expensePieChartData}
              width={400}
              height={500}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: `Total Expense: $${-this.state.accumulatedExpenseArray[
                    this.state.chartPeriod - 1
                  ]}`,
                  fontSize: 19
                }
              }}
            />
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.changeChartPeriod}
                value={27}
              />
              1-Year
            </label>
            <label>
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.changeChartPeriod}
                value={53}
              />
              2-Year
            </label>
            <label>
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.changeChartPeriod}
                value={131}
              />
              5-Year
            </label>
          </div>
        </div>
        <div className="itemTableDiv">
          <div className="incomeTable">
            <ItemTable
              title="Income"
              items={this.state.incomeItems}
              handleSubmitItem={this.handleSubmitItem}
              handleRemoveItem={this.handleRemoveItem}
              incomeOrExpense="Income"
            />
          </div>
          <div className="expenseTable">
            <ItemTable
              title="Expense"
              items={this.state.expenseItems}
              handleSubmitItem={this.handleSubmitItem}
              handleRemoveItem={this.handleRemoveItem}
              incomeOrExpense="Expense"
            />
          </div>
          <div>
            <StartingBalanceBox
              handleSubmitStartingBalance={this.handleSubmitStartingBalance}
            />
          </div>
        </div>
        <button onClick={this.resetData}>Reset Data</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
