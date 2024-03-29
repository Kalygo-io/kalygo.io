import { useEffect, useState, useRef } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import { Buffer } from "buffer";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import get from "lodash/get";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AlgorandClient } from "../../services/algorand_client";
import { compileProgram } from "../../ABI/utility/compileProgram";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";

import { formatCurrency } from "./helpers/formatCurrency";
import { supportedStablecoins } from "./helpers/supportedStablecoins";

import ABI from "../../contractExports/contracts/escrow/application.json";
import { signerForAlgoSigner } from "../../contractActions/helpers/signers/AlgoSigner";
import { signerForPera } from "../../contractActions/helpers/signers/PeraSigner";

interface P {
  accounts: string[];
}

export const CashBuyContractForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const navigate = useNavigate();

  const inputElInspStartDate = useRef<Datetime>(null);
  const inputElInspEndDate = useRef<Datetime>(null);
  const inputElInspExtDate = useRef<Datetime>(null);
  const inputElCloseDate = useRef<Datetime>(null);
  const inputElCloseExtDate = useRef<Datetime>(null);

  const dtInputs = [
    inputElInspStartDate,
    inputElInspEndDate,
    inputElInspExtDate,
    inputElCloseDate,
    inputElCloseExtDate,
  ];

  const [asset, setAsset] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  let defaultASAid = "23";
  switch (settings.selectedAlgorandNetwork) {
    case "MainNet":
      defaultASAid = "31566704";
      break;
    case "TestNet":
      defaultASAid = "10458941";
      break;
  }

  const {
    register,
    trigger,
    watch,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      escrowAmount1: "$1,000.00",
      escrowAmount2: "$1,000.00",
      escrowTotal: "$2,000.00",
      // asaId: 95939489,
      asaId: defaultASAid,
      customAsaId: "",
      inspectPeriodStart: moment().add("0", "m").add("15", "s").toString(),
      inspectPeriodEnd: moment().add("0", "m").add("30", "s").toString(),
      inspectPeriodExtension: moment().add("0", "m").add("45", "s").toString(),
      movingDate: moment().add("1", "m").add("0", "s").toString(),
      closingDate: moment().add("1", "m").add("15", "s").toString(),
      closingDateExtension: moment().add("1", "m").add("30", "s").toString(),
      // inspectPeriodStart: moment().add("1", "m").toString(),
      // inspectPeriodEnd: moment().add("2", "m").toString(),
      // inspectPeriodExtension: moment().add("3", "m").toString(),
      // movingDate: moment().add("4", "m").toString(),
      // closingDate: moment().add("5", "m").toString(),
      // closingDateExtension: moment().add("6", "m").toString(),
      buyer: settings.selectedAlgorandAccount,
      seller: settings.selectedAlgorandAccount,
      // titleCompany:
      //   "A3326WI7EK3RVOQ4JRZSLY3HO26JCVGT7HGU2RBBFAX3KOVG4XFA4XCTOQ",
      propertyAddress: "3717 Royal Palm Ave.",
      propertyName: "Yellow House On Mid Miami Beach",
      enableTimeChecks: true,
    },
  });

  const asaId = watch("asaId");
  const customAsaId = watch("customAsaId");

  // console.log("asaId", asaId);
  // console.log("--->>>", asaId === "-1");

  useEffect(() => {
    async function fetch() {
      try {
        console.log("asaId", asaId);
        console.log("customAsaId", customAsaId);

        let assetInfo = await AlgorandClient.getIndexer(
          settings.selectedAlgorandNetwork
        )
          .searchForAssets()
          .index(
            asaId === "-1"
              ? Number.parseInt(customAsaId)
              : Number.parseInt(asaId)
          )
          .do();

        setAsset({
          val: assetInfo,
          loading: false,
          error: null,
        });
      } catch (e) {
        console.log("e", e);

        showErrorToast("Error when fetching ASA metadata");

        setAsset({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, [asaId, customAsaId]);

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      const {
        buyer,
        seller,
        escrowAmount1,
        escrowAmount2,
        escrowTotal,
        inspectPeriodStart,
        inspectPeriodEnd,
        inspectPeriodExtension,
        closingDate,
        closingDateExtension,
        enableTimeChecks,
        asaId,
        customAsaId,
      } = data;

      const assetDecimalsConfig = get(asset, "val.assets.0.params.decimals");

      console.log("assetDecimalsConfig --->", assetDecimalsConfig);

      if (!assetDecimalsConfig) throw "Error accessing Asset Config";

      let escrowAmount1AsInt = escrowAmount1;
      try {
        escrowAmount1AsInt =
          Number(escrowAmount1.replace(/[^0-9.-]+/g, "")) *
          Math.pow(10, assetDecimalsConfig);
      } catch (e) {
        console.error(e);
      }
      let escrowAmount2AsInt = escrowAmount2;
      try {
        escrowAmount2AsInt =
          Number(escrowAmount2.replace(/[^0-9.-]+/g, "")) *
          Math.pow(10, assetDecimalsConfig);
      } catch (e) {
        console.error(e);
      }
      let escrowTotalAsInt = escrowTotal;
      try {
        escrowTotalAsInt =
          Number(escrowTotal.replace(/[^0-9.-]+/g, "")) *
          Math.pow(10, assetDecimalsConfig);
      } catch (e) {
        console.error(e);
      }

      const contract = new algosdk.ABIContract(ABI.contract);
      let atc = new AtomicTransactionComposer();
      let params = await AlgorandClient.getAlgod(
        settings.selectedAlgorandNetwork
      )
        .getTransactionParams()
        .do();

      let onComplete = algosdk.OnApplicationComplete.NoOpOC;

      let a_prog = await compileProgram(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork),
        Buffer.from(ABI.source.approval, "base64").toString()
      );
      let c_prog = await compileProgram(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork),
        Buffer.from(ABI.source.clear, "base64").toString()
      );

      let atcSigner;

      switch (settings.selectedAlgorandWallet) {
        case "AlgoSigner":
          atcSigner = signerForAlgoSigner;
          break;
        case "Pera":
          atcSigner = signerForPera;
          break;
      }

      atc.addMethodCall({
        appID: 0,
        method: contract.getMethodByName("create"),
        methodArgs: [
          buyer, // glbl_buyer: "",
          seller, // glbl_seller: "",
          Math.floor(escrowAmount1AsInt), // glbl_escrow_1: "",
          Math.floor(escrowAmount2AsInt), // glbl_escrow_2: "",
          Math.floor(escrowTotalAsInt), // glbl_total: "",
          moment(inspectPeriodStart).unix(), // glbl_inspect_start_date: "",
          moment(inspectPeriodEnd).unix(), // glbl_inspect_end_date: "",
          moment(inspectPeriodExtension).unix(), // glbl_inspect_extension_date: "",
          moment(closingDate).unix(), // glbl_closing_date: "",
          moment(closingDateExtension).unix(), // glbl_free_funds_date: "",
          asaId === "-1" ? Math.floor(customAsaId) : Number.parseInt(asaId), // glbl_asa_id: ""
        ] as ABIArgument[],
        approvalProgram: a_prog,
        clearProgram: c_prog,
        numGlobalByteSlices: 5,
        numGlobalInts: 13,
        numLocalByteSlices: 0,
        numLocalInts: 0,
        sender: settings.selectedAlgorandAccount,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
        // signer: signerForAlgoSigner,
        // @ts-ignore
        signer: atcSigner,
        onComplete: onComplete,
        extraPages: 1,
      });

      const tx_id = await atc.submit(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork)
      );

      console.log("submit_response", tx_id);

      showSuccessToast("Contract creation request sent to network!");
      showSuccessToast("Awaiting block confirmation...");
      await algosdk.waitForConfirmation(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork),
        tx_id[0],
        32
      );

      navigate(`/dashboard/transactions`);
    } catch (e) {
      showErrorToast(
        "Something unexpected happened. Make sure your wallet is connected."
      );
      console.error(e);
    }
  };

  console.log("errors", errors);
  // console.log("isValid", isValid);

  // console.log("asaId", asaId);
  // console.log("asaId ===", asaId === "-1");
  console.log("->", settings.selectedAlgorandWallet);

  let stablecoinOptions =
    supportedStablecoins.Algorand[settings.selectedAlgorandNetwork] || [];

  // console.log("stablecoinOptions", stablecoinOptions);

  function closeOtherCalendars(currentCal: string) {
    dtInputs.forEach((i) => {
      if (i.current!.props.className !== currentCal) {
        // @ts-ignore
        i.current!._closeCalendar();
      }
    });
  }

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)} id="cash-buy-contract-form">
          <h5 className="mb-4">Contract Details</h5>
          <Row>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-amount-1">
                <Form.Label>Earnest Payment</Form.Label>
                <Form.Control
                  {...register("escrowAmount1", { required: true })}
                  inputMode="decimal"
                  pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                  placeholder="Amount 1"
                  isInvalid={errors["escrowAmount1"] ? true : false}
                  onBlur={(event) => {
                    let result = formatCurrency(event.target, true);
                    setValue("escrowAmount1", result.input_val);
                    trigger("escrowTotal");
                  }}
                  onChange={(event) => {
                    let result = formatCurrency(event.target, false, false);
                    console.log("-> result.input_val ->", result.input_val);
                    setValue("escrowAmount1", result.input_val);

                    event.target.setSelectionRange(
                      result.caret_pos,
                      result.caret_pos
                    );
                  }}
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-amount-2">
                <Form.Label>2nd Payment</Form.Label>
                <Form.Control
                  {...register("escrowAmount2", { required: true })}
                  inputMode="decimal"
                  pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                  placeholder="Amount 2"
                  isInvalid={errors["escrowAmount2"] ? true : false}
                  onBlur={(event) => {
                    let result = formatCurrency(event.target, true);
                    setValue("escrowAmount2", result.input_val);
                    trigger("escrowTotal");
                  }}
                  onChange={(event) => {
                    let result = formatCurrency(event.target, false, false);
                    setValue("escrowAmount2", result.input_val);

                    event.target.setSelectionRange(
                      result.caret_pos,
                      result.caret_pos
                    );
                  }}
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-total">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  {...register("escrowTotal", {
                    required: true,
                    validate: (value, formValues) => {
                      console.log("value", value);
                      console.log("formValues", formValues);
                      let escrowAmount1AsInt;
                      try {
                        escrowAmount1AsInt = Math.floor(
                          Number(
                            formValues.escrowAmount1.replace(/[^0-9.-]+/g, "")
                          ) * 100
                        );
                      } catch (e) {}
                      let escrowAmount2AsInt;
                      try {
                        escrowAmount2AsInt = Math.floor(
                          Number(
                            formValues.escrowAmount2.replace(/[^0-9.-]+/g, "")
                          ) * 100
                        );
                      } catch (e) {}
                      let escrowTotalAsInt;
                      try {
                        escrowTotalAsInt = Math.floor(
                          Number(
                            formValues.escrowTotal.replace(/[^0-9.-]+/g, "")
                          ) * 100
                        );
                      } catch (e) {}

                      console.log(
                        "--->>>",
                        escrowAmount1AsInt,
                        escrowAmount2AsInt,
                        escrowTotalAsInt
                      );

                      if (
                        escrowAmount1AsInt &&
                        escrowAmount2AsInt &&
                        escrowAmount1AsInt + escrowAmount2AsInt ===
                          escrowTotalAsInt
                      ) {
                        return true;
                      } else {
                        return "Escrow ≠ Total";
                      }
                    },
                  })}
                  inputMode="decimal"
                  pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                  placeholder="Total Price"
                  isInvalid={errors["escrowTotal"] ? true : false}
                  onBlur={(event) => {
                    let result = formatCurrency(event.target, true);
                    setValue("escrowTotal", result.input_val);
                    trigger("escrowTotal");
                  }}
                  onChange={(event) => {
                    let result = formatCurrency(event.target, false, false);
                    setValue("escrowTotal", result.input_val);

                    event.target.setSelectionRange(
                      result.caret_pos,
                      result.caret_pos
                    );
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.escrowTotal?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col sm={12} className="mb-3">
              <Form.Group id="asaId">
                <Form.Label>Stablecoin</Form.Label>
                {/* <Form.Control
                  {...register("asaId", {
                    required: true,
                  })}
                  type="number"
                  placeholder="ASA id"
                /> */}
                <Form.Select
                  {...register("asaId", { required: true })}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                  onFocus={() => {
                    // @ts-ignore
                    inputElInspStartDate.current!._closeCalendar();
                  }}
                >
                  {stablecoinOptions.map((i: any, idx: number) => {
                    return (
                      <option
                        key={i.symbol}
                        style={{
                          textOverflow: "ellipsis",
                        }}
                        value={i.tokenId}
                      >
                        {i.symbol}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {asaId === "-1" && (
            <Row className="align-items-center">
              <Col sm={12} className="mb-3">
                <Form.Group id="customAsaId">
                  <Form.Label>Custom ASA</Form.Label>
                  <Form.Control
                    {...register("customAsaId", {
                      required: true,
                    })}
                    type="number"
                    min={0}
                    placeholder="ASA"
                    onFocus={() => {
                      // @ts-ignore
                      inputElInspStartDate.current!._closeCalendar();
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="inspect-period-start">
                <Form.Label>Inspection Period Start</Form.Label>
                <Datetime
                  className="inspectPeriodStart"
                  timeFormat={false}
                  input={true}
                  ref={inputElInspStartDate}
                  onChange={(e: any) => {
                    e = moment(e.unix() * 1000 + 1000 * 60 * 60 * 24 - 1);
                    setValue("inspectPeriodStart", e.toString());
                  }}
                  renderInput={(props, openCalendar, closeCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectPeriodStart", {
                          required: true,
                        })}
                        type="text"
                        inputMode="none"
                        value={getValues("inspectPeriodStart")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                          closeOtherCalendars("inspectPeriodStart");
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="inspect-period-end">
                <Form.Label>Inspection Period End</Form.Label>
                <Datetime
                  className="inspectPeriodEnd"
                  timeFormat={true}
                  ref={inputElInspEndDate}
                  onChange={(e: any) => {
                    e = moment(e.unix() * 1000 + 1000 * 60 * 60 * 24 - 1);
                    setValue("inspectPeriodEnd", e.toString());
                  }}
                  renderInput={(props, openCalendar, closeCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectPeriodEnd", {
                          required: true,
                        })}
                        type="text"
                        inputMode="none"
                        value={getValues("inspectPeriodEnd")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                          closeOtherCalendars("inspectPeriodEnd");
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="inspect-period-end">
                <Form.Label>Inspection Period Extension</Form.Label>
                <Datetime
                  className="inspectPeriodExtension"
                  timeFormat={true}
                  ref={inputElInspExtDate}
                  onChange={(e: any) => {
                    e = moment(e.unix() * 1000 + 1000 * 60 * 60 * 24 - 1);
                    setValue("inspectPeriodExtension", e.toString());
                  }}
                  renderInput={(props, openCalendar, closeCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectPeriodExtension", {
                          required: true,
                        })}
                        type="text"
                        inputMode="none"
                        value={getValues("inspectPeriodExtension")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                          closeOtherCalendars("inspectPeriodExtension");
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="closing-date">
                <Form.Label>Closing Date</Form.Label>
                <Datetime
                  className="closingDate"
                  timeFormat={true}
                  ref={inputElCloseDate}
                  onChange={(e: any) => {
                    e = moment(e.unix() * 1000 + 1000 * 60 * 60 * 24 - 1);
                    setValue("closingDate", e.toString());
                  }}
                  renderInput={(props, openCalendar, closeCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("closingDate", {
                          required: true,
                        })}
                        type="text"
                        inputMode="none"
                        value={getValues("closingDate")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                          closeOtherCalendars("closingDate");
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="closing-date">
                <Form.Label>Closing Date Extension</Form.Label>
                <Datetime
                  className="closingDateExtension"
                  timeFormat={true}
                  ref={inputElCloseExtDate}
                  onChange={(e: any) => {
                    e = moment(e.unix() * 1000 + 1000 * 60 * 60 * 24 - 1);
                    setValue("closingDateExtension", e.toString());
                  }}
                  renderInput={(props, openCalendar, closeCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("closingDateExtension", {
                          required: true,
                        })}
                        type="text"
                        inputMode="none"
                        value={getValues("closingDateExtension")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                          closeOtherCalendars("closingDateExtension");
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="my-4">Roles</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="buyer">
                <Form.Label>Buyer</Form.Label>
                <Form.Control
                  {...register("buyer", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Buyer Wallet Address"
                  onFocus={() => {
                    closeOtherCalendars("");
                  }}
                />
              </Form.Group>
            </Col>
            <Col sm={12} className="mb-3">
              <Form.Group id="seller">
                <Form.Label>Seller</Form.Label>
                <Form.Control
                  {...register("seller", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Seller Wallet Address"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3 d-flex justify-content-end">
            <Button variant="success" type="submit">
              Create Contract
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
