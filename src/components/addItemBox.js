import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

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
            onChange={this.handleChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <div className="col-lg-4">
            <div className="form-check col-lg-6">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  id="income"
                  name="incomeOrExpense"
                />
                Income
              </label>
            </div>
            <div className="form-check col-lg-6">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
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
