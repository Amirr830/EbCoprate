import React, { useState } from "react";
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
  BsBoxArrowRight,
  BsPersonCircle,
  BsChevronLeft,
  BsChevronDown
} from "react-icons/bs";

import paths from "../../../../src/app/paths.json";
import Storages from "../../../app/storages";
import answerModal from "../../../modals/answerModal";
import InviteFriendsModal from "../modals/InviteFriendsModal";

function SideBar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

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
    // {
    //   id: "friends",
    //   title: "دعوت دوستان",
    //   icon: <BsPeopleFill />
    // },
    {
      id: "support",
      title: "پشتیبانی",
      icon: <BsHeadset />
    },
    // {
    //   id: "about",
    //   title: "درباره ما",
    //   icon: <BsInfoCircleFill />
    // }
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

  const handleSupportDropdownToggle = () => {
    setSupportDropdownOpen((prev) => !prev);
  };

  const handleGoToTicket = () => {
    setSupportDropdownOpen(false);
    navigate("/control-panel/69/definitions/ticket");
  };

  const handleGoToCommentSuggestion = () => {
    setSupportDropdownOpen(false);
    navigate("/control-panel/70/definitions/commentSuggestion");
  };

  const handlePanelTraining = () => {
    setSupportDropdownOpen(false);
  };

  const handleLogout = () => {
    answerModal.show(
      "آیا مایل به خروج از حساب کاربری هستید؟",
      () => {
        Storages.removeUserToken();
        navigate(paths.public.login);
      },
      () => { }
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
              className={`sidebar-btn ${active === item.id ? "active-btn" : ""
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

          <div className="mobile-sidebar-actions d-md-none">

<InviteFriendsModal> 
  <button 
    type="button" 
    className="sidebar-btn sidebar-action-btn"
    onClick={onClose}
  > 
    <div className="btn-icon"> 
      <BsPeopleFill /> 
    </div> 

    <span className="btn-text"> 
      دعوت از دوستان 
    </span> 

    <div className="btn-arrow"> 
      <BsChevronLeft /> 
    </div> 
  </button> 
</InviteFriendsModal>

            <div className="support-training-wrapper">

              <button
                type="button"
                className={`sidebar-btn sidebar-action-btn ${supportDropdownOpen
                    ? "support-dropdown-active"
                    : ""
                  }`}
                onClick={handleSupportDropdownToggle}
                aria-expanded={supportDropdownOpen}
              >
                <div className="btn-icon">
                  <BsHeadset />
                </div>

                <span className="btn-text">
                  پشتیبانی و آموزش
                </span>

                <div className="btn-arrow support-dropdown-arrow">
                  <BsChevronDown
                    className={
                      supportDropdownOpen
                        ? "support-arrow-open"
                        : ""
                    }
                  />
                </div>
              </button>

              {supportDropdownOpen && (
                <div className="support-dropdown-menu">

                  <button
                    type="button"
                    className="support-dropdown-item"
                    onClick={handleGoToTicket}
                  >
                    <span>
                      ارسال تیکت جدید
                    </span>

                    <BsChevronLeft />
                  </button>

                  <button
                    type="button"
                    className="support-dropdown-item"
                    onClick={handleGoToCommentSuggestion}
                  >
                    <span>
                      نظرات و پیشنهادات
                    </span>

                    <BsChevronLeft />
                  </button>

                  <button
                    type="button"
                    className="support-dropdown-item"
                    onClick={handlePanelTraining}
                  >
                    <span>
                      آموزش استفاده از پنل
                    </span>

                    <BsChevronLeft />
                  </button>

                </div>
              )}

            </div>

          </div>

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