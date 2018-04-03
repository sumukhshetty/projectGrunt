import React, { Component } from "react";
import { Form, Button, Input } from "antd";
import web3 from "../ethereum/web3";
import Gnosis from "@gnosis.pm/gnosisjs";
const FormItem = Form.Item;

class CreateGnosisMarket extends Component {
  state = {
    hash: "",
    description: "",
    oracle: ""
  };
  async componentDidMount() {
    console.log("Creating description ...");
    let gnosis, ipfsHash, title;

    gnosis = await Gnosis.create();
    ipfsHash = await gnosis.publishEventDescription({
      title: "Who will win Gnosis X?",
      description: "Gnosis",
      resolutionDate: "2018-09-28T23:00:00-05:00",
      outcomes: ["cryptogrunts", "cryptoslackers", "Other"]
    });
    // now the event description has been uploaded to ipfsHash and can be used
    // console.log("Description is being pushed");
    // console.assert(
    //   (await gnosis.loadEventDescription(ipfsHash)).title ===
    //     "Who will win Gnosis X?"
    // );
    title = (await gnosis.loadEventDescription(ipfsHash)).title;
    // console.log(title);
    // console.info(
    //   `Ipfs hash: https://ipfs.infura.io/api/v0/cat?stream-channels=true&arg=${ipfsHash}`
    // );
    const link = `https://ipfs.infura.io/api/v0/cat?stream-channels=true&arg=${ipfsHash}`;

    this.setState({ hash: ipfsHash, description: title, link });

    // const ONE = Math.pow(2, 64);
    // Gnosis.create()
    //   .then(gnosis => gnosis.contracts.Math.deployed())
    //   .then(math => math.ln(3 * ONE))
    //   .then(result => console.log("Math.ln(3) =", result.valueOf() / ONE));
  }
  createOracle = async event => {
    event.preventDefault();
    const depositValue = 100000;
    let oracle, market;
    console.log("creating oracle...");
    const gnosis = await Gnosis.create();
    console.log("ipfs hash is", this.state.hash);
    oracle = await gnosis.createCentralizedOracle(this.state.hash);
    console.info(`Oracle created with address ${oracle.address}`);
    this.setState({ oracle });
    console.log("firing categorical event....");

    const categoryEvent = await gnosis.createCategoricalEvent({
      collateralToken: gnosis.etherToken,
      oracle,
      // Note the outcomeCount must match the length of the outcomes array published on IPFS
      outcomeCount: 3
    });
    console.info(
      `Categorical event created with address ${categoryEvent.address}`
    );
    this.setState({ categoryEvent });
    console.log("event is", categoryEvent);
    console.log("creating market ..");
    market = await gnosis.createMarket({
      event: categoryEvent.address,
      marketMaker: gnosis.lmsrMarketMaker,
      fee: 50000
      // signifies a 5% fee on transactions
      // see docs at Gnosis.createMarket (api-reference.html#createMarket) for more info
    });
    console.info(`Market created with address ${market.address}`);

    // What im experimenting with today
    // here I'm basically trying to improt tx results into the same contract
    console.log("getting tx results ..... ");
    const txResults = await Promise.all(
      [
        [
          gnosis.etherToken.constructor,
          await gnosis.etherToken.deposit.sendTransaction({
            value: depositValue
          })
        ],
        [
          gnosis.etherToken.constructor,
          await gnosis.etherToken.approve.sendTransaction(
            categoryEvent.address,
            depositValue
          )
        ],
        [
          categoryEvent.constructor,
          await categoryEvent.buyAllOutcomes.sendTransaction(depositValue)
        ]
      ].map(([contract, txHash]) => contract.syncTransaction(txHash))
    );

    // Make sure everything worked
    const expectedEvents = ["Deposit", "Approval", "OutcomeTokenSetIssuance"];
    txResults.forEach((txResult, i) => {
      Gnosis.requireEventFromTXResult(txResult, expectedEvents[i]);
    });
    console.log("txResult", txResults);

    console.log("Checking bet balance ...");

    const { Token } = gnosis.contracts;
    const outcomeCount = (await categoryEvent.getOutcomeCount()).valueOf();

    for (let i = 0; i < outcomeCount; i++) {
      const outcomeToken = await Token.at(await categoryEvent.outcomeTokens(i));
      console.log(
        "Have",
        (await outcomeToken.balanceOf(gnosis.defaultAccount)).valueOf(),
        "units of outcome",
        i
      );
    }

    console.log("LMSR  cost...");
    const cost = await gnosis.lmsrMarketMaker.calcCost(market.address, 2, 1e17);
    console.info(
      `Buy 1 Outcome Token with index 2 costs ${cost.valueOf() /
        1e187} ETH tokens`
    );
    console.log("bet on outcome that we win ....");
    await gnosis.buyOutcomeTokens({
      market,
      outcomeTokenIndex: 0,
      outcomeTokenCount: 1e17
    });
    console.info("Bought 1 Outcome Token of Outcome with index 2");

    const profit = await gnosis.lmsrMarketMaker.calcProfit(
      market.address,
      2,
      1e17
    );
    console.info(
      `Sell 1 Outcome Token with index 2 gives ${profit.valueOf() /
        1e17} ETH tokens of profit`
    );
  };

  betResolve = async event => {
    event.preventDefault();
    const { categoryEvent } = this.state;
    console.log("Resolving worst case scenario ...");
    const gnosis = await Gnosis.create();

    await gnosis.resolveEvent({ categoryEvent, outcome: 1 });
  };

  render() {
    const depositValue = 100000;

    return (
      <Form>
        <h1>Gnosis stuff</h1>
        <div>
          <a href={this.state.link}>Ipfs hash is {this.state.hash}</a>
        </div>
        <h2>{this.state.description}</h2>
        <FormItem>
          <Input
            placeholder="Bet Value"
            value={depositValue}
            onChange={event =>
              this.setState({ depositValue: event.target.value })
            }
          />
        </FormItem>
        <FormItem>
          <Button onClick={this.createOracle} type="primary">
            Create Oracle
          </Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.createMarket} type="primary">
            createMarket
          </Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.betResolve} type="primary">
            resolve
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default CreateGnosisMarket;
