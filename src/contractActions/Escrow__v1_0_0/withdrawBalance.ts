import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/escrow/application.json";
import { signerForAlgoSigner } from "../helpers/signers/AlgoSigner";

export async function withdrawBalance(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  signer: any
) {
  try {
    console.log("withdrawBalance");
    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let params = await AlgorandClient.getAlgod(network)
      .getTransactionParams()
      .do();
    params.flatFee = true;
    params.fee = 1000 * 2; // 1 for this txn and 1 for the contract to send the balance to sender
    atc.addMethodCall({
      appID: appId,
      method: contract.getMethodByName("withdraw_balance"),
      methodArgs: [] as ABIArgument[],
      sender: sender,
      suggestedParams: params,
      note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
      signer,
    });
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);

    showSuccessToast("Withdraw balance request sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending withdraw balance request");
    console.error(e);
  }
}
