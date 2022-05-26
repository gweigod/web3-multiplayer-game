import Moralis from "moralis/dist/moralis.min.js";
import Web3 from "web3";

var web3;

async function checkWeb3() {
  const wallet = window.ethereum;
  if (!wallet || !wallet.on) {
  } else {
    setWeb3Environment();
  }
}

export { checkWeb3 };

function setWeb3Environment() {
  web3 = new Web3(window.ethereum);
  getNetwork();
  monitorNetwork();
}

async function getNetwork() {
  var chainID = await web3.eth.net.getId();
}

function getNetworkName(chainID) {
  var networks = {
    1: "Ethereum Mainnet",
    43113: "AVAX Testnet",
  };
  return networks[chainID];
}

function monitorNetwork() {
  Moralis.onChainChanged(function () {
    window.location.reload();
    console.log("Network Changed.");
  });
}
