import React from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Css/SideBar.css";

import {
  BsGrid1X2Fill,
  BsClipboardCheckFill,
  BsWallet2,
  BsPeopleFill,
  BsPersonFill,
  BsHeadset,
  BsInfoCircleFill,
  BsBoxArrowRight,
  BsPersonCircle,
  BsChevronLeft
} from "react-icons/bs";

import paths from "../../../../src/app/paths.json";
import Storages from "../../../app/storages";
import answerModal from "../../../modals/answerModal";

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      id: "dashboard",
      title: "پیشخوان",
      icon: <BsGrid1X2Fill />
    },
    {
      id: "requests",
      title: "درخواست‌ها",
      icon: <BsClipboardCheckFill />
    },
    {
      id: "wallet",
      title: "کیف پول",
      icon: <BsWallet2 />
    },
    {
      id: "account",
      title: "حساب کاربری",
      icon: <BsPersonFill />
    },
    {
      id: "friends",
      title: "دعوت دوستان",
      icon: <BsPeopleFill />
    },
    {
      id: "support",
      title: "پشتیبانی",
      icon: <BsHeadset />
    },
    {
      id: "about",
      title: "درباره ما",
      icon: <BsInfoCircleFill />
    }
  ];

  const getActiveMenu = () => {
    const currentPath = location.pathname;

    if (currentPath === paths.private.dashboard) {
      return "dashboard";
    }

    if (
      currentPath === "/control-panel/71/definitions/request" ||
      currentPath.startsWith("/control-panel/71/definitions/request/")
    ) {
      return "requests";
    }

    if (
      currentPath === paths.private.definitions.Wallet ||
      currentPath.startsWith(`${paths.private.definitions.Wallet}/`)
    ) {
      return "wallet";
    }

    if (
      currentPath === paths.private.definitions.userAccount ||
      currentPath.startsWith(`${paths.private.definitions.userAccount}/`)
    ) {
      return "account";
    }

    if (
      currentPath === "/control-panel/68/definitions/support" ||
      currentPath.startsWith("/control-panel/68/definitions/support/")
    ) {
      return "support";
    }

    return "";
  };

  const active = getActiveMenu();

  const handleMenuClick = (item) => {
    if (item.id === "dashboard") {
      navigate(paths.private.dashboard);
    }

    if (item.id === "requests") {
      navigate("/control-panel/71/definitions/request");
    }

    if (item.id === "wallet") {
      navigate(paths.private.definitions.Wallet);
    }

    if (item.id === "account") {
      navigate(paths.private.definitions.userAccount);
    }

    if (item.id === "support") {
      navigate("/control-panel/68/definitions/support");
    }
  };

  const handleLogout = () => {
    answerModal.show(
      "آیا مایل به خروج از حساب کاربری هستید؟",
      () => {
        Storages.removeUserToken();
        navigate(paths.public.login);
      },
      () => {}
    );
  };

  return (
    <aside className="sidebar-wrapper">
      <Row className="sidebar-layout g-0 h-100">

        <Col xs="auto" className="sidebar-header-section">
          <div className="d-flex align-items-center gap-3 sidebar-top">

            <div className="profile-image">
              <BsPersonCircle size={32} />
            </div>

            <div>
              <h5 className="company-title text-truncate">
                شرکت ابتکار
              </h5>

              <span className="company-subtitle">
                پنل مدیریت سیستم
              </span>
            </div>

          </div>

          <div className="sidebar-divider"></div>
        </Col>

        <Col className="sidebar-menu-container custom-scrollbar">

          {menus.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`sidebar-btn ${
                active === item.id ? "active-btn" : ""
              }`}
            >
              <div className="btn-icon">
                {item.icon}
              </div>

              <span className="btn-text">
                {item.title}
              </span>

              <div className="btn-arrow">
                <BsChevronLeft />
              </div>
            </button>
          ))}

        </Col>

        <Col xs="auto" className="sidebar-footer-section">

          <div className="sidebar-divider"></div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <BsBoxArrowRight size={18} />

            <span>
              خروج از حساب کاربری
            </span>
          </button>

        </Col>

      </Row>
    </aside>
  );
}

export default SideBar;