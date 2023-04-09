import React, { useEffect, useState, useRef } from "react";
import {
  Nav,
  Navbar,
  Container,
  Button,
  Overlay,
  Popover,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";

import settingsSlice from "../store/settings/settingsSlice";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AlgorandClient } from "../services/algorand_client";

interface P {
  handleConnectWalletClick: () => void;
  handleDisconnectWalletClick: () => void;
}

export const NavbarComponent = (props: P) => {
  const { handleConnectWalletClick, handleDisconnectWalletClick } = props;
  const settings = useAppSelector((state: RootState) => state.settings);

  // const [show, setShow] = useState(false);
  // const [target, setTarget] = useState(null);
  const ref = useRef(null);

  // const handleClick = (event: any) => {
  //   console.log("!@#!@#");
  //   setShow(!show);
  //   setTarget(event.target);
  // };

  let [accntBalance, setAccntBalance] = useState<{
    val: any;
    loading: boolean;
    error: any;
  }>({
    val: -1,
    loading: false,
    error: null,
  });

  let [rfrshCounter, setRfrshCounter] = useState<number>(0);

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    async function fetch() {
      try {
        setAccntBalance({
          val: -1,
          loading: true,
          error: null,
        });

        let accountInfo = await AlgorandClient.getAlgod(
          settings.selectedAlgorandNetwork
        )
          .accountInformation(settings.selectedAlgorandAccount)
          .do();

        setAccntBalance({
          val: accountInfo["amount"],
          loading: false,
          error: null,
        });
      } catch (e) {
        setAccntBalance({
          val: -1,
          loading: false,
          error: e,
        });
      }
    }

    settings.selectedBlockchain === "Algorand" &&
      settings.selectedAlgorandAccount &&
      fetch();
  }, [rfrshCounter]);

  // console.log("==---== show", show);

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex flex-column align-items-end justify-content-between w-100">
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
            </Nav>
          }

          {settings.selectedBlockchain === "Algorand" &&
            settings.selectedAlgorandAccount.length > 12 &&
            pathname !== "/dashboard/settings" && (
              <div
                ref={ref}
                style={{
                  cursor: "pointer",
                }}
              >
                <span
                  onClick={() => {
                    // handleClick()
                  }}
                >
                  {settings.selectedBlockchain === "Algorand" &&
                    settings.selectedAlgorandWallet === "Pera" &&
                    settings.isPeraSessionConnected && (
                      <>
                        &nbsp;
                        <FontAwesomeIcon color="#00a677" icon={faCircle} />
                        &nbsp;
                      </>
                    )}

                  {settings.selectedBlockchain === "Algorand" &&
                    settings.selectedAlgorandWallet === "Pera" &&
                    !settings.isPeraSessionConnected && (
                      <>
                        &nbsp;
                        <FontAwesomeIcon icon={faCircle} />
                        &nbsp;
                      </>
                    )}
                  {settings.selectedAlgorandAccount.substring(0, 4) +
                    "..." +
                    settings.selectedAlgorandAccount.substring(
                      settings.selectedAlgorandAccount.length - 4
                    )}
                </span>{" "}
                {accntBalance.val >= 0 ? (
                  <span
                    onClick={() => {
                      setRfrshCounter(rfrshCounter + 1);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <b>
                      {Number.parseFloat(
                        (accntBalance.val / 1000000).toFixed(6)
                      )}{" "}
                      ALGO
                    </b>
                  </span>
                ) : (
                  <>
                    {accntBalance.loading && <span>...</span>}
                    {accntBalance.error && (
                      <span style={{ color: "red" }}>!</span>
                    )}
                  </>
                )}
              </div>
            )}
          {/* <Overlay
            rootClose={true}
            rootCloseEvent={"click"}
            onHide={() => {
              setShow(false);
            }}
            show={show}
            target={target}
            placement="bottom"
            container={ref}
            containerPadding={20}
          >
            <Popover id="popover-contained">
              <Popover.Header as="h3">Settings</Popover.Header>
              <Popover.Body>
                <b>Blockchain </b>
                {settings.selectedBlockchain}
                <br />
                <b>Network </b>
                {settings.selectedAlgorandNetwork}
                <br />
                <b>Wallet </b>
                {settings.selectedAlgorandWallet}
                <br />
                <b>Account </b>
                {settings.selectedAlgorandAccount}
                <br />
              </Popover.Body>
            </Popover>
          </Overlay> */}
          {settings.selectedBlockchain === "Algorand" &&
            settings.selectedAlgorandAccount.length > 12 &&
            pathname !== "/dashboard/settings" && (
              <div>{settings.selectedAlgorandNetwork}</div>
            )}
        </div>
      </Container>
    </Navbar>
  );
};
