import React from "react";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";

import settingsSlice from "../store/settings/settingsSlice";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface P {
  handleConnectWalletClick: () => void;
  handleDisconnectWalletClick: () => void;
}

export const NavbarComponent = (props: P) => {
  const { handleConnectWalletClick, handleDisconnectWalletClick } = props;
  const settings = useAppSelector((state: RootState) => state.settings);

  const location = useLocation();
  const { pathname } = location;

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-start w-100">
          {
            <Nav className="align-items-center">
              {settings.selectedBlockchain === "Algorand" &&
                settings.selectedAlgorandWallet === "Pera" &&
                pathname === "/dashboard/settings" && (
                  <Button
                    variant="info"
                    onClick={
                      settings.isPeraSessionConnected
                        ? handleDisconnectWalletClick
                        : handleConnectWalletClick
                    }
                  >
                    {settings.isPeraSessionConnected
                      ? "Disconnect Pera"
                      : "Connect Pera"}
                  </Button>
                )}

              {settings.selectedBlockchain === "Algorand" &&
                settings.selectedAlgorandWallet === "Pera" &&
                pathname !== "/dashboard/settings" &&
                settings.isPeraSessionConnected && (
                  <>
                    <FontAwesomeIcon color="#00a677" icon={faCircle} />
                    &nbsp;Pera Connected
                  </>
                )}

              {settings.selectedBlockchain === "Algorand" &&
                settings.selectedAlgorandWallet === "Pera" &&
                pathname !== "/dashboard/settings" &&
                !settings.isPeraSessionConnected && (
                  <>
                    <FontAwesomeIcon icon={faCircle} />
                    &nbsp;Pera Disconnected
                  </>
                )}
            </Nav>
          }
        </div>
      </Container>
    </Navbar>
  );
};
