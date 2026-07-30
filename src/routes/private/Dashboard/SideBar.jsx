import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
  const [active, setActive] = useState("dashboard");

  const menus = [
    { id: "dashboard", title: "پیشخوان", icon: <BsGrid1X2Fill /> },
    { id: "requests", title: "درخواست‌ها", icon: <BsClipboardCheckFill /> },
    { id: "wallet", title: "کیف پول", icon: <BsWallet2 /> },
    { id: "account", title: "حساب کاربری", icon: <BsPersonFill /> },
    { id: "friends", title: "دعوت دوستان", icon: <BsPeopleFill /> },
    { id: "support", title: "پشتیبانی", icon: <BsHeadset /> },
    { id: "about", title: "درباره ما", icon: <BsInfoCircleFill /> },
  ];

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
              <h5 className="company-title text-truncate">شرکت ابتکار</h5>
              <span className="company-subtitle">پنل مدیریت سیستم</span>
            </div>
          </div>
          <div className="sidebar-divider"></div>
        </Col>

        <Col className="sidebar-menu-container custom-scrollbar">
          {menus.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`sidebar-btn ${active === item.id ? "active-btn" : ""}`}
            >
              <div className="btn-icon">{item.icon}</div>
              <span className="btn-text">{item.title}</span>
              <div className="btn-arrow">
                <BsChevronLeft />
              </div>
            </button>
          ))}
        </Col>

        <Col xs="auto" className="sidebar-footer-section">
          <div className="sidebar-divider "></div>
          <button className="logout-button" onClick={handleLogout}>
            <BsBoxArrowRight size={18} />
            <span>خروج از حساب کاربری</span>
          </button>
        </Col>

      </Row>
    </aside>
  );
}

export default SideBar;