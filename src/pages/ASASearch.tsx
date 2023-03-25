import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { Form, InputGroup, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { defaultValuesForASASearch } from "../data/defaultValuesForASASearch";

export function ASASearch() {
  const settings = useAppSelector((state: RootState) => state.settings);
  const navigate = useNavigate();

  console.log("settings", settings.selectedAlgorandNetwork);
  let defaultSearchValue =
    defaultValuesForASASearch[settings.selectedAlgorandNetwork].tokenId;

  const {
    register,
    trigger,
    watch,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      searchVal: defaultSearchValue,
    },
  });

  const onSubmit = (data: any) => {
    navigate(`/dashboard/app/asa/${data.searchVal}`);
  };

  return (
    <Row>
      <Col
        md={{
          span: 6,
          offset: 3,
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "1em",
          }}
        >
          <h1>Search for an ASA</h1>
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <Form
          // <Form onSubmit={handleSubmit(onSubmit)} id="cash-buy-contract-form">
          className="navbar-search"
          onSubmit={handleSubmit(onSubmit)}
          // (e) => {
          // e.preventDefault();

          // navigate("/dashboard/contract-options");
          // }
        >
          <Form.Group id="topbarSearch">
            <InputGroup className="input-group-merge search-bar">
              <Form.Control
                type="number"
                placeholder="Search..."
                isInvalid={errors["searchVal"] ? true : false}
                {...register("searchVal", { required: true })}
                // value={searchVal}
                // onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
