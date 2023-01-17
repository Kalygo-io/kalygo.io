import React from "react";
import { Card, Button } from "react-bootstrap";

import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { optinContractToASA } from "../../../contractActions/CashBuy__v1_0_0/optinContractToASA";
import { firstEscrowAmount } from "../../../contractActions/CashBuy__v1_0_0/1stEscrowAmount";
import { secondEscrowAmount } from "../../../contractActions/CashBuy__v1_0_0/2ndEscrowAmount";
import { buyerPullOut } from "../../../contractActions/CashBuy__v1_0_0/buyerPullOut";
import { buyerArbitration } from "../../../contractActions/CashBuy__v1_0_0/buyerArbitration";
import { sellerArbitration } from "../../../contractActions/CashBuy__v1_0_0/sellerArbitration";
import { withdrawEscrow } from "../../../contractActions/CashBuy__v1_0_0/withdrawEscrow";
import { withdrawBalance } from "../../../contractActions/CashBuy__v1_0_0/withdrawBalance";
import { deleteApp } from "../../../contractActions/CashBuy__v1_0_0/deleteApp";
import { fundMinimumBalance } from "../../../contractActions/CashBuy__v1_0_0/fundMinimumBalance";
import { optoutContractFromASA } from "../../../contractActions/CashBuy__v1_0_0/optoutContractFromASA";

interface P {
  creator: string;
  buyer: string;
  seller: string;
  operator: string;
  contractAddress: string;
  appId: number;
  firstEscrowAmount: number;
  secondEscrowAmount: number;
  fungibleTokenId: number;
  fungibleTokenBalance: number;
  balance: number;
  now: number;
  inspectionPeriodEnd: number;
  movingDate: number;
  closingDate: number;
  buyerPulloutFlag: number;
  buyerArbitrationFlag: number;
  sellerArbitrationFlag: number;
}

export const ActionsWidget = (props: P) => {
  const {
    creator,
    buyer,
    seller,
    operator,
    contractAddress,
    appId,
    firstEscrowAmount: escrowAmount1,
    secondEscrowAmount: escrowAmount2,
    fungibleTokenId,
    fungibleTokenBalance,
    balance,
    now,
    inspectionPeriodEnd,
    movingDate,
    closingDate,
    buyerPulloutFlag,
    buyerArbitrationFlag,
    sellerArbitrationFlag,
  } = props;

  const settings = useAppSelector((state: RootState) => state.settings);

  console.log("sellerArbitrationFlag ->", sellerArbitrationFlag);

  return (
    <Card border="light" className="text-center p-0 mb-4">
      <Card.Body className="">
        <Card.Title>Actions</Card.Title>
        {/* <Card.Subtitle className="fw-normal pb-4">Role Actions</Card.Subtitle> */}

        {operator === creator && <span>Buyer</span>}
        <br />
        {operator === buyer && (
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="m-1"
              onClick={() => {}}
            >
              Add Note
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="m-1"
              onClick={() => {}}
            >
              Send Custom Escrow Token Amount
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={balance >= 200000 || inspectionPeriodEnd < now}
              onClick={() => {
                fundMinimumBalance(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                );
              }}
            >
              Fund Minimum Balance
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={
                buyerPulloutFlag === 1 ||
                fungibleTokenBalance === -1 ||
                inspectionPeriodEnd < now ||
                fungibleTokenBalance >= escrowAmount1
              }
              onClick={() => {
                firstEscrowAmount(
                  settings.selectedAccount,
                  contractAddress,
                  fungibleTokenId,
                  settings.selectedNetwork,
                  escrowAmount1
                );
              }}
            >
              Send 1st Escrow
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={
                buyerPulloutFlag === 1 ||
                fungibleTokenBalance < 0 ||
                closingDate < now ||
                escrowAmount1 + escrowAmount2 <= fungibleTokenBalance
              }
              onClick={() => {
                secondEscrowAmount(
                  settings.selectedAccount,
                  contractAddress,
                  fungibleTokenId,
                  settings.selectedNetwork,
                  escrowAmount2
                );
              }}
            >
              Send 2nd Escrow
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="m-1"
              disabled={buyerPulloutFlag === 1 || closingDate < now}
              onClick={() => {
                buyerArbitration(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Arbitration
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="m-1"
              disabled={
                buyerPulloutFlag === 1 ||
                (!!now && !!inspectionPeriodEnd && now > inspectionPeriodEnd)
              }
              onClick={() => {
                buyerPullOut(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Pullout
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={buyerPulloutFlag < 1 || fungibleTokenBalance <= 0}
              onClick={() => {
                withdrawEscrow(
                  settings.selectedAccount,
                  appId,
                  fungibleTokenId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Withdraw ASA
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={
                (now <= inspectionPeriodEnd && fungibleTokenBalance >= 0) ||
                (now <= inspectionPeriodEnd && balance <= 0) ||
                (inspectionPeriodEnd < now && buyerPulloutFlag < 1) ||
                (inspectionPeriodEnd < now &&
                  buyerPulloutFlag === 1 &&
                  fungibleTokenBalance >= 0) ||
                (inspectionPeriodEnd < now &&
                  buyerPulloutFlag === 1 &&
                  (balance === 0 || fungibleTokenBalance < 0))
              }
              onClick={() => {
                withdrawBalance(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Withdraw Balance
            </Button>
            <Button
              variant="success"
              size="sm"
              className="m-1"
              disabled={
                (now <= inspectionPeriodEnd && balance < 200000) ||
                (now <= inspectionPeriodEnd && fungibleTokenBalance >= 0) ||
                (now <= inspectionPeriodEnd && buyerPulloutFlag === 1) ||
                (inspectionPeriodEnd < now && buyerPulloutFlag < 1) ||
                (inspectionPeriodEnd < now && buyerPulloutFlag === 1)
              }
              onClick={() => {
                optinContractToASA(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  fungibleTokenId,
                  200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                );
              }}
            >
              Optin to ASA
            </Button>
            <Button
              variant="info"
              size="sm"
              className="m-1"
              disabled={
                (now <= inspectionPeriodEnd && fungibleTokenBalance < 0) ||
                (now <= inspectionPeriodEnd && fungibleTokenBalance > 0) ||
                (now <= inspectionPeriodEnd && balance < 200000) ||
                (inspectionPeriodEnd < now && buyerPulloutFlag < 1) ||
                (inspectionPeriodEnd < now &&
                  buyerPulloutFlag === 1 &&
                  fungibleTokenBalance < 0)
              }
              onClick={() => {
                optoutContractFromASA(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  fungibleTokenId
                );
              }}
            >
              Optout from ASA
            </Button>
          </>
        )}
        <br />
        <br />
        {operator === buyer && <span>Seller</span>}
        <br />
        {operator === seller && (
          <>
            <Button
              variant="warning"
              size="sm"
              className="m-1"
              disabled={sellerArbitrationFlag === 1 || closingDate < now}
              onClick={() => {
                sellerArbitration(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Seller Arbitration
            </Button>
            <Button
              variant="secondary"
              disabled={
                buyerPulloutFlag === 1 ||
                buyerArbitrationFlag === 1 ||
                now <= closingDate ||
                (closingDate < now && fungibleTokenBalance <= 0)
              }
              size="sm"
              className="m-1"
              onClick={() => {
                withdrawEscrow(
                  settings.selectedAccount,
                  appId,
                  fungibleTokenId,
                  settings.selectedNetwork
                );
              }}
            >
              Seller Withdraw ASA
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={
                now <= closingDate ||
                (closingDate < now && fungibleTokenBalance >= 0) ||
                (closingDate < now && balance === 0) ||
                buyerPulloutFlag === 1
              }
              onClick={() => {
                withdrawBalance(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Seller Withdraw Balance
            </Button>
            <Button
              variant="info"
              size="sm"
              className="m-1"
              disabled={
                now <= closingDate ||
                buyerPulloutFlag === 1 ||
                fungibleTokenBalance < 0 ||
                (closingDate < now && fungibleTokenBalance > 0) ||
                (closingDate < now && balance < 200000)
              }
              onClick={() => {
                optoutContractFromASA(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  fungibleTokenId
                );
              }}
            >
              Optout from ASA
            </Button>
          </>
        )}
        <br />
        <br />
        {operator === creator && <span>Creator</span>}
        <br />
        {operator === creator && (
          <>
            <Button
              variant="danger"
              size="sm"
              className="m-1"
              disabled={balance > 0}
              onClick={() => {
                deleteApp(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Delete App
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
