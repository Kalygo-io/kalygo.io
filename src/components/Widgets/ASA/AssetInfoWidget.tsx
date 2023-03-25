import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { useParams } from "react-router-dom";

import {
  Col,
  Row,
  Card,
  ListGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import { MdArrowDropDown } from "react-icons/md";
import { RootState } from "../../../store/store";
import { AssetTransferModal } from "./Modals/AssetTransferModal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { parseGlobalState } from "../../../pages/customSelectors/appl/parseGlobalState";

import algosdk from "algosdk";

import { deleteASA } from "../../../contractActions/ASA/deleteASA";
import { optinToASA } from "../../../contractActions/ASA/optIn";
import { optoutToASA } from "../../../contractActions/ASA/optOut";

import { AlgorandClient } from "../../../services/algorand_client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const AssetDimensions = (props: { field: string; value: string }) => {
  const { field, value } = props;

  return (
    <ListGroup.Item className="px-0">
      <Row className="align-items-center">
        <Col className="col-auto">
          <h5 className="h5 mb-0">{field}</h5>
        </Col>
        <Col className="ms--2 truncate-text">
          <small className="mb-0">{value}</small>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

interface P {
  assetInfo: any;
  atcSigner: any;
  network: string;
  fungibleTokenId: number;
  fungibleTokenCreator: string;
  sender: string;
}

export const AssetInfoWidget = (props: P) => {
  let {
    assetInfo: app,
    atcSigner,
    network,
    fungibleTokenId,
    fungibleTokenCreator,
    sender,
  } = props;

  const settings = useAppSelector((state: RootState) => state.settings);
  const [modalShow, setModalShow] = React.useState(false);

  console.log("app.val", app.val);

  return (
    <>
      <Card border="light" className="shadow-sm">
        <Card.Header>
          <Row className="">
            <Col className="d-flex align-items-center">
              <span className="mb-0 display-4">
                Asset Info{" "}
                {get(app, "val.asset.index") ? (
                  <small>({get(app, "val.asset.index")}) </small>
                ) : null}
                &nbsp;
              </span>
              {/* <DropdownButton as={"span"} title="Actions" key="success"> */}
              <Dropdown>
                <Dropdown.Toggle variant="light">
                  {/* Actions */}
                  <MdArrowDropDown />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      console.log("sending...");
                      setModalShow(true);
                    }}
                  >
                    Send
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      // console.log("Opt-in");
                      console.log("Opt-in...");
                      optinToASA(sender, fungibleTokenId, network, atcSigner);
                    }}
                  >
                    Opt-in
                  </Dropdown.Item>
                  <Dropdown.Item
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
                  >
                    Opt-out
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      console.log("Delete");
                      deleteASA(sender, fungibleTokenId, network, atcSigner);
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* </DropdownButton> */}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <ListGroup className="list-group-flush list my--3">
            <Row>
              <Col>
                <AssetDimensions
                  field={"Name"}
                  value={get(app, "val.asset.params.name", "ø")}
                />
              </Col>
              <Col>
                <AssetDimensions
                  field={"Unit Name"}
                  value={get(app, "val.asset.params.unit-name", "ø")}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <AssetDimensions
                  field={"Supply"}
                  value={get(app, "val.asset.params.total", "ø")}
                />
              </Col>
              <Col>
                <AssetDimensions
                  field={"Decimals"}
                  value={get(app, "val.asset.params.decimals", "ø")}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <AssetDimensions
                  field={"URL"}
                  value={get(app, "val.asset.params.url", "ø")}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <AssetDimensions
                  field={"Creator"}
                  value={get(app, "val.asset.params.creator", "ø")}
                />
              </Col>
              <Col>
                <AssetDimensions
                  field={"Clawback"}
                  value={
                    get(app, "val.asset.params.clawback") ===
                    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
                      ? "ø"
                      : get(app, "val.asset.params.clawback", "ø")
                  }
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <AssetDimensions
                  field={"Manager"}
                  value={
                    get(app, "val.asset.params.manager") ===
                    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
                      ? "ø"
                      : get(app, "val.asset.params.manager", "ø")
                  }
                />
              </Col>
              <Col>
                <AssetDimensions
                  field={"Freeze"}
                  value={
                    get(app, "val.asset.params.freeze") ===
                    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
                      ? "ø"
                      : get(app, "val.asset.params.freeze", "ø")
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <AssetDimensions
                  field={"Reserve"}
                  value={
                    get(app, "val.asset.params.reserve") ===
                    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
                      ? "ø"
                      : get(app, "val.asset.params.reserve", "ø")
                  }
                />
              </Col>
            </Row>
          </ListGroup>
        </Card.Body>
      </Card>
      <AssetTransferModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        fungibletokenid={get(app, "val.asset.index")}
        unitName={get(app, "val.asset.params.unit-name", "ø")}
      />
    </>
  );
};
