import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Col, Container, Row } from "react-bootstrap";

export function Secure() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="section section-sm" id="secure" ref={ref}>
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col
            lg={5}
            className="order-lg-2 mb-0 mb-lg-0"
            style={{
              transform: isInView ? "none" : "translateX(-200px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <h1>Secure</h1>
            <p className="mb-2 lead fw-bold">Audited and Community Vetted</p>
            <p className="mb-4">
              Kalygo prioritizes rigorously vetted contracts and excellent
              community experience
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
