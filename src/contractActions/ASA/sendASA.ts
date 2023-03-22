import {
  AtomicTransactionComposer,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
} from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function sendASA(
  sender: string,
  fungibleTokenId: number,
  network: string,
  signer: any,
  receiver: string,
  amount: number,
  note: string
) {
  try {
    console.log("Transfer ASA");
    let sp = await AlgorandClient.getAlgod(network).getTransactionParams().do();
    // Create a transaction
    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      assetIndex: fungibleTokenId,
      from: sender,
      to: receiver,
      suggestedParams: sp,
      amount: amount,
      note: new Uint8Array(Buffer.from(note)),
    });
    const tws = {
      txn: txn,
      signer: signer,
    };
    let atc = new AtomicTransactionComposer();
    atc.addTransaction(tws);
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast(`Sent ASA transfer (${amount}) request to network`);
  } catch (e) {
    showErrorToast("Error occurred when sending ASA transfer");
    console.error(e);
  }
}
