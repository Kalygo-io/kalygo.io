import React from "react";
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
          <Row>
            <Col xs={12}>
              <h4>Video Tutorials</h4>
              <YoutubeEmbed embedId={"AY0v8ISTUO4"} />
              <YoutubeEmbed embedId={"ntq8GAX5wR0"} />
              <YoutubeEmbed embedId={"JyYYnNd-6rQ"} />
              <YoutubeEmbed embedId={"a0-wldIvvdI"} />
              <YoutubeEmbed embedId={"DqEGXP1bvSM"} />
              <YoutubeEmbed embedId={"Iy7SvunR_UQ"} />
              {/* <iframe
                width="100%"
                height="auto"
                // aspectRatio={1.77}
                src="https://www.youtube.com/embed/AY0v8ISTUO4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CashBuyContract;
