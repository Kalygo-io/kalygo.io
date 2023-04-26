import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import { useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../store/hooks";
import {
  faRectangleList,
  faCog,
  faInfo,
  faBank,
  faCircleHalfStroke,
  faGlobe,
  faTimes,
  faSignOutAlt,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";

import { MdGeneratingTokens } from "react-icons/md";

import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { RoutesData } from "../routes";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import Hive from "../assets/img/icons/hive.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";

const Sidebar = (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const settings = useAppSelector((state) => state.settings);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button
            as={Nav.Link}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between bg-secondary"
      : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={RoutesData.Presentation.path}
        >
          <Image src={Hive} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          className="bg-secondary"
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-end justify-content-md-center pb-3">
              <Nav.Link
                className="bg-secondary collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon size="xl" icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem
                title={settings.brandName}
                link={RoutesData.Presentation.path}
                image={Hive}
              />

              <NavItem
                title="Overview"
                link={RoutesData.DashboardOverview.path}
                icon={faGlobe}
              />
              <NavItem
                title="Transactions"
                icon={faRectangleList}
                link={RoutesData.Transactions.path}
              />
              <NavItem
                title="Contracts"
                icon={faCircleHalfStroke}
                link={RoutesData.ContractOptions.path}
              />
              {/* <CollapsableNavItem
                eventKey="dashboard/tokens/"
                title="Tokens"
                icon={faCoins}
              >
                <NavItem
                  title="ASAs"
                  link={RoutesData.TokenOptions_ASAs.path}
                />
                <NavItem
                  title="NFTs"
                  link={RoutesData.TokenOptions_NFTs.path}
                />
              </CollapsableNavItem> */}
              <NavItem
                title="Settings"
                icon={faCog}
                link={RoutesData.Settings.path}
              />

              <NavItem
                title="Support"
                icon={faInfo}
                link={RoutesData.Support.path}
              />

              {/* <NavItem title="Test" icon={faInfo} link={RoutesData.Test.path} /> */}

              <Dropdown.Divider className="my-3 border-indigo" />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default Sidebar;
