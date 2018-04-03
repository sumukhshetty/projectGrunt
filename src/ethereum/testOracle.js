import TestOracle from "./build/testOracle.json";
import web3 from "./web3";

const testOracle = new web3.eth.Contract(
  JSON.parse(TestOracle.interface),
  "0x2ea74bfb290990207e02eb239699febbbfe61062"
);

export default testOracle;
