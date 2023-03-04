import React from "react";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { showErrorToast } from "../utility/errorToast";
import settingsSlice from "../store/settings/settingsSlice";

interface P {
  handleConnectWalletClick: () => void;
  handleDisconnectWalletClick: () => void;
}

export const NavbarComponent = (props: P) => {
  const { handleConnectWalletClick, handleDisconnectWalletClick } = props;
  const settings = useAppSelector((state: RootState) => state.settings);

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-end w-100">
          {/* <div className="d-flex align-items-center">
            <Form className="navbar-search">
              <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control type="text" placeholder="Search" />
                </InputGroup>
              </Form.Group>
            </Form>
          </div> */}
          <Nav className="align-items-center">
            {settings.selectedBlockchain === "Algorand" &&
              settings.selectedAlgorandWallet === "Pera" && (
                <Button
                  variant="info"
                  onClick={
                    settings.isPeraSessionConnected
                      ? handleDisconnectWalletClick
                      : handleConnectWalletClick
                  }
                >
                  {settings.isPeraSessionConnected
                    ? "Disconnect"
                    : "Connect to Pera Wallet"}
                </Button>
              )}

            {/* <Dropdown as={Nav.Item}> */}
            {/* <Dropdown.Toggle
                as={Button}
                variant="secondary"
                className="text-dark me-2"
              > */}
            {/* <Nav.Item>asdf</Nav.Item> */}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
