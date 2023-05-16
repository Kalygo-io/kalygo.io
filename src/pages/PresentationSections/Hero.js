import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RoutesData } from "../../routes";

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      className="section-header overflow-hidden pt-5 pt-lg-6 pb-5 pb-lg-6 bg-primary text-white"
      id="home"
      ref={ref}
    >
      <Container>
        <Row>
          <Col
            xs={12}
            className="text-center"
            style={{
              transform: isInView ? "none" : "translateX(-200px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <div className="react-big-icon d-none d-lg-block">
              <span className="fab fa-react"></span>
            </div>
            <h1 className="fw-bolder text-secondary display-1 display-1-md mb-0 ls-6">
              KALYGO
            </h1>
            <h3 style={{ color: "#ecb32c" }}>Contracts for the Masses</h3>
            <div className="d-flex align-items-center justify-content-center py-2">
              <Button
                variant="secondary"
                size="lg"
                as={Link}
                to={RoutesData.DashboardOverview.path}
                className="text-dark me-3"
              >
                Enter App
                {/* <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="d-none d-sm-inline ms-1"
                  /> */}
              </Button>
            </div>
            {/* <div>
                <FontAwesomeIcon
                  style={{ height: 148, width: 148 }}
                  icon={faHive}
                  className="d-block mx-auto py-0 px-4"
                />
              </div> */}
          </Col>
        </Row>
      </Container>
    </section>
  );
}
