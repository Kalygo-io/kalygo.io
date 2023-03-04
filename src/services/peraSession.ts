import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

import { showErrorToast } from "../utility/errorToast";

// import { AlgorandChainIDs } from "@perawallet/connect/dist/util/peraWalletTypes";

// let chainId: AlgorandChainIDs = 4160;
//     switch (network) {
//       case "MainNet":
//         chainId = 416001;
//         break;
//       case "TestNet":
//         chainId = 416002;
//         break;
//       case "BetaNet":
//         chainId = 416003;
//         break;
//     }

const supportedNetworks: any = {
  TestNet: {
    chainId: 416002,
  },
  MainNet: {
    chainId: 416001,
  },
};

export class PeraSession {
  static peraWalletInstance: any;
  static peraWalletNetwork: any;

  static instantiate(network: string) {
    try {
      const peraWallet = new PeraWalletConnect({
        chainId: supportedNetworks[network].chainId,
      });

      //   peraWallet.connector?.on("disconnect", () => {
      //     peraWallet.disconnect();
      //     showErrorToast("peraWallet session disconnected");
      //   });

      PeraSession.peraWalletInstance = peraWallet;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  static setPeraInstance(network: string) {
    PeraSession.instantiate(network);
  }

  static getPeraInstance(network: string) {
    // PeraSession.instantiate(network);
    if (PeraSession.peraWalletInstance) {
      return PeraSession.peraWalletInstance;
    } else {
      PeraSession.instantiate(network);
      return PeraSession.peraWalletInstance;
    }
  }
}
