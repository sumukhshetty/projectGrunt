import React, { Component } from "react";
import { Pie } from "ant-design-pro/lib/Charts";
import projectGrunt from "../ethereum/projectGrunt";

class Chart extends Component {
  state = {};
  async componentDidMount() {
    const grunts = await projectGrunt.methods.getGrunts().call();
    // console.log("participants", grunts);
    //  const tasks = await Promise.all(
    //     Array(parseInt(taskLength))
    //       .fill()
    //       .map((element, index) => {
    //         return projectGrunt.methods.tasks(index).call();
    //       })
    //   );
    const contributors = await Promise.all(
      Array(parseInt(grunts))
        .fill()
        .map((element, index) => {
          return projectGrunt.methods.participant(index).call();
        })
    );

    console.log(contributors);
    const time = await projectGrunt.methods.getTime(contributors[0]).call();
    console.log("x", time);

    // await contributors.map(grunt =>
    //   console.log("x", projectGrunt.methods.getTime(grunt).call())
    // );

    // console.log(contributors);
    const equityData = [];
    for (let i = 0; i < grunts; i++) {
      equityData.push({
        x: contributors[i],
        y: parseInt(await projectGrunt.methods.getTime(contributors[i]).call())
      });
    }

    console.log(equityData);
    this.setState({ equityData });
  }
  render() {
    // console.log("k", this.state.equityData);
    return (
      <Pie height={294} data={this.state.equityData && this.state.equityData} />
    );
  }
}
export default Chart;
