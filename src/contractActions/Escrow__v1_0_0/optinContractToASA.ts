import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/cashBuy/application.json";

export async function optinContractToASA(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  fungibleTokenId: number,
  signer: any
) {
  try {
    console.log("optinContractToASA");
    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let params = await AlgorandClient.getAlgod(network)
      .getTransactionParams()
      .do();
    params.flatFee = true;
    params.fee = 1000 * 2; // 1 fee for this txn and 1 for the optin from the contract into the ASA
    atc.addMethodCall({
      appID: appId,
      method: contract.getMethodByName("optin_to_ASA"),
      methodArgs: [] as ABIArgument[],
      sender: sender,
      suggestedParams: params,
      note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
      signer: signer,
      appForeignAssets: [fungibleTokenId],
    });
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast("Sent ASA optin request to network");
  } catch (e) {
    showErrorToast("Error occurred when opting contract into ASA");
    console.error(e);
  }
}
