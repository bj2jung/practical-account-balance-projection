import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class AddItemBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment()
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date
    });
  }

  render() {
    return (
      <div className="col-lg-6 form">
        <h2 className="sub-header">Add Item</h2>
        <form
          className="form-inline border"
          onSubmit={this.props.handleSubmitItem}
        >
          <input
            className="col-lg-5"
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
          <select className="col-lg-2 dropDown" name="frequency">
            <option value="One-time">One-time</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Annually">Annually</option>
          </select>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleStartDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />

          <input type="checkbox" />

          <DatePicker
            selected={this.state.endDate}
            onChange={this.handleEndDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />

          <div className="col-lg-4">
            <div className="col-lg-6">
              <label>
                <input type="radio" id="income" name="incomeOrExpense" />
                Income
              </label>
            </div>
            <div className="col-lg-6">
              <label>
                <input
                  type="radio"
                  id="expense"
                  name="incomeOrExpense"
                  defaultChecked
                />
                Expense
              </label>
            </div>
          </div>
          <button type="submit" disabled={null}>
            Add Item
          </button>
        </form>
      </div>
    );
  }
}

export default AddItemBox;
