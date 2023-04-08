import algosdk, {
  makeAssetTransferTxnWithSuggestedParamsFromObject,
  AtomicTransactionComposer,
} from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function secondEscrowAmount(
  sender: string,
  contractAddress: string,
  fungibleTokenId: number,
  network: string,
  escrow2Amount: number,
  signer: any
) {
  try {
    console.log("2nd Escrow Amount");

    let sp = await AlgorandClient.getAlgod(network).getTransactionParams().do();
    // Create a transaction
    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      assetIndex: fungibleTokenId,
      from: sender,
      to: contractAddress,
      suggestedParams: sp,
      amount: escrow2Amount,
      note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
    });
    const tws = {
      txn: txn,
      signer: signer,
    };

    let atc = new AtomicTransactionComposer();
    atc.addTransaction(tws);
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);

    showSuccessToast("Sent 2nd escrow token payment request to network");
  } catch (e) {
    showErrorToast("Error occurred when sending 2nd escrow token payment");
    console.error(e);
  }
}
