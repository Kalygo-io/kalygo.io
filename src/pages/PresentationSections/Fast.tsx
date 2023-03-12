import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Col, Container, Row } from "react-bootstrap";

export function Fast() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="section section-sm bg-primary" id="fast" ref={ref}>
      <Container>
        <Row className="justify-content-center text-center text-white">
          <Col
            xs={12}
            style={{
              transform: isInView ? "none" : "translateX(-200px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <h1 className="fw-light mb-2">Fast</h1>
            <p className="mb-2">
              <span className="fw-bold">Less stress, more time for you</span>
            </p>
            <p>
              Block times differ amongst blockchains but can be as fast as ~3.6
              seconds
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
