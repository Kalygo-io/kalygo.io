import React from "react";
import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";

import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import ProfileCover from "../../assets/img/profile-cover.jpg";

import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { disconnectPera } from "../../../store/settings/settingsSlice";

export const UtilitySettingsMethods = () => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <Card border="light" className="text-center p-0 mb-4">
      {/* <div
        style={{ backgroundImage: `url(${ProfileCover})` }}
        className="profile-cover rounded-top"
      /> */}
      <Card.Body className="">
        {/* <Card.Img
          src={Profile1}
          alt="Neil Portrait"
          className="user-avatar large-avatar rounded-circle mx-auto mt-n7 mb-4"
        /> */}
        <Card.Title>Helper Methods</Card.Title>

        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            // peraWallet.disconnect();
            // setAccountAddress(null);

            dispatch(disconnectPera(settings.selectedAlgorandNetwork));
          }}
        >
          Disconnect Pera Wallet Session
        </Button>
      </Card.Body>
    </Card>
  );
};
