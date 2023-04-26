import algosdk from "algosdk";
import Web3 from "web3";

const supportedNetworks: any = {
  localhost: {},
  Goerli: {},
  MainNet: {},
};

export class EthereumClient {
  static ethereumClientInstance: any;

  static connectEthereumClient(network: string) {
    try {
      EthereumClient.ethereumClientInstance = new Web3(
        // "https://prettiest-withered-model.ethereum-goerli.discover.quiknode.pro/1e21d2d24cf75481f03311a5a652a4963e05ace4/"
        // "https://virulent-smart-dream.discover.quiknode.pro/bf18a1026d8aa87ae439779802efb92be937e564/"
        "https://stylish-warmhearted-glade.ethereum-sepolia.discover.quiknode.pro/2764fbc2fafa944962ca32ae5bd04dcce6410303/"
      );
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static setEthereumClient(network: string) {
    EthereumClient.connectEthereumClient(network);
  }

  static getEthereumClient(network: string): Web3 {
    if (EthereumClient.ethereumClientInstance) {
      return EthereumClient.ethereumClientInstance;
    } else {
      EthereumClient.connectEthereumClient(network);
      return EthereumClient.ethereumClientInstance;
    }
  }
}
