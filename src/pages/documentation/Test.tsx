import { PeraWalletConnect } from "@perawallet/connect";
import React, { useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import algosdk, { AtomicTransactionComposer, Transaction } from "algosdk";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { Algod } from "../../services/algod";

import { signerForPera } from "../../contractActions/helpers/signers/PeraSigner";
import { RootState } from "../../store/store";
import { PeraSession } from "../../services/peraSession";

type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;

export interface IScenarioTxn {
  txn: algosdk.Transaction;
  signers?: string[];
  authAddr?: string;
  message?: string;
}

export type ScenarioReturnType = {
  transaction: IScenarioTxn[][];
  transactionTimeout?: number;
};

// const peraWallet = new PeraWalletConnect({
//   // Default chainId is "4160"
//   chainId: 416002,
// });

const singlePayTxn = async (
  chain: AlgorandChainIDs,
  address: string
): Promise<ScenarioReturnType> => {
  const suggestedParams = await Algod.getAlgod("TestNet")
    .getTransactionParams()
    .do();

  suggestedParams.flatFee = true;
  suggestedParams.fee = 1000;

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: address,
    to: "KEFYFQDQ6EQCUJTHJWW6C2V7OXNCR4RI2ZDOHXHZ4K2E3SNR7ZFIGEMUB4",
    amount: 100000,
    note: new Uint8Array(Buffer.from("example note value")),
    suggestedParams,
  });

  const txnsToSign = [{ txn, message: "This is a transaction message" }];
  return {
    transaction: [txnsToSign],
  };
};

export function Test() {
  // Store account address which is connected dApp with Pera Wallet
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const settings = useAppSelector((state: RootState) => state.settings);
  // Check app is connected with Pera Wallet
  const isConnectedToPeraWallet = !!accountAddress;

  async function handleConnectWalletClick() {
    try {
      let accounts = await PeraSession.getPeraInstance(
        settings.selectedAlgorandNetwork
      )?.connect();

      setAccountAddress(accounts[0]);

      PeraSession.getPeraInstance(
        settings.selectedAlgorandNetwork
      )?.connector?.on("disconnect", handleDisconnectWalletClick);
    } catch (e) {}

    // peraWallet
    //   .connect()
    //   .then((newAccounts) => {
    //     // Setup the disconnect event listener
    //     peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

    //     setAccountAddress(newAccounts[0]);
    //   })
    //   .catch((error) => {
    //     // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
    //     // For the async/await syntax you MUST use try/catch
    //     if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
    //       // log the necessary errors
    //     }
    //   });
  }

  function handleDisconnectWalletClick() {
    PeraSession.getPeraInstance(settings.selectedAlgorandNetwork)?.disconnect();
    setAccountAddress(null);
  }

  return (
    <>
      <button
        onClick={
          isConnectedToPeraWallet
            ? handleDisconnectWalletClick
            : handleConnectWalletClick
        }
      >
        {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
      </button>
      <button
        onClick={async () => {
          let atcSigner = signerForPera;

          //   let params = await Algod.getAlgod(settings.selectedAlgorandNetwork)
          //     .getTransactionParams()
          //     .do();
          //   params.flatFee = true;
          //   params.fee = 1000;
          //   const account = {
          //     addr: settings.selectedAlgorandAccount,
          //   };
          //   const total = 100; // how many of this asset there will be
          //   const decimals = 2; // units of this asset are whole-integer amounts
          //   const assetName = "assetName";
          //   const unitName = "unitName";
          //   const url = "url";
          //   const defaultFrozen = false; // whether accounts should be frozen by default
          //   // Create a transaction
          //   const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
          //     from: account.addr,
          //     total,
          //     decimals,
          //     assetName,
          //     unitName,
          //     assetURL: url,
          //     assetMetadataHash: "",
          //     defaultFrozen,
          //     freeze: account.addr,
          //     manager: account.addr,
          //     clawback: account.addr,
          //     reserve: account.addr,
          //     suggestedParams: params,
          //   });

          const suggestedParams = await Algod.getAlgod("TestNet")
            .getTransactionParams()
            .do();

          suggestedParams.flatFee = true;
          suggestedParams.fee = 1000;

          const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: "MTUSAPRF4IN37AYD5OO2UUXFTDBU53IFYICMTTXA4BCH66MU7MWP5IBDFI",
            to: "KEFYFQDQ6EQCUJTHJWW6C2V7OXNCR4RI2ZDOHXHZ4K2E3SNR7ZFIGEMUB4",
            amount: 100000,
            note: new Uint8Array(Buffer.from("example note value")),
            suggestedParams,
          });

          const tws = {
            txn: txn,
            signer: atcSigner,
          };
          let atc = new AtomicTransactionComposer();
          // @ts-ignore
          atc.addTransaction(tws);

          console.log("atc", atc);

          const tx_id = await atc.submit(
            Algod.getAlgod(settings.selectedAlgorandNetwork)
          );

          showSuccessToast("Request sent to network!");

          showSuccessToast("Awaiting block confirmation...");

          await algosdk.waitForConfirmation(
            Algod.getAlgod(settings.selectedAlgorandNetwork),
            tx_id[0],
            32
          );

          showSuccessToast("Success!");
        }}
      >
        pay w/ ATC
      </button>
      <button
        onClick={async () => {
          const { transaction: txnsToSign } = await singlePayTxn(
            416002,
            "MTUSAPRF4IN37AYD5OO2UUXFTDBU53IFYICMTTXA4BCH66MU7MWP5IBDFI"
          );
          console.log("w/o ATC txnsToSign", txnsToSign);

          const transactions = txnsToSign.reduce(
            (acc, val) => acc.concat(val),
            []
          );

          console.log("w/o ATC transactions", transactions);

          const signedTransactions = await PeraSession.getPeraInstance(
            settings.selectedAlgorandNetwork
          )?.signTransaction([transactions]);

          const { txId } = await Algod.getAlgod(
            settings.selectedAlgorandNetwork
          )
            .sendRawTransaction(signedTransactions)
            .do();
        }}
      >
        pay w/o ATC
      </button>
    </>
  );
}
