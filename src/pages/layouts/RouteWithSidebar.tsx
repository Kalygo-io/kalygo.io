import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { RootState } from "../../store/store";
import { Outlet } from "react-router-dom";
import { NavbarComponent } from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Preloader from "../../components/Preloader";

import { PeraSession } from "../../services/peraSession";

import { updateState } from "../../store/settings/settingsSlice";

export const RouteWithSidebar = (props: any) => {
  const [loaded, setLoaded] = useState(false);
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  let peraWallet = PeraSession.getPeraInstance(
    settings.selectedAlgorandNetwork
  );

  useEffect(() => {
    // Reconnect to the session when the component is mounted

    if (settings.selectedAlgorandWallet === "Pera") {
      peraWallet.reconnectSession().then((accounts: string[]) => {
        // debugger;
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

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
  }, []);

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((accounts: string[]) => {
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

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
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

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
