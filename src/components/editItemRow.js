import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

class EditItemRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDateSelector: moment(),
      endDateSelector: moment(),
      description: null,
      amount: null,
      frequency: null,
      endDateExistsCheckBoxDisabled: this.props
        .editIncomeItemEndDateCheckBoxDisabled,
      endDateExists: this.props.editItemEndDateExists,
      startDate: null,
      endDate: null,
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
      `#${this.state.incomeOrExpense}itemEndDateExists`
    ).checked;

    this.setState({
      endDateExists: itemEndDateExists ? true : false
    });
  }

  handleFrequencySelect(descriptionBeforeEdit) {
    const itemFrequency = document.querySelector(
      `#${this.state.incomeOrExpense}itemFrequency`
    ).value;
    const itemEndDateExists = document.querySelector(
      `#${this.state.incomeOrExpense}itemEndDateExists`
    ).checked;

    this.setState({
      endDateExistsCheckBoxDisabled:
        itemFrequency === "One-time" ? true : false,
      endDateExists:
        itemFrequency === "One-time" || !itemEndDateExists ? false : true
    });
  }

  handleConfirmEdit() {
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

    this.setState(
      {
        description: itemDescription.value,
        amount: isNaN(itemAmount.value) ? 0 : itemAmount.value,
        frequency: itemFrequency,
        endDateExists: itemEndDateExists.checked,
        startDate: itemStartDate,
        endDate: itemEndDate,
        editKey: this.props.editKey
      },
      () => {
        this.props.addEditedItem(this.state);
        // this.setState({ endDateExists: false });
      }
    );

    // itemDescription.value = "";
    // itemAmount.value = "";
    // itemEndDateExists.checked = false;
  }

  render() {
    const detailsBeforeEdit = this.props.detailsBeforeEdit;
    const descriptionBeforeEdit = detailsBeforeEdit
      ? detailsBeforeEdit.description
      : "";
    const amountBeforeEdit = detailsBeforeEdit ? detailsBeforeEdit.amount : "";
    const frequencyBeforeEdit = detailsBeforeEdit
      ? detailsBeforeEdit.frequency
      : "";
    // const startDateBeforeEdit = this.props.detailsBeforeEdit
    //   ? moment(new Date(detailsBeforeEdit.startDate))
    //   : this.state.startDateSelector;
    const endDateExistsBeforeEdit = detailsBeforeEdit
      ? detailsBeforeEdit.endDateExists
      : false;
    // const endDateBeforeEdit = this.props.detailsBeforeEdit
    //   ? moment(new Date(detailsBeforeEdit.endDate))
    //   : this.state.endDateSelector;

    return (
      <tr>
        <td>
          <input
            id={`${this.state.incomeOrExpense}itemDescription`}
            type="text"
            defaultValue={descriptionBeforeEdit}
            placeholder="Add description"
          />
        </td>
        <td>
          <input
            id={`${this.state.incomeOrExpense}itemAmount`}
            type="text"
            placeholder="Add amount"
            defaultValue={amountBeforeEdit}
          />
        </td>
        <td>
          <select
            className="dropDown"
            id={`${this.state.incomeOrExpense}itemFrequency`}
            onChange={() => this.handleFrequencySelect(descriptionBeforeEdit)}
            defaultValue={frequencyBeforeEdit}
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
            // preSelection={startDateBeforeEdit}
            // selected={startDateBeforeEdit}
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
            onClick={() => this.handleEndDateCheckBoxClick()}
            disabled={this.state.endDateExistsCheckBoxDisabled}
            defaultChecked={endDateExistsBeforeEdit}
          />
        </td>
        <td>
          <DatePicker
            id={`${this.state.incomeOrExpense}itemEndDate`}
            selected={this.state.endDateSelector}
            // preSelection={endDateBeforeEdit}
            // selected={endDateBeforeEdit}selected={endDateBeforeEdit}
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
              this.handleConfirmEdit();
            }}
            disabled={null}
          >
            confirm
          </button>
        </td>
      </tr>
    );
  }
}

export default EditItemRow;
