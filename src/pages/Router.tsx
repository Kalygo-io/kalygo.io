import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { RoutesData } from "../routes";
import { ToastContainer, toast } from "react-toastify";

import { HashLink } from "react-router-hash-link";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import BlockchainOverview from "./BlockchainOverview";
import Settings from "./Settings";
import FinanceDealContract from "./contracts/FinanceDealContract";
import CashBuyContract from "./contracts/CashBuyContract";

import NotFoundPage from "./examples/NotFound";

// components
import Sidebar from "../components/Sidebar";
import { NavbarComponent } from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import { RootState } from "../store/store";
import { updateState } from "../store/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import TransactionsOverview from "./TransactionsOverview";
import TransactionDetail from "./TransactionDetail";
import AppDetail from "./AppDetail";

import ContractOptions from "./ContractOptions";
import { BsFillNutFill } from "react-icons/bs";
import FungibleTokenContract from "./contracts/FungibleTokenContract";
import Overview_CashBuy__v1_0_0 from "./AppDetail/CashBuy__v1_0_0/Overview_CashBuy__v1_0_0";
import OverviewAsset from "./AppDetail/AssetDetail/OverviewAsset";
import { Support } from "./documentation/Support";
import { Test } from "./documentation/Test";
import { Box } from "./AppDetail/CashBuy__v1_0_0/Box";
import { Governance } from "./Governance";
import { UpdateContract } from "./AppDetail/CashBuy__v1_0_0/UpdateContract";

import { RouteWithLoader } from "./layouts/RouteWithLoader";
import { RouteWithSidebar } from "./layouts/RouteWithSidebar";

const Router = () => (
  <>
    <Routes>
      <Route path="/" element={<RouteWithLoader />}>
        <Route path={""} element={<Presentation />} />
        <Route path={"governance"} element={<Governance />} />
      </Route>

      {/* pages */}
      <Route path="/dashboard/" element={<RouteWithSidebar />}>
        <Route path={"overview"} element={<BlockchainOverview />} />
        <Route path={"transactions"} element={<TransactionsOverview />} />
        <Route path={"box/:app_id/:box/:role_address"} element={<Box />} />
        <Route path={"app/"} element={<AppDetail />}>
          <Route
            path={"cashBuy__v1_0_0/:id/update"}
            element={<UpdateContract />}
          />
          <Route
            path={"cashBuy__v1_0_0/:id/"}
            element={<Overview_CashBuy__v1_0_0 />}
          />

          <Route path={"asa/:id"} element={<OverviewAsset />} />
        </Route>
        <Route path={"support"} element={<Support />} />
        <Route path={"test"} element={<Test />} />
        <Route path={"contract-options"} element={<ContractOptions />} />
        <Route
          path={"transactions/detail/:id"}
          element={<TransactionDetail />}
        />
        <Route
          path={"new-finance-deal-contract"}
          element={<FinanceDealContract />}
        />
        <Route path={"cash-buy"} element={<CashBuyContract />} />
        <Route
          path={"new-fungible-token-contract"}
          element={<FungibleTokenContract />}
        />
        <Route path={"settings"} element={<Settings />} />
      </Route>
      <Route path={RoutesData.NotFound.path} element={<RouteWithLoader />}>
        <Route
          path={RoutesData.NotFound.path}
          element={<NotFoundPage />}
        ></Route>
      </Route>
    </Routes>
    <ToastContainer />
  </>
);

export default Router;
