import algosdk, {
  Transaction,
  AtomicTransactionComposer,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
} from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function firstEscrowAmount(
  sender: string,
  contractAddress: string,
  fungibleTokenId: number,
  network: string,
  escrow1Amount: number,
  signer: any
) {
  try {
    console.log("1st Escrow Amount");
    let sp = await AlgorandClient.getAlgod(network).getTransactionParams().do();
    // Create a transaction
    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      assetIndex: fungibleTokenId,
      from: sender,
      to: contractAddress,
      suggestedParams: sp,
      amount: escrow1Amount,
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
    showSuccessToast("Sent 1st escrow token payment request to network");
  } catch (e) {
    showErrorToast("Error occurred when sending 1st escrow token payment");
    console.error(e);
  }
}
