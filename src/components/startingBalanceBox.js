import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

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
      <div className="col-lg-6 form">
        <h2 className="sub-header">Starting Balance</h2>
        <form
          className="form-inline border"
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

export default StartingBalanceBox;
