import React from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { deleteASA } from "../../../contractActions/ASA/deleteASA";

interface P {
  sender: string;
  fungibleTokenId: number;
  network: string;
  atcSigner: any;
}

export function AssetActions(props: P) {
  let { sender, fungibleTokenId, network, atcSigner } = props;

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">Asset Actions</h5>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Button
          variant="danger"
          onClick={() => {
            deleteASA(sender, fungibleTokenId, network, atcSigner);
          }}
        >
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}
