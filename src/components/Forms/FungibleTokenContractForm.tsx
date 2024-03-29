import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AlgorandClient } from "../../services/algorand_client";
import algosdk, { AtomicTransactionComposer, Transaction } from "algosdk";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";

import { signerForAlgoSigner } from "../../contractActions/helpers/signers/AlgoSigner";
import { signerForPera } from "../../contractActions/helpers/signers/PeraSigner";

import {
  formatCurrency,
  formatNumber,
  formatNumberStandalone,
} from "./helpers/formatCurrency";

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
      totalSupply: "1,000,000",
      decimals: 2,
      enableClawback: true,
      unitName: "ASSET",
      url: "URL",
      manager: settings.selectedAlgorandAccount,
      freeze: settings.selectedAlgorandAccount,
      clawback: settings.selectedAlgorandAccount,
      reserve: settings.selectedAlgorandAccount,
    },
  });

  watch("totalSupply");

  let atcSigner:
    | ((unsignedTxns: Transaction[]) => Promise<Uint8Array[]>)
    | ((unsignedTxns: Transaction[], addr: string) => Promise<Uint8Array[]>);

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

      let parsedTotalSupply = data?.totalSupply?.replaceAll(",", "");
      parsedTotalSupply = Number.parseInt(parsedTotalSupply);

      // debugger;

      let total: any = Number.parseInt(parsedTotalSupply); // how many of this asset there will be

      if (
        BigInt(9007199254740992) <= BigInt(total) &&
        BigInt(total) <= BigInt(18446744073709550591)
      ) {
        total = BigInt(total);
      }

      const decimals = Number.parseInt(data.decimals); // units of this asset are whole-integer amounts
      const assetName = data.assetName;
      const unitName = data.unitName;
      const url = data.url;

      const defaultFrozen = false; // whether accounts should be frozen by default

      const txnObject: any = {
        from: settings.selectedAlgorandAccount,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: url,
        assetMetadataHash: "",
        defaultFrozen,
        suggestedParams: params,
      };

      if (data.freeze) txnObject.freeze = data.freeze;
      if (data.manager) txnObject.manager = data.manager;
      if (data.clawback) txnObject.clawback = data.clawback;
      if (data.reserve) txnObject.reserve = data.reserve;

      // Create a transaction
      const txn =
        algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject(txnObject);
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
                  placeholder=""
                  isInvalid={errors["assetName"] ? true : false}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="supply">
                <Form.Label>Supply</Form.Label>
                <Form.Control
                  {...register("totalSupply", {
                    required: true,
                    min: 0,
                    validate: (value, formValues) => {
                      let parsedTotalSupply: string | number =
                        value?.replaceAll(",", "");
                      parsedTotalSupply = Number.parseInt(parsedTotalSupply);

                      if (
                        0 <= parsedTotalSupply &&
                        parsedTotalSupply <= Number.MAX_SAFE_INTEGER
                      )
                        return true;
                      else if (
                        BigInt(9007199254740992) <= BigInt(parsedTotalSupply) &&
                        BigInt(parsedTotalSupply) <=
                          BigInt(18446744073709550591)
                      ) {
                        return true;
                      } else {
                        return "max exceeded";
                      }
                    },
                  })}
                  inputMode="numeric"
                  pattern="^\d{1,3}(,\d{3})*"
                  placeholder=""
                  min="0"
                  isInvalid={errors["totalSupply"] ? true : false}
                  onChange={(event) => {
                    console.log("CHANGING...");

                    let result = formatNumberStandalone(event.target, true);
                    setValue("totalSupply", result.input_val);

                    event.target.setSelectionRange(
                      result.caret_pos,
                      result.caret_pos
                    );
                  }}
                />
              </Form.Group>
            </Col>

            <Col sm={6} className="mb-3">
              <Form.Group id="equity-divisions">
                <Form.Label>Decimals</Form.Label>
                <Form.Control
                  {...register("decimals", { required: true })}
                  inputMode="decimal"
                  type="number"
                  placeholder=""
                  min="0"
                  isInvalid={errors["decimals"] ? true : false}
                />
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
                  placeholder=""
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
                  placeholder=""
                  isInvalid={errors["url"] ? true : false}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Manager</Form.Label>
                <Form.Control
                  {...register("manager")}
                  placeholder=""
                  type="text"
                />
              </Form.Group>
            </Col>

            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Freeze</Form.Label>
                <Form.Control
                  {...register("freeze")}
                  placeholder=""
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Clawback</Form.Label>
                <Form.Control
                  {...register("clawback")}
                  placeholder=""
                  type="text"
                />
              </Form.Group>
            </Col>

            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Reserve</Form.Label>
                <Form.Control
                  {...register("reserve")}
                  placeholder=""
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3 d-flex justify-content-end">
            <Button variant="success" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
