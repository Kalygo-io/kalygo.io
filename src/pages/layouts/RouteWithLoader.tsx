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
          {/* <hr className="bg-gray my-4" /> */}
          {/* <Row>
              <Col md={12}>
                <div className="d-flex text-center justify-content-center align-items-center">
                  <p>Kalygo is an open source platform</p>
                </div>
              </Col>
            </Row> */}
          <Row>
            <Col>
              <div className="d-flex flex-column text-center justify-content-center align-items-center py-2">
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
              <div className="d-flex flex-row justify-content-evenly py-2">
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
              <div className="d-flex flex-row justify-content-evenly py-2">
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
          </Row>
        </Container>
      </footer>
    </>
  );
};
