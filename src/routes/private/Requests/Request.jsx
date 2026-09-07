import React, { useEffect, useState } from "react";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import {
    BsCheck2Circle,
    BsClockHistory,
    BsXCircle,
    BsCircleFill,
    BsSquareFill,
    BsCalendar3,
    BsTruck,
    BsBoxSeam,
    BsStarFill
} from "react-icons/bs";
import { FaBars, FaTimes, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/Request.css";
import SideBar from "../Dashboard/SideBar";
import TripPollModal from "./TripPollModal";

const getStaticRequests = () => {
    return [
        {
            id: 1,
            date: "دوشنبه ۲۵ آبان",
            time: "۱۴:۳۰",
            status: "تکمیل شده",
            statusType: "completed",
            origin: "سیدرضی، سه پلاک ۵۸",
            destination: "بلوار سجاد، ساختمان باران",
            vehicle: "موتور",
            price: "۲۵,۰۰۰"
        },
        {
            id: 2,
            date: "یکشنبه ۲۴ آبان",
            time: "۱۵:۱۰",
            status: "در حال انجام",
            statusType: "current",
            origin: "احمدآباد، فلسطین ۳",
            destination: "هاشمیه ۱۵، ساختمان ونوس",
            vehicle: "وانت سبک",
            price: "۶۵,۰۰۰"
        },
        {
            id: 3,
            date: "شنبه ۲۳ آبان",
            time: "۰۹:۳۰",
            status: "لغو شده",
            statusType: "cancelled",
            origin: "بلوار امامت، امامت ۲۰",
            destination: "بلوار خیام شمالی",
            vehicle: "سواری",
            price: "۴۰,۰۰۰"
        },
        {
            id: 4,
            date: "جمعه ۲۲ آبان",
            time: "۱۸:۴۵",
            status: "تکمیل شده",
            statusType: "completed",
            origin: "قاسم آباد، شاهد ۳۲",
            destination: "بلوار وکیل آباد، دانشجو ۱۰",
            vehicle: "موتور",
            price: "۳۲,۰۰۰"
        },
        {
            id: 5,
            date: "پنجشنبه ۲۱ آبان",
            time: "۱۲:۲۰",
            status: "در حال انجام",
            statusType: "current",
            origin: "الهیه، الهیه ۱۸",
            destination: "بلوار فردوسی، ساختمان آرمان",
            vehicle: "وانت سبک",
            price: "۷۰,۰۰۰"
        },
        {
            id: 6,
            date: "چهارشنبه ۲۰ آبان",
            time: "۱۱:۱۵",
            status: "لغو شده",
            statusType: "cancelled",
            origin: "بلوار پیروزی، پیروزی ۶",
            destination: "کوثر شمالی، کوثر ۱۲",
            vehicle: "سواری",
            price: "۴۵,۰۰۰"
        },
        {
            id: 7,
            date: "سه شنبه ۱۹ آبان",
            time: "۱۷:۰۰",
            status: "تکمیل شده",
            statusType: "completed",
            origin: "بلوار فردوسی، فرهاد ۱۲",
            destination: "میدان جانباز",
            vehicle: "وانت سبک",
            price: "۵۵,۰۰۰"
        },
        {
            id: 8,
            date: "دوشنبه ۱۸ آبان",
            time: "۱۰:۴۵",
            status: "در حال انجام",
            statusType: "current",
            origin: "بلوار هاشمیه، هاشمیه ۳",
            destination: "بلوار سجاد، بهارستان",
            vehicle: "موتور",
            price: "۳۵,۰۰۰"
        },
        {
            id: 9,
            date: "یکشنبه ۱۷ آبان",
            time: "۱۳:۲۰",
            status: "تکمیل شده",
            statusType: "completed",
            origin: "چهارراه دکترا",
            destination: "بلوار خیام",
            vehicle: "سواری",
            price: "۴۸,۰۰۰"
        },
        {
            id: 10,
            date: "شنبه ۱۶ آبان",
            time: "۰۸:۳۰",
            status: "لغو شده",
            statusType: "cancelled",
            origin: "بلوار وکیل آباد",
            destination: "میدان آزادی",
            vehicle: "موتور",
            price: "۳۰,۰۰۰"
        }
    ];
};

function Requests() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("completed");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const handleCloseMenu = () => {
        setShowMenu(false);
    };

    const handleShowMenu = () => {
        setShowMenu(true);
    };

    const handleWalletClick = () => {
        navigate("/control-panel/67/definitions/wallet");
    };

    const getStaticTabClass = () => {
        if (activeTab === "all") {
            return "requests-tabs-all";
        }

        if (activeTab === "completed") {
            return "requests-tabs-completed";
        }

        if (activeTab === "current") {
            return "requests-tabs-current";
        }

        if (activeTab === "cancelled") {
            return "requests-tabs-cancelled";
        }

        return "requests-tabs-all";
    };

    const getRequests = async () => {
        try {
            setLoading(true);

            const requestData = getStaticRequests();

            return requestData;
        } catch (error) {
            console.error(
                "خطا در دریافت درخواست‌ها:",
                error
            );

            return [];
        } finally {
            setLoading(false);
        }
    };

    const loadRequests = async () => {
        const result = await getRequests();

        if (Array.isArray(result)) {
            setRequests(result);
        } else {
            setRequests([]);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const tabs = [
        {
            id: "all",
            title: "همه",
            icon: <BsBoxSeam />
        },
        {
            id: "completed",
            title: "تکمیل شده",
            icon: <BsCheck2Circle />
        },
        {
            id: "current",
            title: "در حال انجام",
            icon: <BsClockHistory />
        },
        {
            id: "cancelled",
            title: "لغو شده",
            icon: <BsXCircle />
        }
    ];

    const getFilteredRequests = () => {
        if (activeTab === "all") {
            return requests;
        }

        if (activeTab === "completed") {
            return requests.filter((item) => {
                return (
                    item.statusType === "completed" ||
                    item.statusType === "delivered"
                );
            });
        }

        if (activeTab === "current") {
            return requests.filter((item) => {
                return (
                    item.statusType === "current" ||
                    item.statusType === "moving" ||
                    item.statusType === "pending"
                );
            });
        }

        if (activeTab === "cancelled") {
            return requests.filter((item) => {
                return item.statusType === "cancelled";
            });
        }

        return [];
    };

    const filteredRequests = getFilteredRequests();

    const getTabCount = (tabId) => {
        if (tabId === "all") {
            return requests.length;
        }

        if (tabId === "completed") {
            return requests.filter((item) => {
                return (
                    item.statusType === "completed" ||
                    item.statusType === "delivered"
                );
            }).length;
        }

        if (tabId === "current") {
            return requests.filter((item) => {
                return (
                    item.statusType === "current" ||
                    item.statusType === "moving" ||
                    item.statusType === "pending"
                );
            }).length;
        }

        if (tabId === "cancelled") {
            return requests.filter((item) => {
                return item.statusType === "cancelled";
            }).length;
        }

        return 0;
    };

    const getStatusClass = (request) => {
        if (
            request.statusType === "completed" ||
            request.statusType === "delivered"
        ) {
            return "completed";
        }

        if (
            request.statusType === "current" ||
            request.statusType === "moving" ||
            request.statusType === "pending"
        ) {
            return "current";
        }

        if (request.statusType === "cancelled") {
            return "cancelled";
        }

        return "current";
    };

    const getStatusIcon = (request) => {
        const statusClass = getStatusClass(request);

        if (statusClass === "completed") {
            return <BsCheck2Circle />;
        }

        if (statusClass === "cancelled") {
            return <BsXCircle />;
        }

        return <BsClockHistory />;
    };

    const getStatusTitle = (request) => {
        if (request.status) {
            return request.status;
        }

        if (request.statusType === "completed") {
            return "تکمیل شده";
        }

        if (request.statusType === "current") {
            return "در حال انجام";
        }

        if (request.statusType === "cancelled") {
            return "لغو شده";
        }

        return "";
    };

    const getSectionTitle = () => {
        if (activeTab === "all") {
            return "همه درخواست‌ها";
        }

        if (activeTab === "completed") {
            return "درخواست‌های تکمیل شده";
        }

        if (activeTab === "current") {
            return "درخواست‌های در حال انجام";
        }

        if (activeTab === "cancelled") {
            return "درخواست‌های لغو شده";
        }

        return "درخواست‌ها";
    };

    return (
        <div
            className={`requests-page ${getStaticTabClass()}`}
            dir="rtl"
        >
            <div className="requests-mobile-header d-md-none">
                <div className="requests-mobile-header-inner">

                    <button
                        type="button"
                        className="requests-mobile-menu-btn"
                        aria-label="باز کردن منو"
                        onClick={handleShowMenu}
                    >
                        <span className="requests-mobile-menu-icon">
                            <FaBars size={17} />
                        </span>

                        <span className="requests-mobile-menu-text">
                            منو
                        </span>
                    </button>

<div className="requests-mobile-page-title">
    <button
        type="button"
        className="requests-mobile-wallet-btn"
        onClick={handleWalletClick}
        aria-label="رفتن به کیف پول"
    >
        <span className="requests-mobile-wallet-icon">
            <FaWallet size={16} />
        </span>

        <span className="requests-mobile-wallet-content">
            <span className="requests-mobile-wallet-amount">
                ۲۵۰,۰۰۰ تومان
            </span>
        </span>
    </button>
</div>

                </div>
            </div>

            <Offcanvas
                show={showMenu}
                onHide={handleCloseMenu}
                placement="end"
                dir="rtl"
                className="custom-mobile-menu p-0"
            >
                <Offcanvas.Header className="d-flex justify-content-end align-items-center border-bottom pb-2 pt-3 px-3">
                    <button
                        type="button"
                        className="btn p-0 border-0 text-muted"
                        onClick={handleCloseMenu}
                    >
                        <FaTimes size={20} />
                    </button>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0 overflow-hidden">
                    <SideBar />
                </Offcanvas.Body>
            </Offcanvas>

            <Container
                fluid
                className="requests-container"
            >
                <Row className="requests-tabs-wrapper">
                    <Col xs={12}>
                        <div className="requests-tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`requests-tab ${activeTab === tab.id
                                        ? "requests-tab-active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setActiveTab(tab.id)
                                    }
                                >
                                    <div className="requests-tab-icon">
                                        {tab.icon}
                                    </div>

                                    <span>
                                        {tab.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Row className="requests-section-header align-items-center">
                    <Col
                        xs={8}
                        md={8}
                    >
                        <div className="requests-section-title">
                            {getSectionTitle()}
                        </div>
                    </Col>
                </Row>

                {loading ? (
                    <Row>
                        <Col xs={12}>
                            <div className="requests-loading">
                                <div className="requests-loading-spinner" />

                                <span>
                                    در حال دریافت اطلاعات...
                                </span>
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row className="requests-list">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request) => {
                                const statusClass =
                                    getStatusClass(request);

                                const shouldShowDetailButton =
                                    statusClass === "completed" ||
                                    statusClass === "cancelled";

                                return (
                                    <Col
                                        key={request.id}
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        xl={4}
                                        className="request-column"
                                    >
                                        <div
                                            className={`request-card request-card-${statusClass}`}
                                        >
                                            <div className="request-card-header">
                                                <div className="request-date-section">
                                                    <div className="request-date-icon">
                                                        <BsCalendar3 />
                                                    </div>

                                                    <div className="request-date-content">
                                                        <div
                                                            className="request-date"
                                                            style={{
                                                                fontSize: "14px"
                                                            }}
                                                        >
                                                            {request.date}
                                                        </div>

                                                        <div
                                                            className="request-time"
                                                            style={{
                                                                fontSize: "14px"
                                                            }}
                                                        >
                                                            {request.time}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`request-status-badge request-status-${statusClass}`}
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    {getStatusIcon(request)}

                                                    <span>
                                                        {getStatusTitle(request)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="request-main-divider" />

                                            <div className="request-route-container">
                                                <div className="request-location-item request-origin-item">
                                                    <div className="request-location-title">
                                                        <div className="request-point request-origin-point">
                                                            <BsCircleFill />
                                                        </div>

                                                        <span>
                                                            مبدا
                                                        </span>
                                                    </div>

                                                    <div className="request-location-address">
                                                        {request.origin}
                                                    </div>
                                                </div>

                                                <div className="request-route-arrow">
                                                    ←
                                                </div>

                                                <div className="request-location-item request-destination-item">
                                                    <div className="request-location-title">
                                                        <div className="request-point request-destination-point">
                                                            <BsSquareFill />
                                                        </div>

                                                        <span>
                                                            مقصد
                                                        </span>
                                                    </div>

                                                    <div className="request-location-address">
                                                        {request.destination}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="request-main-divider" />

                                            <div className="request-card-footer">
                                                <div className="request-vehicle-section">
                                                    <div className="request-vehicle-icon">
                                                        <BsTruck />
                                                    </div>

                                                    <div className="request-vehicle-content">
                                                        <span className="request-footer-label">
                                                            وسیله نقلیه
                                                        </span>

                                                        <span className="request-vehicle-name">
                                                            {request.vehicle}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="request-price-section">
                                                    <span className="request-footer-label">
                                                        هزینه :
                                                    </span>

                                                    <div className="request-price">
                                                        <span>
                                                            {request.price}
                                                        </span>

                                                        <small>
                                                            تومان
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>

                                            {shouldShowDetailButton && (
                                                <TripPollModal>
                                                    <button
                                                        type="button"
                                                        className={`request-detail-button request-detail-button-${statusClass}`}
                                                    >
                                                        <span className="request-detail-button-icon">
                                                            <BsStarFill />
                                                        </span>

                                                        <span className="request-detail-button-content">
                                                            <span className="request-detail-button-title">
                                                                نظرسنجی سفر
                                                            </span>
                                                        </span>

                                                        <span className="request-detail-button-arrow">
                                                            ←
                                                        </span>
                                                    </button>
                                                </TripPollModal>
                                            )}
                                        </div>
                                    </Col>
                                );
                            })
                        ) : (
                            <Col xs={12}>
                                <div className="requests-empty">
                                    <div className="requests-empty-icon">
                                        <BsBoxSeam />
                                    </div>

                                    <div className="requests-empty-title">
                                        درخواستی وجود ندارد
                                    </div>

                                    <div className="requests-empty-description">
                                        در حال حاضر موردی در این بخش وجود ندارد.
                                    </div>
                                </div>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default Requests;