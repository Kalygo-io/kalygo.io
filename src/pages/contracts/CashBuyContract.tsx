import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCartArrowDown,
  faChartPie,
  faChevronDown,
  faClipboard,
  faCommentDots,
  faFileAlt,
  faPlus,
  faRocket,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Button, Dropdown } from "react-bootstrap";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { OperatorConfig } from "../../components/Widgets/Generic/OperatorConfig";
import { CashBuyContractForm } from "../../components/Forms/CashBuyContractFormWithATC";
import { YoutubeEmbed } from "../../components/YouTubeEmbed";
// import { CashBuyContractForm } from "../../components/Forms/CashBuyContractFormWithSDK";

const CashBuyContract = () => {
  const [showVideos, setShowVideos] = useState(false);

  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Cash Buy</h1>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <CashBuyContractForm accounts={settings.accountsAlgorand} />
        </Col>
        <Col xs={12} xl={4}>
          {showVideos ? (
            <Row>
              <Col xs={12}>
                <h4>
                  Video Tutorials{" "}
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowVideos(false);
                    }}
                  >
                    Hide
                  </Button>
                </h4>
                <YoutubeEmbed embedId={"AY0v8ISTUO4"} />
                <YoutubeEmbed embedId={"ntq8GAX5wR0"} />
                <YoutubeEmbed embedId={"JyYYnNd-6rQ"} />
                <YoutubeEmbed embedId={"a0-wldIvvdI"} />
                <YoutubeEmbed embedId={"DqEGXP1bvSM"} />
                <YoutubeEmbed embedId={"Iy7SvunR_UQ"} />
              </Col>
            </Row>
          ) : (
            <Button
              className="mb-4"
              onClick={() => {
                setShowVideos(true);
              }}
            >
              Show Videos
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CashBuyContract;
