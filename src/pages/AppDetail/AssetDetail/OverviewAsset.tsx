import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";

import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { AlgorandClient } from "../../../services/algorand_client";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "../../customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../../../components/ErrorBoundary";

import algosdk, { Transaction } from "algosdk";
import { HoldersTable } from "../../../components/Widgets/ASA/HoldersTable";
import { AssetInfoWidget } from "../../../components/Widgets/ASA/AssetInfoWidget";
import { AssetActions } from "../../../components/Widgets/ASA/AssetActions";

import { signerForAlgoSigner } from "../../../contractActions/helpers/signers/AlgoSigner";
import { signerForPera } from "../../../contractActions/helpers/signers/PeraSigner";

function OverviewAsset() {
  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();

  let signer: any = signerForAlgoSigner;

  console.log("!!! -> !!!", settings.selectedAlgorandWallet);
  switch (settings.selectedAlgorandWallet) {
    case "AlgoSigner":
      signer = signerForAlgoSigner;
      break;
    case "Pera":
      signer = signerForPera;
      break;
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-between flex-wrap flex-md-nowrap py-4"></div>
      <Row>
        <Col xs={12} className="mb-4">
          <AssetInfoWidget />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="mb-4">
          <HoldersTable />
        </Col>
      </Row>
      <Row>
        <Col xs={6} className="mb-4">
          <AssetActions
            sender={settings.selectedAlgorandAccount}
            fungibleTokenId={Number.parseInt(id!)}
            network={settings.selectedAlgorandNetwork}
            atcSigner={signer}
          />
        </Col>
      </Row>
    </>
  );
}

export default OverviewAsset;
