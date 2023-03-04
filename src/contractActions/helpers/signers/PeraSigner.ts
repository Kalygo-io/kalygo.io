import algosdk from "algosdk";
import get from "lodash/get";

import { PeraSession } from "../../../services/peraSession";

export async function signerForPera(
  unsignedTxns: Array<algosdk.Transaction>
): Promise<Uint8Array[]> {
  let network;
  if (get(unsignedTxns[0], "genesisID") === "testnet-v1.0") {
    network = "TestNet";
  } else if (get(unsignedTxns[0], "genesisID") === "mainnet-v1.0") {
    network = "MainNet";
  } else {
    throw "Unsupported network/genesisID found while signing txns with Pera";
  }

  const txnsToSign = [{ txn: unsignedTxns[0], message: "This is a message" }];

  console.log("ATC txnsToSign", txnsToSign);

  let returnedVal = {
    transaction: [txnsToSign],
  };

  const transactions = returnedVal.transaction.reduce(
    (acc, val) => acc.concat(val),
    []
  );

  console.log("ATC transactions", transactions);

  let peraWallet = PeraSession.getPeraInstance(network);

  return await peraWallet.signTransaction([transactions]);
}
