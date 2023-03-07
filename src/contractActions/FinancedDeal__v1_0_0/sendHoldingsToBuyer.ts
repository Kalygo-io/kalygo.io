import algosdk from "algosdk";
import { AlgorandClient } from "../../services/algorand_client";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";

export async function sendHoldingsToBuyer(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  to: string
) {
  try {
    let params = await AlgorandClient.getAlgod(network)
      .getTransactionParams()
      .do();

    params.flatFee = true;
    params.fee = 1000;

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [
        new Uint8Array(Buffer.from("arbiter_withdraw_funds")),
        new Uint8Array(algosdk.decodeAddress(to).publicKey),
      ],
      [to],
      undefined,
      undefined,
      new Uint8Array(Buffer.from("Arbiter Sends Escrow To Buyer"))
    );

    let binaryTx = noOpTxn.toByte();
    let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
      binaryTx
    );

    console.log("address encoded", algosdk.decodeAddress(to));
    console.log(base64Tx);

    let signedTxs = await (window as any).AlgoSigner.signTxn([
      {
        txn: base64Tx,
      },
    ]);

    console.log("signedTxs", signedTxs);

    let sentTx = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: signedTxs[0].blob,
    });

    console.log("sentTx", sentTx);

    showSuccessToast("Request to send holdings to buyer sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending holding to receiver");
    console.error(e);
  }
}
