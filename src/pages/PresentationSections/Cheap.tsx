import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Col, Container, Row } from "react-bootstrap";

export function Cheap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="section section-sm" id="cheap" ref={ref}>
      <Container>
        <Row className="justify-content-end align-items-center">
          <Col
            lg={5}
            className="order-lg-2 mb-0 mb-lg-0 text-right"
            style={{
              transform: isInView ? "none" : "translateX(-200px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.4s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <h1>Cheap</h1>
            <p className="mb-2 lead fw-bold">Low Transaction Fees</p>
            <p className="mb-4">We'll match the lowest fees you can find</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
