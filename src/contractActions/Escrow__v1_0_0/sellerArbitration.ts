import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/cashBuy/application.json";
import { signerForAlgoSigner } from "../helpers/signers/AlgoSigner";

export async function sellerArbitration(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  signer: any
) {
  try {
    console.log("_-_ sellerArbitration _-_");
    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let params = await AlgorandClient.getAlgod(network)
      .getTransactionParams()
      .do();
    params.flatFee = true;
    params.fee = 1000;
    atc.addMethodCall({
      appID: appId,
      method: contract.getMethodByName("seller_set_arbitration"),
      methodArgs: [] as ABIArgument[],
      sender: sender,
      suggestedParams: params,
      note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
      signer,
    });
    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast("Request to signal arbitration sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending signal arbitration request");
    console.error(e);
  }
}
