import algosdk, { TransactionSigner, Transaction } from "algosdk";

import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export async function signerForPera(
  unsignedTxns: Array<algosdk.Transaction>,
  addr: string
): Promise<Uint8Array[]> {
  const txsToSign = unsignedTxns.map((txn) => ({ txn, signers: [addr] }));
  return peraWallet.signTransaction([txsToSign], addr);
}
