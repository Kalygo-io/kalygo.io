import React, { useEffect, useState } from "react";
import { AlgorandClient } from "../../../../services/algorand_client";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../store/store";

import { ContractUpdate } from "../../../../types/contractUpdate";

import {
  arrayBufferToString,
  boxDataToObj,
} from "../helpers/arrayBufferToString";

import { ABIType } from "algosdk";

import ts from "typescript";
import { parseGlobalState } from "../../../customSelectors/appl/parseGlobalState";
import moment from "moment";
import { ErrorBoundary } from "../../../../components/ErrorBoundary";
const { factory } = ts;

interface P {
  role: string;
  proposedRevision: any;
  globalState: any;
}

export function ProposedRevisionDiff(props: P) {
  let { globalState, proposedRevision, role } = props;

  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  function toObject(val: any) {
    return JSON.parse(
      JSON.stringify(
        val,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    );
  }

  console.log(`*** ProposedRevisionDiff globalState`, globalState);
  console.log(`*>*>* ProposedRevisionDiff proposedRevision`, proposedRevision);

  // if (role === "seller") {
  //   debugger;
  // }

  return (
    <ErrorBoundary>
      {/* {proposedRevision && (
        <pre>{JSON.stringify(toObject(proposedRevision), undefined, 2)}</pre>
      )} */}
      {globalState && proposedRevision ? (
        <>
          <div>
            <b>Buyer </b>
            <span>{globalState["glbl_buyer"]}</span>
            {globalState["glbl_buyer"] !== proposedRevision[0] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {proposedRevision[0]}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Seller </b>
            <span>{globalState["glbl_seller"]}</span>
            {globalState["glbl_seller"] !== proposedRevision[1] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {proposedRevision[1]}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 1 </b>
            <span>{globalState["glbl_escrow_1"]}</span>
            {BigInt(globalState["glbl_escrow_1"]) !== proposedRevision[2] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[2])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 2 </b>
            <span>{globalState["glbl_escrow_2"]}</span>
            {BigInt(globalState["glbl_escrow_2"]) !== proposedRevision[3] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[3])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Total </b>
            <span>{globalState["glbl_total"]}</span>
            {BigInt(globalState["glbl_total"]) !== proposedRevision[4] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[4])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Inspect Start Date </b>
            <span>{globalState["glbl_inspect_start_date"]}</span>
            {BigInt(globalState["glbl_inspect_start_date"]) !==
              proposedRevision[5] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[5])
                  ? new Date(toObject(proposedRevision[5])).toLocaleString()
                  : "ERROR"}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Inspect End Date </b>
            <span>{globalState["glbl_inspect_end_date"]}</span>
            {BigInt(globalState["glbl_inspect_end_date"]) !==
              proposedRevision[6] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[6])
                  ? moment(
                      toObject(proposedRevision[6]) * 1000
                    ).toLocaleString()
                  : "ERROR"}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Inspect Extension </b>
            <span>{globalState["glbl_inspect_extension_date"]}</span>
            {BigInt(globalState["glbl_inspect_extension_date"]) !==
              proposedRevision[7] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[7])
                  ? moment(
                      toObject(proposedRevision[7]) * 1000
                    ).toLocaleString()
                  : "ERROR"}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Moving Date </b>
            <span>{globalState["glbl_moving_date"]}</span>
            {BigInt(globalState["glbl_moving_date"]) !==
              proposedRevision[8] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[8])
                  ? moment(
                      toObject(proposedRevision[8]) * 1000
                    ).toLocaleString()
                  : "ERROR"}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Closing Date </b>
            <span>{globalState["glbl_closing_date"]}</span>
            {BigInt(globalState["glbl_closing_date"]) !==
              proposedRevision[9] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[9])
                  ? moment(
                      toObject(proposedRevision[9]) * 1000
                    ).toLocaleString()
                  : "ERROR"}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Free Funds Date </b>
            <span>{globalState["glbl_free_funds_date"]}</span>
            {BigInt(globalState["glbl_free_funds_date"]) !==
              proposedRevision[10] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision[10])
                  ? moment(
                      toObject(proposedRevision[10]) * 1000
                    ).toLocaleString()
                  : "ERROR"}
              </span>
            )}
          </div>
        </>
      ) : (
        "ø"
      )}
    </ErrorBoundary>
  );
}
