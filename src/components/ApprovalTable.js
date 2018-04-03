import { Table, Popconfirm } from "antd";
import React, { Component } from "react";
import projectGrunt from "../ethereum/projectGrunt.js";
import web3 from "../ethereum/web3";
const { Column } = Table;

class ApprovalTable extends Component {
  // constructor() {
  //   super();
  //   this.state = {};
  // }
  onApprove = async index => {
    try {
      const accounts = await web3.eth.getAccounts();
      await projectGrunt.methods.approve(index).send({
        from: accounts[0]
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };
  onReject = async index => {
    try {
      const accounts = await web3.eth.getAccounts();
      await projectGrunt.methods.reject(index).send({
        from: accounts[0]
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  render() {
    const { tasks } = this.props;

    return (
      <Table dataSource={tasks || []}>
        <Column title="Index" dataIndex="index" />
        <Column title="Description" dataIndex="description" />
        <Column title="Owner" dataIndex="owner" />
        <Column title="Approval count" dataIndex="approvalCount" />
        <Column
          title="Approve"
          key="key"
          render={(key, record, index) => (
            <Popconfirm
              key="key"
              title="Sure to approve?"
              onConfirm={() => this.onApprove(index)}
            >
              <a>Approve</a>
            </Popconfirm>
          )}
        />
        <Column
          title="Reject"
          key="key1"
          render={(key1, record, index) => (
            <Popconfirm
              key="key"
              title="Sure to reject?"
              onConfirm={() => this.onReject(index)}
            >
              <a>Reject</a>
            </Popconfirm>
          )}
        />
      </Table>
    );
  }
}
export default ApprovalTable;
