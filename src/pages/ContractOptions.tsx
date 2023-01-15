import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { RoutesData } from "../routes";

import { useNavigate } from "react-router-dom";

export default function ContractOptions() {
  let navigate = useNavigate();

  return (
    <div className="py-4">
      <Row>
        {[
          {
            title: "Financed Deal",
            desc: "Buyer purchases property via lender financing",
            pathTo: RoutesData.NewFinanceDealContract.path,
            disabled: false,
          },
          {
            title: "REIT",
            desc: "Vehicle for decentralized equity stakes in properties and/or communities. NFT holders paid out monthly as per the terms of the property management company.",
            pathTo: RoutesData.NewPropertyNFT.path,
            disabled: true,
          },
          {
            title: "Cash Buy",
            desc: "Buyer purchases property with 100% 'cash'",
            pathTo: RoutesData.CashBuy.path,
            disabled: false,
          },
        ].map((i, idx) => {
          return (
            <Col key={i.title} xs={12} sm={6} xl={4} className="mb-4">
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{i.title}</Card.Title>
                  <Card.Text>{i.desc}</Card.Text>
                  <Button
                    disabled={i.disabled}
                    variant="primary"
                    onClick={() => {
                      i.pathTo && navigate(i.pathTo);
                    }}
                  >
                    Create
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
