import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TaskForm from "./components/TaskForm.js";
import Chart from "./components/PieChart.js";
import ApprovalTable from "./components/ApprovalTable.js";
import projectGrunt from "./ethereum/projectGrunt";
import OracleData from "./components/OracleData";
import CreateGnosisMarket from "./components/CreateGnosisMarket";

class App extends Component {
  state = {};
  componentDidMount() {
    this.getTasks();
  }

  //hello

  getTasks = async () => {
    const taskLength = await projectGrunt.methods.getTaskCount().call();
    const tasks = await Promise.all(
      Array(parseInt(taskLength))
        .fill()
        .map((element, index) => {
          return projectGrunt.methods.tasks(index).call();
        })
    );
    this.setState({ tasks });
  };

  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="http://cdn.bootcss.com/antd/2.9.3/antd.css"
        />

        <h1 className="App-title">Welcome to projectGrunt</h1>
        <h3> Ownership structure </h3>

        <div>
          <Chart />
        </div>
        <div>
          <h3> Oracle Ticker </h3>
          <OracleData />
        </div>

        <h3>Tasks submitted</h3>

        <div>
          <ApprovalTable tasks={this.state.tasks} />
        </div>
        <h3> Submit Completed Tasks </h3>
        <div>
          <TaskForm recallTasks={this.getTasks()} />
        </div>
        <div>
          <CreateGnosisMarket />
        </div>
      </div>
    );
  }
}

export default App;
