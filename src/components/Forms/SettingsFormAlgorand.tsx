import React, { useEffect } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";

import { RootState } from "../../store/store";
import {
  fetchAlgoSignerNetworkAccounts,
  fetchPeraNetworkAccounts,
  updateState,
} from "../../store/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AlgorandClient } from "../../services/algorand_client";
import { PeraSession } from "../../services/peraSession";
import { showErrorToast } from "../../utility/errorToast";

interface P {}

export const SettingsFormAlgorand = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      selectedBlockchain: settings.selectedBlockchain,
      selectedAlgorandNetwork: settings.selectedAlgorandNetwork,
      selectedAlgorandAccount: settings.selectedAlgorandAccount,
      selectedAlgorandWallet: settings.selectedAlgorandWallet,
      brandName: settings.brandName,
    },
  });

  watch("selectedAlgorandNetwork");

  useEffect(() => {
    const accountIndex = settings.accountsAlgorand.findIndex(
      (item) => item.address === settings.selectedAlgorandAccount
    );

    const selectedAccount =
      accountIndex > -1 ? settings.accountsAlgorand[accountIndex] : "";

    setValue("selectedAlgorandAccount", selectedAccount.address);
  }, [settings.accountsAlgorand]);

  useEffect(() => {}, [settings.selectedAlgorandWallet]);

  const onSubmit = (data: any) => {
    dispatch(updateState(data));

    AlgorandClient.setAlgod(data.selectedAlgorandNetwork);
    AlgorandClient.setIndexer(data.selectedAlgorandNetwork);
  };

  console.log("__ __", settings.selectedAlgorandNetwork);
  console.log("__ selectedAlgorandWallet __", settings.selectedAlgorandWallet);

  console.log("___ ___", settings);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Settings</h5>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="blockchain">
                <Form.Label>
                  Blockchain{" "}
                  {errors.selectedBlockchain && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedBlockchain", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;

                    console.log("!@#!@#", target.value);
                    console.warn(
                      "Need to populate network select with relevant networks for chosen blockchain"
                    );

                    // setValue("selectedAlgorandAccount", "");
                    // setValue("selectedAlgorandNetwork", "");
                    // setValue("selectedBlockchain", target.value);
                    // console.log(
                    //   "___ ___ ___",
                    //   settings.selectedAlgorandNetwork
                    // );

                    dispatch(
                      updateState({
                        selectedBlockchain: target.value,
                      })
                    );
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {settings.supportedBlockchains.map((i: any, idx: number) => {
                    return (
                      <option
                        key={i.name}
                        disabled={!i.enabled}
                        style={{
                          textOverflow: "ellipsis",
                        }}
                        value={i.name}
                      >
                        {i.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="network">
                <Form.Label>
                  Network{" "}
                  {errors.selectedAlgorandNetwork && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedAlgorandNetwork", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;

                    console.log("!@#!@#", target.value);

                    setValue("selectedAlgorandAccount", "");
                    setValue("selectedAlgorandNetwork", target.value);

                    try {
                      PeraSession.getPeraInstance(
                        settings.selectedAlgorandNetwork
                      )?.disconnect();

                      PeraSession.peraWalletInstance = null;

                      // PeraSession.setPeraInstance(target.value);
                      dispatch(
                        updateState({
                          selectedAlgorandNetwork: target.value,
                        })
                      );
                    } catch (e) {
                      showErrorToast("Error occurred when switching networks");
                    }
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {settings.selectedAlgorandWallet === "AlgoSigner" &&
                    settings.supportedAlgorandNetworksAlgoSigner.map(
                      (i: any, idx: number) => {
                        return (
                          <option
                            key={i}
                            style={{
                              textOverflow: "ellipsis",
                            }}
                            value={i}
                          >
                            {i}
                          </option>
                        );
                      }
                    )}

                  {settings.selectedAlgorandWallet === "Pera" &&
                    settings.supportedAlgorandNetworksPera.map(
                      (i: any, idx: number) => {
                        return (
                          <option
                            key={i}
                            style={{
                              textOverflow: "ellipsis",
                            }}
                            value={i}
                          >
                            {i}
                          </option>
                        );
                      }
                    )}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="network">
                <Form.Label>
                  Wallet{" "}
                  {errors.selectedAlgorandWallet && (
                    <span style={{ color: "red" }}>*required&nbsp;</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedAlgorandWallet", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;

                    console.log("!@#!@#", target.value);

                    setValue("selectedAlgorandAccount", "");

                    if (target.value !== "Pera") {
                      PeraSession.getPeraInstance(
                        settings.selectedAlgorandNetwork
                      )?.disconnect();
                      dispatch(
                        updateState({
                          accountsAlgorand: [],
                          isPeraSessionConnected: false,
                        })
                      );
                    }

                    dispatch(
                      updateState({
                        accountsAlgorand: [],
                        selectedAlgorandWallet: target.value,
                      })
                    );
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {settings.supportedAlgorandWallets.map(
                    (i: any, idx: number) => {
                      return (
                        <option
                          disabled={!i.enabled}
                          key={i.name}
                          style={{
                            textOverflow: "ellipsis",
                          }}
                          value={i.name}
                        >
                          {i.name}
                        </option>
                      );
                    }
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="gender">
                <Form.Label>
                  Account{" "}
                  {errors.selectedAlgorandAccount && (
                    <span style={{ color: "red" }}>*required&nbsp;</span>
                  )}
                  <FontAwesomeIcon
                    color="black"
                    icon={faRotate}
                    onClick={() => {
                      console.log("_+_ Algorand _+_");

                      switch (settings.selectedAlgorandWallet) {
                        case "AlgoSigner":
                          PeraSession.getPeraInstance(
                            settings.selectedAlgorandNetwork
                          )?.disconnect();
                          PeraSession.peraWalletInstance = null;

                          dispatch(
                            fetchAlgoSignerNetworkAccounts(
                              getValues("selectedAlgorandNetwork")
                            )
                          );
                          break;
                        case "Pera":
                          /*
                           * Handled in RouteWithLoader Layout Component
                           */

                          PeraSession.getPeraInstance(
                            settings.selectedAlgorandNetwork
                          )
                            ?.connect()
                            .then((accounts: string[]) => {
                              // Setup the disconnect event listener
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
                              if (
                                error?.data?.type !== "CONNECT_MODAL_CLOSED"
                              ) {
                                // log the necessary errors
                              }
                            });
                          break;
                      }

                      console.log("___ ___ ___");
                    }}
                  />
                </Form.Label>
                <Form.Select
                  {...register("selectedAlgorandAccount", { required: true })}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  <option
                    key={"Select"}
                    style={{
                      textOverflow: "ellipsis",
                    }}
                    value={""}
                  >
                    Select...
                  </option>
                  {settings.selectedBlockchain === "Algorand" &&
                    settings.selectedAlgorandWallet === "AlgoSigner" &&
                    settings.accountsAlgorand.map((i: any, idx: number) => {
                      return (
                        <option
                          key={i.address}
                          style={{
                            textOverflow: "ellipsis",
                          }}
                          value={i.address}
                        >
                          {i.address}
                        </option>
                      );
                    })}

                  {settings.selectedBlockchain === "Algorand" &&
                    settings.selectedAlgorandWallet === "Pera" &&
                    settings.accountsAlgorand.map((i: any, idx: number) => {
                      return (
                        <option
                          key={i}
                          style={{
                            textOverflow: "ellipsis",
                          }}
                          value={i}
                        >
                          {i}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="buyer">
                <Form.Label>Buyer</Form.Label>
                <Form.Control
                  {...register("brandName", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Your Brand Name"
                  onFocus={() => {}}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="secondary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
