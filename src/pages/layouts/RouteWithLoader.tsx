import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import { Col, Row, Container, Navbar, Nav } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faYoutube,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import Preloader from "../../components/Preloader";

import { NavbarOGComponent } from "../components/NavbarOG";

export const RouteWithLoader = (props: any) => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NavbarOGComponent />
      <Preloader show={loaded ? false : true} />
      <Outlet />
      <footer className="footer py-4 bg-dark text-white">
        <Container>
          <Row className="align-items-center justify-content-center text-center">
            <Col xs={12} sm={4}>
              <ul className="d-flex flex-row justify-content-evenly py-2">
                <li>
                  <a href="https://www.instagram.com/kalygo.io">
                    <FontAwesomeIcon
                      style={{ height: 24, width: 24 }}
                      icon={faInstagram}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/channel/UCho0SXnGBfEabvHdvaaz9oQ">
                    <FontAwesomeIcon
                      style={{ height: 24, width: 24 }}
                      icon={faYoutube}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/kalygo_io">
                    <FontAwesomeIcon
                      style={{ height: 24, width: 24 }}
                      icon={faTwitter}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/kalygo">
                    <FontAwesomeIcon
                      style={{ height: 24, width: 24 }}
                      icon={faLinkedin}
                    />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Kalygo-io">
                    <FontAwesomeIcon
                      style={{ height: 24, width: 24 }}
                      icon={faGithub}
                    />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="d-flex flex-column text-center justify-content-center align-items-center py-2 text-accent">
                <span className="">
                  © Kalygo{" "}
                  <span className="current-year">
                    {new Date().getFullYear()}
                  </span>
                  . All rights reserved.
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="d-flex flex-row justify-content-evenly py-2 text-accent">
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/governance`);
                  }}
                >
                  Governance
                </span>
              </div>
            </Col>
            <Col xs={12}>
              <div className="d-flex flex-row justify-content-evenly py-2 text-accent">
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open("https://kalygo.io/Kalygo_Pitch_Deck.pdf");
                  }}
                >
                  Deck
                </span>
              </div>
            </Col>
            <Col xs={12}>
              <div className="d-flex flex-row justify-content-evenly py-2 text-accent text-center">
                <i>
                  Disclaimer: Blockchain services carry risks, and past
                  performance is not indicative of future results. Please do
                  your own research and consult with a blockchain or legal
                  advisor before making any decisions that may affect your
                  assets.
                </i>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};
