import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import updateButton from "../images/update_icon.png";
import resetButton from "../images/reset_icon.png";

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
      <div className="optionsDiv">
        <h2 className="optionsDivHeader">Options</h2>
        <div className="optionsDivContent">
          <div>
            <h5>Set Start Date and Current Balance</h5>
          </div>
          <div>
            <h5>Set Period</h5>
          </div>
          <div>
            <h5>Reset All Data</h5>
          </div>
          <form onSubmit={e => this.props.handleSubmitStartingBalance(e)}>
            <div className="optionsDateSelectorDiv">
              <DatePicker
                id="optionsDateSelector"
                selected={this.state.startDate}
                onChange={this.handleChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <div className="centered">
              <div className="group">
                <input id="optionsAmount" type="text" required="required" />
                <label for="optionsAmount">Balance</label>
              </div>
            </div>
            <input
              id="updateStartingBalance"
              type="image"
              alt="Update"
              src={updateButton}
            />
          </form>

          <div className="periodSelectDiv">
            <label className="periodRadioOption">
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.props.changeChartPeriod}
                value={27}
              />
              1-Year
            </label>
            <label className="periodRadioOption">
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.props.changeChartPeriod}
                value={53}
              />
              2-Year
            </label>
            <label className="periodRadioOption">
              <input
                type="radio"
                name="chartPeriod"
                onChange={this.props.changeChartPeriod}
                value={131}
              />
              5-Year
            </label>
          </div>
          <div>
            <input
              id="resetButton"
              type="image"
              src={resetButton}
              alt="Reset"
              onClick={this.props.resetData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StartingBalanceBox;
