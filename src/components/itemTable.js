import React from "react";
import { Table } from "reactstrap";
import AddItemRow from "./addItemRow.js";
import EditItemRow from "./editItemRow.js";

class ItemTable extends React.Component {
  render() {
    const rows = [];

    if (this.props.items.length > 0) {
      this.props.items.forEach(item => {
        rows.push(
          <ItemRow
            item={item}
            key={item.key}
            handleRemoveItem={this.props.handleRemoveItem}
            handleEditItem={this.props.handleEditItem}
          />
        );
      });
    }
    /////////////////
    const editIndex = this.props.items.findIndex(
      i => i.key === this.props.editKey
    );
    if (this.props.editKey) {
      rows[editIndex] = (
        <EditItemRow
          key="editItemRow"
          editKey={this.props.editKey}
          incomeOrExpense={this.props.incomeOrExpense}
          addEditedItem={this.props.addEditedItem}
          endDateSelectorDisabled={this.props.endDateSelectorDisabled}
          detailsBeforeEdit={this.props.items[editIndex]}
          editIncomeItemEndDateCheckBoxDisabled={
            this.props.editIncomeItemEndDateCheckBoxDisabled
          }
          editItemEndDateExists={this.props.editItemEndDateExists}
        />
      );
    }
    ////////////////

    rows.push(
      <AddItemRow
        key="addItemRow"
        incomeOrExpense={this.props.incomeOrExpense}
        handleSubmitItem={this.props.handleSubmitItem}
        endDateSelectorDisabled={this.props.endDateSelectorDisabled}
        addItemKey={this.props.addItemKey}
        detailsBeforeEdit={null}
      />
    );

    return (
      <div className="">
        <h2 className="sub-header">{this.props.title}</h2>
        <div className="border  table-wrapper-scroll-y">
          <Table striped responsive>
            <thead>
              <tr>
                <th className="col1">Description</th>
                <th className="col2">Amount</th>
                <th className="col3">Frequency</th>
                <th className="col4">Start/Occurance</th>
                <th className="col5" />
                <th className="col6">End</th>
                <th className="col7" />
              </tr>
            </thead>
            <tbody className="tableBody">{rows}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

function ItemRow(props) {
  const description =
    props.item.description === "" ? `No description` : props.item.description;
  const amount = props.item.amount;
  const frequency = props.item.frequency;
  const startDate = props.item.startDate;
  const endDate = props.item.endDateExists ? props.item.endDate : "-";
  const item = props.item;

  return (
    <tr>
      <td className="column1">{description}</td>
      <td className="column2">{amount}</td>
      <td className="column3">{frequency}</td>
      <td className="column4">{startDate}</td>
      <td className="column5" />
      <td className="column6">{endDate}</td>
      <td className="column7">
        <button onClick={() => props.handleEditItem(item)}>edit</button>
      </td>
      <td className="column8">
        <button onClick={() => props.handleRemoveItem(item)}>-</button>
      </td>
    </tr>
  );
}

export default ItemTable;
