
import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
    BsGrid1X2Fill,
    BsClipboardCheckFill,
    BsWallet2,
    BsPeopleFill,
    BsPersonFill,
    BsHeadset,
    BsBoxArrowRight,
    BsChevronDown,
    BsChevronLeft
} from "react-icons/bs";
import "./Css/SideBar.css";
import paths from "../../../../src/app/paths.json";
import Storages from "../../../app/storages";
import answerModal from "../../../modals/answerModal";

const SideBar = ({ isOpen = true, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    const menus = [
        {
            id: "dashboard",
            title: "پیشخوان",
            icon: <BsGrid1X2Fill />,
            path: paths.private.dashboard
        },
        {
            id: "requests",
            title: "درخواست‌ها",
            icon: <BsClipboardCheckFill />,
            path: "/control-panel/71/definitions/request"
        },
        {
            id: "wallet",
            title: "کیف پول",
            icon: <BsWallet2 />,
            path: paths.private.definitions.Wallet
        },
        {
            id: "account",
            title: "حساب کاربری",
            icon: <BsPersonFill />,
            path: paths.private.definitions.userAccount
        },
        {
            id: "support",
            title: "پشتیبانی",
            icon: <BsHeadset />,
            path: "/control-panel/68/definitions/support"
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

    const activeMenu = getActiveMenu();

    const handleMenuClick = (menu) => {
        if (menu.id === "support") {
            if (collapsed) {
                setCollapsed(false);
            }

            setSupportDropdownOpen((prev) => !prev);
            return;
        }

        navigate(menu.path);

        if (onClose) {
            onClose();
        }
    };

    const handleInviteClick = () => {
        navigate("/control-panel/72/definitions/inviteFriend");

        if (onClose) {
            onClose();
        }
    };

    const handleTicketClick = () => {
        navigate("/control-panel/69/definitions/ticket");

        if (onClose) {
            onClose();
        }
    };

    const handleCommentSuggestionClick = () => {
        navigate("/control-panel/70/definitions/commentSuggestion");

        if (onClose) {
            onClose();
        }
    };

    const handleLogout = () => {
        answerModal.show(
            "آیا از خروج از حساب کاربری مطمئن هستید؟",
            () => {
                Storages.removeUserToken();
                navigate(paths.public.login);
            }
        );
    };

    const handleCollapse = () => {
        setCollapsed((prev) => !prev);
        setSupportDropdownOpen(false);
    };

    return (
        <div
            className={`sidebar-wrapper ${
                collapsed ? "sidebar-collapsed" : "sidebar-expanded"
            } ${
                isOpen ? "sidebar-visible" : "sidebar-hidden"
            }`}
        >
            <Row className="sidebar-layout g-0 h-100">
                <Col xs={12} className="sidebar-column">
                    <div className="sidebar-container">
                        <div className="sidebar-top">
                            <div className="sidebar-brand-area">
                                <button
                                    type="button"
                                    className="sidebar-menu-toggle"
                                    onClick={handleCollapse}
                                    aria-label={collapsed ? "باز کردن منو" : "بستن منو"}
                                >
                                    <span className="menu-line menu-line-one"></span>
                                    <span className="menu-line menu-line-two"></span>
                                    <span className="menu-line menu-line-three"></span>
                                </button>

                                <div className="sidebar-brand-name">
                                    شرکت ابتکار
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-menu-section">
                            <div className="sidebar-menu-title">
                                <span>منوی اصلی</span>
                            </div>

                            <div className="sidebar-menu-list">
                                {menus.map((menu) => {
                                    const isActive = activeMenu === menu.id;

                                    return (
                                        <div
                                            key={menu.id}
                                            className="sidebar-menu-item-wrapper"
                                        >
                                            <button
                                                type="button"
                                                className={`sidebar-menu-item ${
                                                    isActive
                                                        ? "sidebar-menu-item-active"
                                                        : ""
                                                } ${
                                                    menu.id === "support" &&
                                                    supportDropdownOpen
                                                        ? "sidebar-menu-item-open"
                                                        : ""
                                                }`}
                                                onClick={() => handleMenuClick(menu)}
                                            >
                                                <span className="sidebar-menu-icon">
                                                    {menu.icon}
                                                </span>

                                                <span className="sidebar-menu-text">
                                                    {menu.title}
                                                </span>

                                                {collapsed && (
                                                    <span className="sidebar-tooltip">
                                                        {menu.title}
                                                    </span>
                                                )}

                                                {menu.id === "support" && !collapsed && (
                                                    <span className="sidebar-menu-arrow">
                                                        {supportDropdownOpen ? (
                                                            <BsChevronDown />
                                                        ) : (
                                                            <BsChevronLeft />
                                                        )}
                                                    </span>
                                                )}
                                            </button>

                                            {menu.id === "support" &&
                                                supportDropdownOpen &&
                                                !collapsed && (
                                                    <div className="sidebar-support-dropdown">
                                                        <button
                                                            type="button"
                                                            className="sidebar-support-item"
                                                            onClick={handleTicketClick}
                                                        >
                                                            <BsClipboardCheckFill />
                                                            <span>ثبت تیکت</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="sidebar-support-item"
                                                            onClick={handleCommentSuggestionClick}
                                                        >
                                                            <BsPeopleFill />
                                                            <span>نظرات و پیشنهادات</span>
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="sidebar-bottom">
                            <div className="sidebar-mobile-actions d-md-none">
                                <button
                                    type="button"
                                    className="sidebar-action-button"
                                    onClick={handleInviteClick}
                                >
                                    <BsPeopleFill />
                                    <span>دعوت از دوستان</span>
                                </button>

                                <button
                                    type="button"
                                    className="sidebar-action-button"
                                    onClick={handleTicketClick}
                                >
                                    <BsHeadset />
                                    <span>ثبت تیکت</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                className="sidebar-logout-button"
                                onClick={handleLogout}
                            >
                                <BsBoxArrowRight />

                                <span>خروج از حساب</span>

                                {collapsed && (
                                    <span className="sidebar-tooltip">
                                        خروج
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SideBar;
