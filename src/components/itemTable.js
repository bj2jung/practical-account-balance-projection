import React from "react";
import { Table } from "reactstrap";

class ItemTable extends React.Component {
  render() {
    const rows = [];

    if (this.props.items.length > 0) {
      this.props.items.forEach((item, index) => {
        rows.push(
          <ItemRow
            item={item}
            key={item.description}
            handleRemoveItem={this.props.handleRemoveItem}
          />
        );
      });
    }

    return (
      <div className="col-lg-6">
        <h2 className="sub-header">{this.props.title}</h2>
        <div className="border  table-wrapper-scroll-y">
          <Table striped responsive>
            <thead>
              <tr>
                <th className="column1">Description</th>
                <th className="column2">Amount</th>
                <th className="column3">Frequency</th>
                <th className="column4">Start/Occurance</th>
                <th className="column5" />
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
  const description = props.item.description;
  const amount = props.item.amount;
  const frequency = props.item.frequency;
  const startOrOccuranceDate = props.item.startOrOccuranceDate;
  const item = props.item;

  return (
    <tr>
      <td className="column1">{description}</td>
      <td className="column2">{amount}</td>
      <td className="column3">{frequency}</td>
      <td className="column4">{startOrOccuranceDate}</td>
      <td className="column5">
        <button onClick={() => props.handleRemoveItem(item)}>Remove</button>
      </td>
    </tr>
  );
}
// class ItemRow extends React.Component {
//   render() {
//     const description = this.props.item.description;
//     const amount = this.props.item.amount;
//     const frequency = this.props.item.frequency;
//     const startOrOccuranceDate = this.props.item.startOrOccuranceDate;
//     const item = this.props.item;

//     return (
//       <tr>
//         <td className="column1">{description}</td>
//         <td className="column2">{amount}</td>
//         <td className="column3">{frequency}</td>
//         <td className="column4">{startOrOccuranceDate}</td>
//         <td className="column5">
//           <button onClick={() => this.props.handleRemoveItem(item)}>
//             Remove
//           </button>
//         </td>
//       </tr>
//     );
//   }
// }

export default ItemTable;
