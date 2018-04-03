import React, { Component } from "react";
import { message, Form, Input, Button } from "antd";
import projectGrunt from "../ethereum/projectGrunt";
import web3 from "../ethereum/web3";
const FormItem = Form.Item;

const success = () => {
  const hide = message.loading("Action in progress..", 0);
  // Dismiss manually and asynchronously
  setTimeout(hide, 2500);
};

class TaskForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: ""
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await projectGrunt.methods
        .create(this.state.value)
        .send({ from: accounts[0] });
      this.props.recallTasks();
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
    this.setState({ value: "" });
  };
  render() {
    const { value } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <FormItem>
          <Input
            placeholder="description"
            value={value}
            onChange={event => this.setState({ value: event.target.value })}
          />
        </FormItem>

        <FormItem>
          <Button
            onClick={success}
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={this.state.loading}
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default TaskForm;
