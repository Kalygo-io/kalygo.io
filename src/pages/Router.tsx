import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { RoutesData } from "../routes";
import { ToastContainer, toast } from "react-toastify";

// pages
import Presentation from "./Presentation";
import BlockchainOverview from "./BlockchainOverview";
import Settings from "./Settings";
import FinanceDealContract from "./contracts/FinanceDealContract";
import CashBuyContract from "./contracts/CashBuyContract";

import NotFoundPage from "./examples/NotFound";

// components
import TransactionsOverview from "./TransactionsOverview";
import TransactionDetail from "./TransactionDetail";
import AppDetail from "./AppDetail";

import ContractOptions from "./ContractOptions";
import FungibleTokenContract from "./contracts/FungibleTokenContract";
import Overview_Escrow__v1_0_0 from "./AppDetail/Escrow__v1_0_0/Overview_Escrow__v1_0_0";
import OverviewAsset from "./AppDetail/AssetDetail/OverviewAsset";

import { ASASearch } from "./ASASearch";

import { Support } from "./documentation/Support";
import { Test } from "./documentation/Test";
import { Box } from "./AppDetail/Escrow__v1_0_0/Box";
import { Governance } from "./Governance";
import { UpdateContract } from "./AppDetail/Escrow__v1_0_0/UpdateContract";

import { RouteWithLoader } from "./layouts/RouteWithLoader";
import { RouteWithSidebar } from "./layouts/RouteWithSidebar";

const Router = () => (
  <>
    <Routes>
      <Route path="/" element={<RouteWithLoader />}>
        <Route path={""} element={<Presentation />} />
        <Route path={"governance"} element={<Governance />} />
        {/* <Route path={"d3"} element={<Governance />} /> */}
      </Route>

      {/* pages */}
      <Route path="/dashboard/" element={<RouteWithSidebar />}>
        <Route path={"overview"} element={<BlockchainOverview />} />
        <Route path={"transactions"} element={<TransactionsOverview />} />
        <Route path={"box/:app_id/:box/:role_address"} element={<Box />} />
        <Route path={"app/"} element={<AppDetail />}>
          <Route
            path={"escrow__v1_0_0/:id/update"}
            element={<UpdateContract />}
          />
          <Route
            path={"escrow__v1_0_0/:id/"}
            element={<Overview_Escrow__v1_0_0 />}
          />

          <Route path={"asa/:id"} element={<OverviewAsset />} />
        </Route>

        <Route path={"tokens"} element={<AppDetail />}>
          <Route path={"asa"} element={<ASASearch />}></Route>
          <Route path={"nft"} element={<>Coming Soon...</>}></Route>
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
