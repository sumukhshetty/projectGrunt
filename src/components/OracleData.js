import React, { Component } from "react";
import { Form, Button } from "antd";
import web3 from "../ethereum/web3";

import testOracle from "../ethereum/testOracle";
const FormItem = Form.Item;

class OracleData extends Component {
  async componentDidMount() {
    const result = await testOracle.methods.result().call();
    this.setState({ result });
  }
  state = {};
  onSubmit = async event => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();

      await testOracle.methods
        .getaKraken()
        .send({ from: accounts[0], value: 10000000000000000 });

      console.log("Api has been called using oraclize");
    } catch (err) {
      console.log(err);
    }
    // console.log("figuring shit out...");
    const result = await testOracle.methods.result().call();

    // result.then(result => console.log("result", result))
    // const resultz = await resulty.call();
    // console.log("resultz", resultz);

    this.setState({ result });
  };
  render() {
    const { result } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <FormItem>
          <Button // onClick={success}
            type="primary"
            htmlType="submit"
            className="login-form-button"

            // loading={this.state.loading}
          >
            Get Current price
          </Button>
        </FormItem>

        <FormItem>
          <h3> Last price returned from Oracle</h3>
          <h4>{result}</h4>
        </FormItem>
      </Form>
    );
  }
}

export default OracleData;
