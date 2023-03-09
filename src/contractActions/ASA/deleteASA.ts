import algosdk, {
  Transaction,
  AtomicTransactionComposer,
  makeAssetDestroyTxnWithSuggestedParams,
} from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function deleteASA(
  sender: string,
  fungibleTokenId: number,
  network: string,
  signer: any
) {
  try {
    console.log("delete ASA");
    let sp = await AlgorandClient.getAlgod(network).getTransactionParams().do();
    // Create a transaction
    const txn = makeAssetDestroyTxnWithSuggestedParams(
      sender,
      new Uint8Array(Buffer.from("")),
      fungibleTokenId,
      sp
    );
    const tws = {
      txn: txn,
      signer: signer,
    };
    let atc = new AtomicTransactionComposer();
    atc.addTransaction(tws);
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast("Delete ASA request to network");
  } catch (e) {
    showErrorToast("Error occurred when deleting ASA");
    console.error(e);
  }
}
