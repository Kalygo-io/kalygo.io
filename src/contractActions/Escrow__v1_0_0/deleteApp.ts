import algosdk, {
  AtomicTransactionComposer,
  makeApplicationDeleteTxnFromObject,
  ABIArgument,
} from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { signerForAlgoSigner } from "../helpers/signers/AlgoSigner";
import ABI from "../../contractExports/contracts/escrow/application.json";
import { supportedContracts } from "../../data/supportedContracts";

export async function deleteApp(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  signer: any
) {
  try {
    console.log("deleteApp");

    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let params = await AlgorandClient.getAlgod(network)
      .getTransactionParams()
      .do();
    params.flatFee = true;
    params.fee = 1000;

    // Create a transaction
    const txn = makeApplicationDeleteTxnFromObject({
      appIndex: appId,
      from: sender,
      suggestedParams: params,
      note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
    });
    const tws = {
      txn: txn,
      signer: signer,
    };

    atc.addTransaction(tws);

    const tx_id = await atc.submit(AlgorandClient.getAlgod(network));
    console.log("submit_response", tx_id);

    showSuccessToast("Request to delete smart contract sent to network");

    await algosdk.waitForConfirmation(
      AlgorandClient.getAlgod(network),
      tx_id[0],
      32
    );

    showSuccessToast("Successfully deleted application");
  } catch (e) {
    showErrorToast("Error occurred when sending delete contract request");
    console.error(e);
  }
}
