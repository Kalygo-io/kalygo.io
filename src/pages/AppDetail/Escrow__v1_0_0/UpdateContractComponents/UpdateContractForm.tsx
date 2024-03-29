import React, { useRef } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";
import Datetime from "react-datetime";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import get from "lodash/get";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { RootState } from "../../../../store/store";
import ABI from "../../../../contractExports/contracts/escrow/application.json";
import { signerForAlgoSigner } from "../../../../contractActions/helpers/signers/AlgoSigner";
import { signerForPera } from "../../../../contractActions/helpers/signers/PeraSigner";

import { showErrorToast } from "../../../../utility/errorToast";
import { showSuccessToast } from "../../../../utility/successToast";
import { supportedContracts } from "../../../../data/supportedContracts";
import { formatCurrency } from "../../../../components/Forms/helpers/formatCurrency";
import { Buffer } from "buffer";
import { supportedStablecoins } from "../../../../components/Forms/helpers/supportedStablecoins";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { AlgorandClient } from "../../../../services/algorand_client";
import moment from "moment-timezone";
import { Tooltip } from "./Tooltip";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
  decodeUint64,
} from "algosdk";

function moveDecimal(n: bigint, moveDecimalLeftBy: number) {
  console.log("--- moveDecimal ---", moveDecimalLeftBy);
  // var l = n.toString().length - 0;
  // var v = n / Math.pow(10, l);

  console.log("--n--", n);

  let b = BigInt(Math.pow(10, 6));
  let finalN = Number((n * BigInt(100)) / b) / 100;

  return finalN;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
});

interface P {
  selectedAccount: string;
  globalState: any;
  assetInfo: any;
  buyerProposedRevision: any;
  sellerProposedRevision: any;
}

export function UpdateContractForm(props: P) {
  const {
    globalState,
    assetInfo,
    buyerProposedRevision,
    sellerProposedRevision,
  } = props;

  const inputElInspStartDate = useRef<Datetime>(null);
  const inputElInspEndDate = useRef<Datetime>(null);
  const inputElInspExtDate = useRef<Datetime>(null);
  const inputElMoveDate = useRef<Datetime>(null);
  const inputElCloseDate = useRef<Datetime>(null);
  const inputElCloseExtDate = useRef<Datetime>(null);

  const dtInputs = [
    inputElInspStartDate,
    inputElInspEndDate,
    inputElInspExtDate,
    inputElMoveDate,
    inputElCloseDate,
    inputElCloseExtDate,
  ];

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
      buyer: "",
      seller: "",
      escrowAmount1: "",
      escrowAmount2: "",
      escrowTotal: "",
      inspectPeriodStart: "",
      inspectPeriodEnd: "",
      inspectPeriodExtension: "",
      movingDate: "",
      closingDate: "",
      closingDateExtension: "",
    },
  });

  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  let assetDecimals = get(assetInfo, "assets.0.params.decimals", 0);

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
        movingDate,
        closingDate,
        freeFundsDate,
      } = data;

      let escrowAmount1AsInt = escrowAmount1;
      try {
        escrowAmount1AsInt =
          Number(escrowAmount1.replace(/[^0-9.-]+/g, "")) *
          Math.pow(10, assetDecimals);
      } catch (e) {}
      let escrowAmount2AsInt = escrowAmount2;
      try {
        escrowAmount2AsInt =
          Number(escrowAmount2.replace(/[^0-9.-]+/g, "")) *
          Math.pow(10, assetDecimals);
      } catch (e) {}
      let escrowTotalAsInt = escrowTotal;
      try {
        escrowTotalAsInt =
          Number(escrowTotal.replace(/[^0-9.-]+/g, "")) *
          Math.pow(10, assetDecimals);
      } catch (e) {}

      const contract = new algosdk.ABIContract(ABI.contract);
      let atc = new AtomicTransactionComposer();
      let params = await AlgorandClient.getAlgod(
        settings.selectedAlgorandNetwork
      )
        .getTransactionParams()
        .do();

      console.log(
        "*** role ***",
        settings.selectedAlgorandAccount,
        globalState
      );

      let methodByName = ``;
      if (settings.selectedAlgorandAccount === get(globalState, `glbl_buyer`)) {
        methodByName = `buyer_request_contract_update`;
        // methodByName = `seller_request_contract_update`;
      } else if (
        settings.selectedAlgorandAccount === get(globalState, `glbl_seller`)
      ) {
        methodByName = `seller_request_contract_update`;
      } else {
        showErrorToast("Invalid Role");
        return;
      }

      console.log("methodByName", methodByName);

      let atcSigner: {
        (unsignedTxns: algosdk.Transaction[]): Promise<Uint8Array[]>;
        (unsignedTxns: algosdk.Transaction[]): Promise<Uint8Array[]>;
        (txnGroup: algosdk.Transaction[], indexesToSign: number[]): Promise<
          Uint8Array[]
        >;
      };

      switch (settings.selectedAlgorandWallet) {
        case "AlgoSigner":
          atcSigner = signerForAlgoSigner;
          break;
        case "Pera":
          atcSigner = signerForPera;
          break;
      }

      atc.addMethodCall({
        appID: Number.parseInt(id!),
        method: contract.getMethodByName(methodByName),
        methodArgs: [
          buyer, // glbl_buyer: "",
          seller, // glbl_seller: "",
          Math.floor(escrowAmount1AsInt), // glbl_escrow_1: "",
          Math.floor(escrowAmount2AsInt), // glbl_escrow_2: "",
          Math.floor(escrowTotalAsInt), // glbl_total: "",
          moment(inspectPeriodStart).unix(), // glbl_inspect_start_date: "",
          moment(inspectPeriodEnd).unix(), // glbl_inspect_end_date: "",
          moment(inspectPeriodExtension).unix(), // glbl_inspect_extension_date: "",
          moment(movingDate).unix(), // glbl_moving_date: "",
          moment(closingDate).unix(), // glbl_closing_date: "",
          moment(freeFundsDate).unix(), // glbl_free_funds_date: "",
          // asaId === "-1" ? Math.floor(customAsaId) : Number.parseInt(asaId), // glbl_asa_id: ""
        ] as ABIArgument[],
        sender: settings.selectedAlgorandAccount,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.escrow__v1_0_0)),
        signer: atcSigner!,
        boxes: [
          {
            appIndex: Number.parseInt(id!),
            name: new Uint8Array(Buffer.from("buyer_updt", "utf8")),
          },
          {
            appIndex: Number.parseInt(id!),
            name: new Uint8Array(Buffer.from("seller_updt", "utf8")),
          },
        ],
      });

      const tx_id = await atc.submit(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork)
      );

      console.log("submit_response", tx_id);

      showSuccessToast("Update contract request sent to network!");
      showSuccessToast("Awaiting block confirmation...");

      await algosdk.waitForConfirmation(
        AlgorandClient.getAlgod(settings.selectedAlgorandNetwork),
        tx_id[0],
        32
      );

      showSuccessToast("Proposed Revision request was successful...");
    } catch (e) {
      console.error(e);
      showErrorToast("Error occurred during revision request...");
    }
  };

  let role = ``;
  if (settings.selectedAlgorandAccount === get(globalState, `glbl_buyer`)) {
    role = `Buyer`;
    // role = `Seller`;
  } else if (
    settings.selectedAlgorandAccount === get(globalState, `glbl_seller`)
  ) {
    role = `Seller`;
  } else {
    role = "N/A";
  }

  console.log("globalState", globalState);
  console.log("assetInfo in Form", assetInfo);
  console.log("buyerProposedRevision", buyerProposedRevision);
  console.log("sellerProposedRevision", sellerProposedRevision);

  function closeOtherCalendars(currentCal: string) {
    dtInputs.forEach((i) => {
      if (i.current!.props.className !== currentCal) {
        // @ts-ignore
        i.current!._closeCalendar();
      }
    });
  }

  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Header>
          <Tooltip />
          Role: {role}
          <br />
          <Button
            variant="info"
            className="m-1"
            onClick={() => {
              if (globalState) {
                const escrow1FORMATTED = `$${formatter.format(
                  moveDecimal(
                    BigInt(globalState["glbl_escrow_1"]),
                    assetDecimals
                  )
                )}`;
                const escrow2FORMATTED = `$${formatter.format(
                  moveDecimal(
                    BigInt(globalState["glbl_escrow_2"]),
                    assetDecimals
                  )
                )}`;
                const escrowTotalFORMATTED = `$${formatter.format(
                  moveDecimal(BigInt(globalState["glbl_total"]), assetDecimals)
                )}`;

                reset({
                  buyer: globalState["glbl_buyer"],
                  seller: globalState["glbl_seller"],
                  escrowAmount1: escrow1FORMATTED,
                  escrowAmount2: escrow2FORMATTED,
                  escrowTotal: escrowTotalFORMATTED,
                  inspectPeriodStart: moment(
                    globalState["glbl_inspect_start_date"] * 1000
                  ).toString(),
                  inspectPeriodEnd: moment(
                    globalState["glbl_inspect_end_date"] * 1000
                  ).toString(),
                  inspectPeriodExtension: moment(
                    globalState["glbl_inspect_extension_date"] * 1000
                  ).toString(),
                  movingDate: moment(
                    globalState["glbl_moving_date"] * 1000
                  ).toString(),
                  closingDate: moment(
                    globalState["glbl_closing_date"] * 1000
                  ).toString(),
                  closingDateExtension: moment(
                    globalState["glbl_closing_extension_date"] * 1000
                  ).toString(),
                });
              } else {
                showErrorToast("Error loading current state");
              }
            }}
          >
            Load Current State
          </Button>
          <br />
          <Button
            variant="info"
            className="m-1"
            onClick={() => {
              if (buyerProposedRevision) {
                const escrow1FORMATTED = `$${formatter.format(
                  moveDecimal(BigInt(buyerProposedRevision[2]), assetDecimals)
                )}`;
                const escrow2FORMATTED = `$${formatter.format(
                  moveDecimal(BigInt(buyerProposedRevision[3]), assetDecimals)
                )}`;
                const escrowTotalFORMATTED = `$${formatter.format(
                  moveDecimal(BigInt(buyerProposedRevision[4]), assetDecimals)
                )}`;

                reset({
                  buyer: buyerProposedRevision[0],
                  seller: buyerProposedRevision[1],
                  escrowAmount1: escrow1FORMATTED,
                  escrowAmount2: escrow2FORMATTED,
                  escrowTotal: escrowTotalFORMATTED,
                  inspectPeriodStart: moment(
                    Number(buyerProposedRevision[5]) * 1000
                  ).toString(),
                  inspectPeriodEnd: moment(
                    Number(buyerProposedRevision[6]) * 1000
                  ).toString(),
                  inspectPeriodExtension: moment(
                    Number(buyerProposedRevision[7]) * 1000
                  ).toString(),
                  movingDate: moment(
                    Number(buyerProposedRevision[8]) * 1000
                  ).toString(),
                  closingDate: moment(
                    Number(buyerProposedRevision[9]) * 1000
                  ).toString(),
                  closingDateExtension: moment(
                    Number(buyerProposedRevision[10]) * 1000
                  ).toString(),
                });
              } else {
                showErrorToast("No Buyer Proposed Revision");
              }
            }}
          >
            Load Buyer Proposed Revision
          </Button>
          <br />
          <Button
            variant="info"
            className="m-1"
            onClick={() => {
              if (sellerProposedRevision) {
                const escrow1FORMATTED = `$${formatter.format(
                  moveDecimal(sellerProposedRevision[2], assetDecimals)
                )}`;
                const escrow2FORMATTED = `$${formatter.format(
                  moveDecimal(sellerProposedRevision[3], assetDecimals)
                )}`;
                const escrowTotalFORMATTED = `$${formatter.format(
                  moveDecimal(sellerProposedRevision[4], assetDecimals)
                )}`;

                reset({
                  buyer: sellerProposedRevision[0],
                  seller: sellerProposedRevision[1],
                  escrowAmount1: escrow1FORMATTED,
                  escrowAmount2: escrow2FORMATTED,
                  escrowTotal: escrowTotalFORMATTED,
                  inspectPeriodStart: moment(
                    Number(sellerProposedRevision[5]) * 1000
                  ).toString(),
                  inspectPeriodEnd: moment(
                    Number(sellerProposedRevision[6]) * 1000
                  ).toString(),
                  inspectPeriodExtension: moment(
                    Number(sellerProposedRevision[7]) * 1000
                  ).toString(),
                  movingDate: moment(
                    Number(sellerProposedRevision[8]) * 1000
                  ).toString(),
                  closingDate: moment(
                    Number(sellerProposedRevision[9]) * 1000
                  ).toString(),
                  closingDateExtension: moment(
                    Number(sellerProposedRevision[10]) * 1000
                  ).toString(),
                });
              } else {
                showErrorToast("No Seller Proposed Revision");
              }
            }}
          >
            Load Seller Proposed Revision
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={4} className="mb-3">
                <Form.Group id="escrow-amount-1">
                  <Form.Label>Escrow 1</Form.Label>
                  <Form.Control
                    {...register("escrowAmount1", { required: true })}
                    inputMode="decimal"
                    pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                    placeholder="Amount 1"
                    onBlur={(event) => {
                      let result = formatCurrency(event.target, true);
                      event.target.value = result.input_val;
                      setValue("escrowAmount1", result.input_val);
                      trigger("escrowTotal");
                    }}
                    onChange={(event) => {
                      let result = formatCurrency(event.target, false, false);
                      event.target.value = result.input_val;
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
                  <Form.Label>Escrow 2</Form.Label>
                  <Form.Control
                    {...register("escrowAmount2", { required: true })}
                    inputMode="decimal"
                    pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                    placeholder="Amount 2"
                    onBlur={(event) => {
                      let result = formatCurrency(event.target, true);
                      event.target.value = result.input_val;
                      setValue("escrowAmount2", result.input_val);
                      trigger("escrowTotal");
                    }}
                    onChange={(event) => {
                      let result = formatCurrency(event.target, false, false);
                      event.target.value = result.input_val;
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
                      // required: true,
                      validate: (value, formValues) => {
                        let escrowAmount1AsInt;
                        try {
                          escrowAmount1AsInt =
                            Number(
                              formValues.escrowAmount1.replace(/[^0-9.-]+/g, "")
                            ) * 100;
                        } catch (e) {}
                        let escrowAmount2AsInt;
                        try {
                          escrowAmount2AsInt =
                            Number(
                              formValues.escrowAmount2.replace(/[^0-9.-]+/g, "")
                            ) * 100;
                        } catch (e) {}
                        let escrowTotalAsInt;
                        try {
                          escrowTotalAsInt =
                            Number(
                              formValues.escrowTotal.replace(/[^0-9.-]+/g, "")
                            ) * 100;
                        } catch (e) {}

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
                      event.target.value = result.input_val;
                      setValue("escrowTotal", result.input_val);
                      trigger("escrowTotal");
                    }}
                    onChange={(event) => {
                      let result = formatCurrency(event.target, false, false);
                      event.target.value = result.input_val;
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
                <Form.Group id="buyerAddress">
                  <Form.Label>Buyer Address</Form.Label>
                  <Form.Control
                    {...register("buyer", {
                      required: true,
                    })}
                    type="text"
                    placeholder="Buyer Wallet Address"
                  />
                </Form.Group>
              </Col>
              <Col sm={12} className="mb-3">
                <Form.Group id="sellerAddress">
                  <Form.Label>Seller</Form.Label>
                  <Form.Control
                    {...register("seller", {
                      required: true,
                    })}
                    type="text"
                    placeholder="Seller Wallet Address"
                    onFocus={(e: any) => {
                      closeOtherCalendars("");
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col md={6} className="mb-3">
                <Form.Group id="inspect-period-start">
                  <Form.Label>Inspection Period Start</Form.Label>
                  <Datetime
                    className="inspectPeriodStart"
                    timeFormat={true}
                    ref={inputElInspStartDate}
                    onChange={(e: any) => {
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

            <div className="mt-3">
              <Button
                variant="primary"
                type="submit"
                onFocus={(e: any) => {
                  closeOtherCalendars("");
                }}
              >
                Update
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
