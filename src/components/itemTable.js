import React from "react";
import { Table } from "reactstrap";
import AddItemRow from "./addItemRow.js";
import EditItemRow from "./editItemRow.js";
import editItemButton from "../images/edit_icon.png";
import removeItemButton from "../images/remove_icon.png";

class ItemTable extends React.Component {
  render() {
    const rows = [];
    // const mouseOverIndex = this.props.items.findIndex(
    //   i => i.key === this.props.mouseOverKey
    // );
    // let buttons = (
    //   <div>
    //     <button onClick={() => this.props.handleEditItem(this.item)}>e</button>
    //     <button onClick={() => this.props.handleRemoveItem(this.item)}>
    //       -
    //     </button>
    //   </div>
    // );

    if (this.props.items.length > 0) {
      this.props.items.forEach(item => {
        rows.push(
          <ItemRow
            item={item}
            key={item.key}
            handleRemoveItem={this.props.handleRemoveItem}
            handleEditItem={this.props.handleEditItem}
            handleMouseOver={this.props.handleMouseOver}
          />
        );
      });
    }

    // if (mouseOverIndex >= 0) {
    //   rows[mouseOverIndex] = (
    //     <ItemRow
    //       item={this.props.items[0]}
    //       key={this.props.items[0].key}
    //       handleRemoveItem={this.props.handleRemoveItem}
    //       handleEditItem={this.props.handleEditItem}
    //       handleMouseOver={this.props.handleMouseOver}
    //       buttons={buttons}
    //     />
    //   );
    // }

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
          detailsBeforeEdit={this.props.items[editIndex]}
        />
      );
    }

    rows.push(
      <AddItemRow
        key="addItemRow"
        incomeOrExpense={this.props.incomeOrExpense}
        handleSubmitItem={this.props.handleSubmitItem}
        addItemKey={this.props.addItemKey}
      />
    );

    return (
      <div className="">
        <h2 className="sub-header">{this.props.title}</h2>
        <div className="border  table-wrapper-scroll-y">
          <Table striped responsive>
            <thead>
              <tr>
                <th className="column1">Description</th>
                <th className="column2">Amount</th>
                <th className="column3">Frequency</th>
                <th className="column4">Start</th>
                <th className="column5" />
                <th className="column6">End</th>
                <th className="column7" />
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
  // const buttons = props.buttons;

  return (
    <tr onMouseOver={() => {}}>
      <td className="column1">{description}</td>
      <td className="column2">${amount}</td>
      <td className="column3">{frequency}</td>
      <td className="column4">{startDate}</td>
      <td className="column5" />
      <td className="column6">{endDate}</td>
      <td className="column7">
        <input
          type="image"
          alt="edit"
          src={editItemButton}
          className="editItemButton"
          onClick={() => props.handleEditItem(item)}
        />
        <input
          type="image"
          alt="-"
          src={removeItemButton}
          className="removeItemButton"
          onClick={() => props.handleRemoveItem(item)}
        />
      </td>
    </tr>
  );
}

export default ItemTable;
