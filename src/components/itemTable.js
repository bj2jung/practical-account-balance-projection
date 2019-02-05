import React from "react";
import { Table } from "reactstrap";
import AddItemBox from "./addItemBox.js";

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
          />
        );
      });
    }

    rows.push(
      <AddItemBox
        key="addItemRow"
        incomeOrExpense={this.props.incomeOrExpense}
        handleSubmitItem={this.props.handleSubmitItem}
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
  const startOrOccuranceDate = props.item.startOrOccuranceDate;
  const endDate = props.item.endDateExists ? props.item.endDate : "-";
  const item = props.item;

  return (
    <tr>
      <td className="column1">{description}</td>
      <td className="column2">{amount}</td>
      <td className="column3">{frequency}</td>
      <td className="column4">{startOrOccuranceDate}</td>
      <td className="column5" />
      <td className="column6">{endDate}</td>
      <td className="column7">
        <button onClick={() => props.handleRemoveItem(item)}>-</button>
      </td>
    </tr>
  );
}

export default ItemTable;
