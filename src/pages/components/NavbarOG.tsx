import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faYoutube,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { useAppSelector } from "../../store/hooks";

export function NavbarOGComponent() {
  const settings = useAppSelector((state) => state.settings);

  return (
    <Navbar variant="white" expand="lg" bg="white" className="sticky-top">
      <Container className="position-relative justify-content-between px-3">
        <Navbar.Brand
          as={HashLink}
          to="/"
          className="me-lg-3 d-flex align-items-center"
        >
          <span className="ms-2 brand-text d-none d-lg-inline">
            {settings.brandName}
          </span>
        </Navbar.Brand>

        <div className="d-flex align-items-center">
          {/* <Navbar.Collapse id="navbar-default-primary">
            <Nav className="navbar-nav-hover align-items-lg-center">
              <Nav.Link href="https://www.instagram.com/kalygo.io">
                <FontAwesomeIcon
                  style={{ height: 24, width: 24 }}
                  icon={faInstagram}
                />
              </Nav.Link>
              <Nav.Link href="https://www.youtube.com/channel/UCho0SXnGBfEabvHdvaaz9oQ">
                <FontAwesomeIcon
                  style={{ height: 24, width: 24 }}
                  icon={faYoutube}
                />
              </Nav.Link>
              <Nav.Link href="https://twitter.com/kalygo_io">
                <FontAwesomeIcon
                  style={{ height: 24, width: 24 }}
                  icon={faTwitter}
                />
              </Nav.Link>
              <Nav.Link href="https://www.linkedin.com/company/kalygo">
                <FontAwesomeIcon
                  style={{ height: 24, width: 24 }}
                  icon={faLinkedin}
                />
              </Nav.Link>
              <Nav.Link href="https://github.com/Kalygo-io">
                <FontAwesomeIcon
                  style={{ height: 24, width: 24 }}
                  icon={faGithub}
                />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse> */}
        </div>
      </Container>
    </Navbar>
  );
}
