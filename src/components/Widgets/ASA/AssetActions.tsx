import React from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { deleteASA } from "../../../contractActions/ASA/deleteASA";
import { optinToASA } from "../../../contractActions/ASA/optIn";
import { optoutToASA } from "../../../contractActions/ASA/optOut";

import { FaFileSignature } from "react-icons/fa";
import { AssetTransferModal } from "./Modals/AssetTransferModal";

interface P {
  sender: string;
  fungibleTokenId: number;
  network: string;
  atcSigner: any;
  fungibleTokenCreator: string;
}

export function AssetActions(props: P) {
  let { sender, fungibleTokenId, network, atcSigner, fungibleTokenCreator } =
    props;

  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Card border="light" className="shadow-sm">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Asset Actions</h5>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body
          style={{
            textAlign: "center",
            // display: "flex",
            // justifyContent: "center",
          }}
        >
          <Button
            variant="danger"
            onClick={() => {
              deleteASA(sender, fungibleTokenId, network, atcSigner);
            }}
            className="m-1"
          >
            Delete
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              console.log("sending...");
              setModalShow(true);
            }}
            className="m-1"
          >
            Send
          </Button>
          <Button
            variant="success"
            onClick={() => {
              console.log("Opt-in...");
              optinToASA(sender, fungibleTokenId, network, atcSigner);
            }}
            className="m-1"
          >
            Opt-in
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log("Opt-out...");
              optoutToASA(
                sender,
                fungibleTokenId,
                network,
                atcSigner,
                fungibleTokenCreator
              );
            }}
            className="m-1"
          >
            Opt-out
          </Button>
        </Card.Body>
      </Card>
      <AssetTransferModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        fungibletokenid={fungibleTokenId}
      />
    </>
  );
}
