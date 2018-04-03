const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const provider = new HDWalletProvider(
  "garage rival almost great door fork pair kiwi drive situate pluck post",
  "https://ropsten.infura.io/8iVOPv0fBiRTXfkIOnOt"
);

const web3 = new Web3(provider);
const projectGrunt = require("./build/ProjectGrunt.json");

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(projectGrunt.interface))
    .deploy({ data: projectGrunt.bytecode })
    .send({
      gas: "1000000",
      from: accounts[0]
    });

  console.log("Contract deployed to ", result.options.address);
};
deploy();
