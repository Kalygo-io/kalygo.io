import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
  makeApplicationOptInTxn,
} from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/escrow/application.json";

export async function optoutToASA(
  sender: string,
  fungibleTokenId: number,
  network: string,
  signer: any,
  closeRemainderTo: string
) {
  try {
    console.log("Opt-out ASA");
    let sp = await AlgorandClient.getAlgod(network).getTransactionParams().do();
    // Create a transaction
    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      assetIndex: fungibleTokenId,
      from: sender,
      to: sender,
      suggestedParams: sp,
      amount: 0,
      note: new Uint8Array(Buffer.from("")),
      closeRemainderTo: closeRemainderTo,
    });
    const tws = {
      txn: txn,
      signer: signer,
    };
    let atc = new AtomicTransactionComposer();
    atc.addTransaction(tws);
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast(`Sent ASA opt-out request to network`);
  } catch (e) {
    showErrorToast("Error occurred when sending ASA opt-out request");
    console.error(e);
  }
}
