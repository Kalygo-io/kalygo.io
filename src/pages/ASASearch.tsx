import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { Form, InputGroup, Row, Col, Button } from "react-bootstrap";
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
        </div>
        <Form className="navbar-search" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group id="topbarSearch">
            <InputGroup className="input-group-merge search-bar">
              <Form.Control
                type="number"
                inputMode="numeric"
                placeholder="Search..."
                isInvalid={errors["searchVal"] ? true : false}
                {...register("searchVal", { required: true })}
              />
            </InputGroup>
          </Form.Group>
          <div
            style={{
              textAlign: "center",
              margin: "1em",
            }}
          >
            <Button variant="success" type="submit">
              <FontAwesomeIcon icon={faSearch} />
              &nbsp;&nbsp;Search&nbsp;
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
