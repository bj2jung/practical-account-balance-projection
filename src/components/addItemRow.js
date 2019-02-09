import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class AddItemRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDateSelector: moment(),
      endDateSelector: moment(),
      description: null,
      amount: null,
      frequency: null,
      endDateExistsCheckBoxDisabled: true,
      endDateExists: false,
      startDate: null,
      endDate: null,
      incomeOrExpense: this.props.incomeOrExpense,
      addItemKey: this.props.addItemKey
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

  handleEndDateCheckBoxClick() {
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemEndDateExists`
    ).checked;
    this.setState({
      endDateExists: itemEndDateExists
    });
  }

  handleFrequencySelect() {
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemEndDateExists`
    ).checked;

    this.setState({
      endDateExists:
        itemFrequency === "One-time" || !itemEndDateExists ? false : true,
      endDateExistsCheckBoxDisabled: itemFrequency === "One-time" ? true : false
    });
  }

  handleAddItem() {
    const itemDescription = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemDescription`
    );
    const itemAmount = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemAmount`
    );
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemEndDateExists`
    );
    const itemStartDate = document.querySelector(
      `#${this.state.incomeOrExpense}AddItemStartDate`
    ).value;
    const itemEndDate = itemEndDateExists
      ? document.querySelector(`#${this.state.incomeOrExpense}AddItemEndDate`)
          .value
      : null;

    let addItemKey = this.props.addItemKey + 0.01;

    this.setState(
      {
        description: itemDescription.value,
        amount: isNaN(itemAmount.value) ? 0 : itemAmount.value,
        frequency: itemFrequency,
        endDateExists:
          itemFrequency === "One-time" ? false : itemEndDateExists.checked,
        startDate: itemStartDate,
        endDate: itemFrequency === "One-time" ? null : itemEndDate,
        key: addItemKey
      },
      () => {
        this.props.handleSubmitItem(this.state);
        this.setState({ endDateExists: false });
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
            id={`${this.state.incomeOrExpense}AddItemDescription`}
            type="text"
            placeholder="Add description"
          />
        </td>
        <td>
          <input
            id={`${this.state.incomeOrExpense}AddItemAmount`}
            type="text"
            placeholder="Add amount"
          />
        </td>
        <td>
          <select
            className="dropDown"
            id={`${this.state.incomeOrExpense}AddItemFrequency`}
            onChange={() => this.handleFrequencySelect()}
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
            id={`${this.state.incomeOrExpense}AddItemStartDate`}
            selected={this.state.startDateSelector}
            onChange={this.handleStartDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </td>
        <td>
          <input
            id={`${this.state.incomeOrExpense}AddItemEndDateExists`}
            type="checkbox"
            onClick={() => this.handleEndDateCheckBoxClick()}
            disabled={this.state.endDateExistsCheckBoxDisabled}
          />
        </td>
        <td>
          <DatePicker
            id={`${this.state.incomeOrExpense}AddItemEndDate`}
            selected={this.state.endDateSelector}
            onChange={this.handleEndDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            disabled={!this.state.endDateExists}
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

export default AddItemRow;