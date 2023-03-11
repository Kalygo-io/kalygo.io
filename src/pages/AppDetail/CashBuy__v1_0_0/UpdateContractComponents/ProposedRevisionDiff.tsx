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
const { factory } = ts;

interface P {
  role: "buyer" | "seller";
}

export function ProposedRevisionDiff(props: P) {
  let { role } = props;

  const [proposedRevision, setProposedRevision] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const [globalState, setGlobalState] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

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

  useEffect(() => {
    async function fetch() {
      try {
        let box = role === "buyer" ? "buyer_updt" : "seller_updt";

        let boxValue = await AlgorandClient.getAlgod(
          settings.selectedAlgorandNetwork
        )
          .getApplicationBoxByName(
            Number.parseInt(id!),
            new Uint8Array(Buffer.from(box || "", "utf8"))
          )
          .do();

        // const ContractUpdateType = ABIType.from("(address,address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)");

        console.log("boxValue", boxValue);

        let decodedBoxValue = ABIType.from(
          "(address,address,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)"
        ).decode(boxValue.value);

        console.log("boxValue", boxValue);

        console.log("decodedBoxValue", decodedBoxValue);

        // console.log("***&&&", window.btoa(boxValue.toString()));

        setProposedRevision({
          val: decodedBoxValue,
          loading: false,
          error: null,
        });

        // setValue("note", arrayBufferToString(boxValue.value).trimEnd());

        // STEP 1
        const appResponse = await AlgorandClient.getIndexer(
          settings.selectedAlgorandNetwork
        )
          .lookupApplications(Number.parseInt(id!))
          .do();

        console.log("appResponse", appResponse);

        const gState = parseGlobalState(
          appResponse?.application?.params &&
            appResponse.application.params["global-state"]
        );

        console.log("gState", gState);

        setGlobalState({
          val: gState,
          loading: false,
          error: null,
        });
      } catch (e) {
        console.log("e", e);
        setProposedRevision({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  console.log(`proposedRevision.val`, proposedRevision.val);

  // let roleRequestedRevision =
  //   proposedRevision.val && proposedRevision.val[`glbl_${role}_update`];

  console.log("globalState", globalState);

  if (globalState.val && proposedRevision.val) {
    // console.log(proposedRevision.val["glbl_escrow_1"]);
    // console.log(roleRequestedRevision[2]);
    // console.log(typeof roleRequestedRevision[2]);
    // console.log(
    //   BigInt(proposedRevision.val["glbl_escrow_1"]) !==
    //     toObject(roleRequestedRevision[2])
    // );
    // console.log("2->", toObject(roleRequestedRevision[2]));
    // console.log(
    //   "3->",
    //   roleRequestedRevision[3],
    //   toObject(roleRequestedRevision[3])
    // );
  }

  return (
    <>
      {/* {proposedRevision.val && (
          <pre>{JSON.stringify(toObject(proposedRevision.val), undefined, 2)}</pre>
        )} */}
      {globalState.val && proposedRevision.val ? (
        <>
          <div>
            <b>Buyer </b>
            <span>{globalState.val["glbl_buyer"]}</span>
            {globalState.val["glbl_buyer"] !== proposedRevision.val[0] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {proposedRevision.val[0]}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Seller </b>
            <span>{globalState.val["glbl_seller"]}</span>
            {globalState.val["glbl_seller"] !== proposedRevision.val[1] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {proposedRevision.val[1]}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 1 </b>
            <span>{globalState.val["glbl_escrow_1"]}</span>
            {BigInt(globalState.val["glbl_escrow_1"]) !==
              proposedRevision.val[2] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision.val[2])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 2 </b>
            <span>{globalState.val["glbl_escrow_2"]}</span>
            {BigInt(globalState.val["glbl_escrow_2"]) !==
              proposedRevision.val[3] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision.val[3])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Total </b>
            <span>{globalState.val["glbl_total"]}</span>
            {BigInt(globalState.val["glbl_total"]) !==
              proposedRevision.val[4] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(proposedRevision.val[4])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Inspect Start Date </b>
            <span>{globalState.val["glbl_inspect_start_date"]}</span>
            {/* {proposedRevision.val["glbl_inspect_start_date"] !==
              roleRequestedRevision[5] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[5]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Inspect End Date </b>
            <span>{globalState.val["glbl_inspect_end_date"]}</span>
            {/* {proposedRevision.val["glbl_inspect_end_date"] !==
              roleRequestedRevision[6] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[6]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Inspect Extension </b>
            <span>{globalState.val["glbl_inspect_extension_date"]}</span>
            {/* {proposedRevision.val["glbl_inspect_extension_date"] !==
              roleRequestedRevision[7] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[7]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Moving Date </b>
            <span>{globalState.val["glbl_moving_date"]}</span>
            {/* {proposedRevision.val["glbl_moving_date"] !==
              roleRequestedRevision[8] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[8]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Closing Date </b>
            <span>{globalState.val["glbl_closing_date"]}</span>
            {/* {proposedRevision.val["glbl_closing_date"] !==
              roleRequestedRevision[9] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[9]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Free Funds Date </b>
            <span>{globalState.val["glbl_free_funds_date"]}</span>
            {/* {proposedRevision.val["glbl_free_funds_date"] !==
              roleRequestedRevision[10] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[10]}
              </span>
            )} */}
          </div>
        </>
      ) : (
        "ø"
      )}
    </>
  );
}
