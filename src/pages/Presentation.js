import React from "react";
import { Col, Row, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { RoutesData } from "../routes";
import { BgAnimation } from "./components/BgAnimation";
import { Hero } from "./PresentationSections/Hero";
import { Secure } from "./PresentationSections/Secure";
import { Fast } from "./PresentationSections/Fast";
import { Cheap } from "./PresentationSections/Cheap";

const Presentation = () => {
  const navigate = useNavigate();

  return (
    <>
      <Hero></Hero>
      <Secure></Secure>
      <Fast></Fast>
      <Cheap></Cheap>
      {/* <section
        className="section section-sm bg-primary pb-0"
        id="getting-started"
      >
        <Container>
          <Row className="justify-content-center text-center text-white">
            <Col xs={12}>
              <iframe
                src="https://kalygo.substack.com/embed"
                width="100%"
                height="320"
                style={{
                  border: "1px solid #EEE",
                  borderRadius: "10px",
                  background: "white",
                }}
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </Col>
          </Row>
        </Container>
      </section> */}
      <BgAnimation />
    </>
  );
};

export default Presentation;
