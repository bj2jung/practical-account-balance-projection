import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class AddItemBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDateSelector: moment(),
      endDateSelector: moment(),
      description: null,
      amount: null,
      frequency: null,
      endDateExists: null,
      startDate: null,
      endDate: null,
      incomeOrExpense: this.props.incomeOrExpense,
      key: 0
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange(date) {
    this.setState({
      startDateSelector: date
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDateSelector: date
    });
  }

  handleAddItem() {
    const itemDescription = document.querySelector(
      `#${this.state.incomeOrExpense}itemDescription`
    );
    const itemAmount = document.querySelector(
      `#${this.state.incomeOrExpense}itemAmount`
    );
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}itemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}itemEndDateExists`
    );
    const itemStartDate = document.querySelector(
      `#${this.state.incomeOrExpense}itemStartDate`
    ).value;
    const itemEndDate = itemEndDateExists
      ? document.querySelector(`#${this.state.incomeOrExpense}itemEndDate`)
          .value
      : null;

    let key = this.state.key + 0.1;

    this.setState(
      {
        description: itemDescription.value,
        amount: itemAmount.value,
        frequency: itemFrequency,
        endDateExists: itemEndDateExists.checked,
        startDate: itemStartDate,
        endDate: itemEndDate,
        key: key
      },
      () => {
        this.props.handleSubmitItem(this.state);
      }
    );

    itemDescription.value = "";
    itemAmount.value = "";
    itemEndDateExists.checked = false;
  }

  render() {
    return (
      <tr>
        <td>
          <input
            id={`${this.state.incomeOrExpense}itemDescription`}
            name="description"
            type="text"
            placeholder="Add description"
          />
        </td>
        <td>
          <input
            id={`${this.state.incomeOrExpense}itemAmount`}
            // name="amount"
            type="text"
            placeholder="Add amount"
          />
        </td>
        <td>
          <select
            className="dropDown"
            id={`${this.state.incomeOrExpense}itemFrequency`}
            // name="frequency"
          >
            <option value="One-time">One-time</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Annually">Annually</option>
          </select>
        </td>
        <td>
          <DatePicker
            id={`${this.state.incomeOrExpense}itemStartDate`}
            selected={this.state.startDateSelector}
            onChange={this.handleStartDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </td>
        <td>
          <input
            id={`${this.state.incomeOrExpense}itemEndDateExists`}
            type="checkbox"
          />
        </td>
        <td>
          <DatePicker
            id={`${this.state.incomeOrExpense}itemEndDate`}
            selected={this.state.endDateSelector}
            onChange={this.handleEndDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </td>
        <td>
          <button
            type="submit"
            onClick={() => {
              this.handleAddItem();
            }}
            disabled={null}
          >
            +
          </button>
        </td>
      </tr>
    );
  }
}

export default AddItemBox;
