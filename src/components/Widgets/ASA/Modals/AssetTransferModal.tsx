import { Col, Row, Card, Form, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import algosdk, { AtomicTransactionComposer, Transaction } from "algosdk";
import { RootState } from "../../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { AlgorandClient } from "../../../../services/algorand_client";
import { showErrorToast } from "../../../../utility/errorToast";
import { showSuccessToast } from "../../../../utility/successToast";

import { signerForAlgoSigner } from "../../../../contractActions/helpers/signers/AlgoSigner";
import { signerForPera } from "../../../../contractActions/helpers/signers/PeraSigner";
import { sendASA } from "../../../../contractActions/ASA/sendASA";
import {
  formatCurrency,
  formatNumber,
} from "../../../../components/Forms/helpers/formatCurrency";
import { FaFileSignature } from "react-icons/fa";

interface P {
  fungibletokenid: number;
  unitName: string;
  onHide: () => void;
  show: boolean;
}

export function AssetTransferModal(props: P) {
  const { fungibletokenid, onHide, unitName } = props;

  const settings = useAppSelector((state: RootState) => state.settings);

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

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      receiver: "FYGYHDTHJE2GNJEAKKESCCX7HTKZKY5TGJPBXNHLFNAMHVZMSODF5H4QVQ",
      amount: "1,000,000",
      note: "Your note here!",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      const { receiver, amount, note } = data;

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

      let parsedAmount = amount.replaceAll(",", "");
      parsedAmount = Number.parseInt(parsedAmount);

      // debugger;

      await sendASA(
        account.addr,
        fungibletokenid,
        settings.selectedAlgorandNetwork,
        atcSigner,
        receiver,
        parsedAmount,
        note
      );

      onHide();

      //   showSuccessToast("Created ASA successfully");
    } catch (e) {
      showErrorToast(
        "Something unexpected happened. Make sure your wallet is connected."
      );
      console.error(e);
    }
  };

  console.log("errors", errors);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Asset Transfer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h5 className="my-4">Transfer Info</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="receiver">
                <Form.Label>Receiver</Form.Label>
                <Form.Control
                  {...register("receiver", {
                    required: true,
                  })}
                  type="text"
                  placeholder=""
                  isInvalid={errors["receiver"] ? true : false}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  {...register("amount", {
                    required: true,
                  })}
                  inputMode="decimal"
                  pattern="^\d{1,3}(,\d{3})*"
                  placeholder=""
                  min="0"
                  isInvalid={errors["amount"] ? true : false}
                  onChange={(event) => {
                    let result = formatNumber(event.target.value, true);
                    setValue("amount", result);
                  }}
                />
              </Form.Group>
            </Col>

            <Col sm={6} className="mb-3">
              <Form.Group id="equity-divisions">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control disabled value={unitName} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="note">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  {...register("note", {
                    maxLength: 1024,
                  })}
                  as="textarea"
                  rows={4}
                  isInvalid={errors["note"] ? true : false}
                  type="string"
                  placeholder=""
                />
                <Form.Control.Feedback type="invalid">
                  {errors.note?.message || errors.note?.type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3 d-flex justify-content-end">
            <Button variant="success" type="submit">
              Sign <FaFileSignature />
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {/* <Modal.Footer> */}
      {/* <Button variant="danger" onClick={props.onHide}>
          Close
        </Button> */}
      {/* </Modal.Footer> */}
    </Modal>
  );
}
