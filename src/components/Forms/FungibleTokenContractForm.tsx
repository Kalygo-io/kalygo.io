import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import { Buffer } from "buffer";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AlgorandClient } from "../../services/algorand_client";
import algosdk, { AtomicTransactionComposer, Transaction } from "algosdk";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";

import { signerForAlgoSigner } from "../../contractActions/helpers/signers/AlgoSigner";
import { signerForPera } from "../../contractActions/helpers/signers/PeraSigner";

interface P {
  accounts: string[];
}

export const FungibleTokenContractForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      assetName: "Asset Name",
      totalSupply: 1,
      enableClawback: true,
      unitName: "USDCa",
      url: "URL",
    },
  });

  watch("totalSupply");

  let atcSigner:
    | ((unsignedTxns: Transaction[]) => Promise<Uint8Array[]>)
    | ((unsignedTxns: Transaction[], addr: string) => Promise<Uint8Array[]>);

  console.log("!!! -> !!!", settings.selectedAlgorandWallet);

  switch (settings.selectedAlgorandWallet) {
    case "AlgoSigner":
      atcSigner = signerForAlgoSigner;
      break;
    case "Pera":
      atcSigner = signerForPera;
      break;
  }

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      let params = await AlgorandClient.getAlgod(
        settings.selectedAlgorandNetwork
      )
        .getTransactionParams()
        .do();

      params.flatFee = true;
      params.fee = 1000;

      const account = {
        addr: settings.selectedAlgorandAccount,
      };

      const total = Number.parseInt(data.totalSupply); // how many of this asset there will be
      const decimals = 2; // units of this asset are whole-integer amounts
      const assetName = data.assetName;
      const unitName = data.unitName;
      const url = data.url;

      const defaultFrozen = false; // whether accounts should be frozen by default

      // Create a transaction
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: account.addr,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: url,
        assetMetadataHash: "",
        defaultFrozen,

        freeze: account.addr,
        manager: account.addr,
        clawback: account.addr,
        reserve: account.addr,

        suggestedParams: params,
      });
      const tws = {
        txn: txn,
        signer: atcSigner,
      };
      let atc = new AtomicTransactionComposer();
      // @ts-ignore
      atc.addTransaction(tws);
      const tx_id = await atc.submit(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork)
      );

      showSuccessToast("ASA creation request sent to network!");

      showSuccessToast("Awaiting block confirmation...");

      await algosdk.waitForConfirmation(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork),
        tx_id[0],
        32
      );

      showSuccessToast("Created ASA successfully");

      navigate(`/dashboard/transactions`);
    } catch (e) {
      showErrorToast(
        "Something unexpected happened. Make sure your wallet is connected."
      );
      console.error(e);
    }
  };

  console.log("errors", errors);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h5 className="my-4">Fields</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="assetName">
                <Form.Label>Asset Name</Form.Label>
                <Form.Control
                  {...register("assetName", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Asset Name"
                />
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-0">
              <Form.Group id="equity-divisions">
                <Form.Label>Total Supply</Form.Label>
                <Form.Control
                  {...register("totalSupply", { required: true })}
                  type="number"
                  placeholder="Total Supply"
                />

                <p>
                  One unit of this token would represent a{" "}
                  {100 / getValues("totalSupply")}% stake
                </p>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="unit-name">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control
                  {...register("unitName", {
                    required: true,
                    maxLength: { value: 8, message: "maxLength is 8" },
                  })}
                  isInvalid={errors["unitName"] ? true : false}
                  type="string"
                  placeholder="Unit Name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.unitName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="url">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  {...register("url", {
                    required: true,
                  })}
                  type="text"
                  placeholder="URL"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
