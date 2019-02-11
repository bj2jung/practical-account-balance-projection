import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import confirmButton from "../images/confirm_icon.png";

class EditItemRow extends React.Component {
  constructor(props) {
    super(props);
    const detailsBeforeEdit = this.props.detailsBeforeEdit;

    this.state = {
      startDateSelector: moment(new Date(detailsBeforeEdit.startDate)),
      endDateSelector: moment(new Date(detailsBeforeEdit.endDate)),
      description: detailsBeforeEdit.description,
      amount: detailsBeforeEdit.amount,
      frequency: detailsBeforeEdit.frequency,
      endDateExistsCheckBoxDisabled:
        detailsBeforeEdit.frequency === "One-time" ? true : false,
      endDateExists: detailsBeforeEdit
        ? detailsBeforeEdit.endDateExists
        : false,
      endDateSelectorDisabled:
        detailsBeforeEdit.frequency === "One-time" ||
        !detailsBeforeEdit.endDateExists
          ? true
          : false,
      incomeOrExpense: this.props.incomeOrExpense
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
      `#${this.state.incomeOrExpense}EditItemEndDateExists`
    ).checked;
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemFrequency`
    ).value;

    this.setState({
      endDateExists: itemEndDateExists ? true : false,
      endDateSelectorDisabled:
        itemFrequency === "One-time" || !itemEndDateExists ? true : false
    });
  }

  handleFrequencySelect() {
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDateExists`
    ).checked;

    this.setState({
      endDateExistsCheckBoxDisabled:
        itemFrequency === "One-time" ? true : false,
      endDateExists: itemEndDateExists ? true : false,
      endDateSelectorDisabled:
        itemFrequency === "One-time" || !itemEndDateExists ? true : false
    });
  }

  handleConfirmEdit() {
    const itemDescription = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemDescription`
    );
    const itemAmount = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemAmount`
    );
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDateExists`
    );
    const itemStartDate = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemStartDate`
    ).value;
    const itemEndDate = document.querySelector(
      `#${this.state.incomeOrExpense}EditItemEndDate`
    ).value;

    this.setState(
      {
        description: itemDescription.value,
        amount: isNaN(itemAmount.value) ? 0 : itemAmount.value,
        frequency: itemFrequency,
        endDateExists:
          !itemEndDateExists.checked || itemFrequency === "One-time"
            ? false
            : true,
        startDate: itemStartDate,
        endDate: itemEndDate,
        editKey: this.props.editKey
      },
      () => {
        this.props.addEditedItem(this.state);
      }
    );
  }

  render() {
    return (
      <tr className="editItemRow">
        <td className="column1">
          <div className="centered">
            <div className="group">
              <input
                id={`${this.state.incomeOrExpense}EditItemDescription`}
                type="text"
                defaultValue={this.state.description}
                required="required"
              />
            </div>
          </div>
        </td>
        <td className="column2">
          <div className="group">
            <input
              id={`${this.state.incomeOrExpense}EditItemAmount`}
              type="text"
              required="required"
              defaultValue={this.state.amount}
            />
          </div>
        </td>
        <td className="column3 dropDown">
          <div className="select">
            <select
              name="slct"
              className="dropDown"
              id={`${this.state.incomeOrExpense}EditItemFrequency`}
              onChange={() => this.handleFrequencySelect()}
              defaultValue={this.state.frequency}
            >
              <option value="One-time">One-time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
        </td>
        <td className="column4">
          <DatePicker
            id={`${this.state.incomeOrExpense}EditItemStartDate`}
            selected={this.state.startDateSelector}
            onChange={this.handleStartDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </td>
        <td className="column5">
          <input
            id={`${this.state.incomeOrExpense}EditItemEndDateExists`}
            type="checkbox"
            onClick={() => this.handleEndDateCheckBoxClick()}
            disabled={this.state.endDateExistsCheckBoxDisabled}
            defaultChecked={this.state.endDateExists}
          />
        </td>
        <td className="column6">
          <DatePicker
            id={`${this.state.incomeOrExpense}EditItemEndDate`}
            selected={this.state.endDateSelector}
            onChange={this.handleEndDateChange}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            disabled={this.state.endDateSelectorDisabled}
          />
        </td>
        <td className="column7">
          <input
            id="confirmButton"
            type="image"
            alt="confirm"
            src={confirmButton}
            onClick={() => {
              this.handleConfirmEdit();
            }}
          />
        </td>
      </tr>
    );
  }
}

export default EditItemRow;
