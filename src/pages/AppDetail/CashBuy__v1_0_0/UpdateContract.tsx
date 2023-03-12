import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button, Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { formatCurrency } from "../../../components/Forms/helpers/formatCurrency";
import { Buffer } from "buffer";
import { supportedStablecoins } from "../../../components/Forms/helpers/supportedStablecoins";
import { RootState } from "../../../store/store";
import moment from "moment-timezone";
import { parseGlobalState } from "../../customSelectors/appl/parseGlobalState";
import { AlgorandClient } from "../../../services/algorand_client";

import ABI from "../../../contractExports/contracts/cashBuy/application.json";
import { signerForAlgoSigner } from "../../../contractActions/helpers/signers/AlgoSigner";

import { showErrorToast } from "../../../utility/errorToast";
import { showSuccessToast } from "../../../utility/successToast";
import { supportedContracts } from "../../../data/supportedContracts";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
  decodeUint64,
  ABIType,
} from "algosdk";
import { ProposedRevisionDiff } from "./UpdateContractComponents/ProposedRevisionDiff";
import { UpdateContractForm } from "./UpdateContractComponents/UpdateContractForm";

export function UpdateContract() {
  const [state, setState] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      buyer: "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY",
      seller: "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY",
      escrowAmount1: "$100,000.00",
      escrowAmount2: "$100,000.00",
      escrowTotal: "$200,000.00",
    },
  });

  useEffect(() => {
    async function fetch() {
      try {
        // STEP 1
        const appResponse = await AlgorandClient.getIndexer(
          settings.selectedAlgorandNetwork
        )
          .lookupApplications(Number.parseInt(id!))
          .do();

        const parsedGlobalState = parseGlobalState(
          appResponse?.application?.params &&
            appResponse.application.params["global-state"]
        );

        console.log("parsedGlobalState --->", parsedGlobalState);

        // STEP 2
        let assetInfo = await AlgorandClient.getIndexer(
          settings.selectedAlgorandNetwork
        )
          .searchForAssets()
          .index(get(parsedGlobalState, "glbl_asa_id"))
          .do();

        // STEP 3 - Get Buyer Proposed Revision
        let buyerDecodedBoxValue = null;
        try {
          let buyerBox = "buyer_updt";
          let buyerBoxValue = await AlgorandClient.getAlgod(
            settings.selectedAlgorandNetwork
          )
            .getApplicationBoxByName(
              Number.parseInt(id!),
              new Uint8Array(Buffer.from(buyerBox || "", "utf8"))
            )
            .do();

          console.log("boxValue", buyerBoxValue);

          buyerDecodedBoxValue = ABIType.from(
            "(address,address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)"
          ).decode(buyerBoxValue.value);

          console.log("buyer decodedBoxValue", buyerDecodedBoxValue);
        } catch (e) {}

        // STEP 4 - Get Seller Proposed Revision
        let sellerDecodedBoxValue = null;
        try {
          let sellerBox = "seller_updt";
          let sellerBoxValue = await AlgorandClient.getAlgod(
            settings.selectedAlgorandNetwork
          )
            .getApplicationBoxByName(
              Number.parseInt(id!),
              new Uint8Array(Buffer.from(sellerBox || "", "utf8"))
            )
            .do();

          console.log("boxValue", sellerBoxValue);

          sellerDecodedBoxValue = ABIType.from(
            "(address,address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)"
          ).decode(sellerBoxValue.value);

          console.log("seller decodedBoxValue", sellerDecodedBoxValue);
        } catch (e) {}

        setState({
          val: {
            contractGlobalState: parsedGlobalState,
            assetInfo: assetInfo,
            buyerProposedEdit: buyerDecodedBoxValue,
            sellerProposedEdit: sellerDecodedBoxValue,
          },
          loading: false,
          error: null,
        });
      } catch (e) {
        console.log("e", e);

        setState({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  console.log("updateContract component state", state);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Revise Contract</h1>
      </div>
      <Accordion defaultActiveKey="2" alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Last Seller Proposed Revision</Accordion.Header>
          <Accordion.Body>
            <ProposedRevisionDiff
              role="seller"
              globalState={get(state, "val.contractGlobalState", null)}
              proposedRevision={get(state, "val.sellerProposedEdit", null)}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Last Buyer Proposed Revision</Accordion.Header>
          <Accordion.Body>
            <ProposedRevisionDiff
              role="buyer"
              globalState={get(state, "val.contractGlobalState", null)}
              proposedRevision={get(state, "val.buyerProposedEdit", null)}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Propose Revision</Accordion.Header>
          <Accordion.Body>
            <UpdateContractForm
              selectedAccount={settings.selectedAlgorandAccount}
              globalState={get(state, "val.contractGlobalState", null)}
              assetInfo={get(state, "val.assetInfo", null)}
              buyerProposedRevision={get(state, "val.buyerProposedEdit", null)}
              sellerProposedRevision={get(
                state,
                "val.sellerProposedEdit",
                null
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
