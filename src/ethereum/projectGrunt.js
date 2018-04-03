import ProjectGrunt from "./build/ProjectGrunt.json";
import web3 from "./web3";

const projectGrunt = new web3.eth.Contract(
  JSON.parse(ProjectGrunt.interface),
  "0x50809b4787D095aEb61a4CA52A8795eD77D6F12e"
);

export default projectGrunt;
