import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { RootState } from "../../store/store";
import { Outlet } from "react-router-dom";
import { NavbarComponent } from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Preloader from "../../components/Preloader";

import { PeraSession } from "../../services/peraSession";

import { updateState } from "../../store/settings/settingsSlice";
import { showErrorToast } from "../../utility/errorToast";

// let peraWallet: any;

export const RouteWithSidebar = (props: any) => {
  const [loaded, setLoaded] = useState(false);
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  //   peraWallet = PeraSession.getPeraInstance(settings.selectedAlgorandNetwork);

  useEffect(() => {
    // Reconnect to the session when the component is mounted

    if (settings.selectedAlgorandWallet === "Pera") {
      PeraSession.getPeraInstance(settings.selectedAlgorandNetwork)
        ?.reconnectSession()
        .then((accounts: string[]) => {
          // debugger;
          // Setup the disconnect event listener
          PeraSession.getPeraInstance(
            settings.selectedAlgorandNetwork
          )?.connector?.on("disconnect", handleDisconnectWalletClick);

          if (accounts.length) {
            dispatch(
              updateState({
                accountsAlgorand: accounts,
                isPeraSessionConnected: true,
              })
            );
          }
        });
    }
  }, [settings.selectedAlgorandNetwork]);

  function handleConnectWalletClick() {
    // peraWallet = PeraSession.setPeraInstance(settings.selectedAlgorandNetwork);

    PeraSession.getPeraInstance(settings.selectedAlgorandNetwork)
      ?.connect()
      .then((accounts: string[]) => {
        // Setup the disconnect event listener
        PeraSession.getPeraInstance(
          settings.selectedAlgorandNetwork
        )?.connector?.on("disconnect", handleDisconnectWalletClick);

        if (accounts.length) {
          dispatch(
            updateState({
              accountsAlgorand: accounts,
              isPeraSessionConnected: true,
            })
          );
        }
      })
      .catch((error: { data: { type: string } }) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }

        showErrorToast("Error occurred when connecting to Pera");
      });
  }

  function handleDisconnectWalletClick() {
    PeraSession.getPeraInstance(settings.selectedAlgorandNetwork)?.disconnect();

    dispatch(
      updateState({
        accountsAlgorand: [],
        isPeraSessionConnected: false,
      })
    );
  }

  return (
    <>
      <Preloader show={loaded ? false : true} />
      <Sidebar />
      <main className="content">
        <NavbarComponent
          handleDisconnectWalletClick={handleDisconnectWalletClick}
          handleConnectWalletClick={handleConnectWalletClick}
        />
        <Outlet />
      </main>
    </>
  );
};
