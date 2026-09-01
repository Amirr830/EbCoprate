import React, { useMemo, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import {
    FaChevronRight,
    FaSearch,
    FaPhoneAlt,
    FaTicketAlt,
    FaPlus,
    FaQuestionCircle,
    FaHeadset,
    FaArrowLeft,
    FaEnvelope
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./css/Support.css";

function Support() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    const supportQuestions = [
        {
            id: 1,
            title: "چگونه می‌توانم درخواست خود را لغو کنم؟",
            description: "برای لغو درخواست، وارد بخش درخواست‌های خود شوید و در صورتی که درخواست هنوز نهایی نشده باشد، گزینه لغو درخواست را انتخاب کنید."
        },
        {
            id: 2,
            title: "هزینه ارسال مرسوله چگونه محاسبه می‌شود؟",
            description: "هزینه ارسال بر اساس فاصله مبدا و مقصد، نوع وسیله نقلیه، شرایط سرویس و خدمات انتخابی شما محاسبه می‌شود."
        },
        {
            id: 3,
            title: "چطور می‌توانم اطلاعات درخواست خود را مشاهده کنم؟",
            description: "از بخش درخواست‌های فعلی می‌توانید اطلاعات کامل درخواست و وضعیت آن را مشاهده کنید."
        },
        {
            id: 4,
            title: "چگونه موجودی کیف پول خود را افزایش دهم؟",
            description: "از بخش کیف پول وارد قسمت افزایش موجودی شوید، مبلغ مورد نظر را وارد کرده و عملیات پرداخت را تکمیل کنید."
        },
        {
            id: 5,
            title: "چگونه می‌توانم وضعیت درخواست خود را پیگیری کنم؟",
            description: "از قسمت درخواست‌های فعلی می‌توانید وضعیت لحظه‌ای درخواست خود را مشاهده و پیگیری کنید."
        },
        {
            id: 6,
            title: "در صورت بروز مشکل چه کاری انجام دهم؟",
            description: "در صورت بروز هرگونه مشکل می‌توانید از طریق ثبت تیکت جدید با کارشناسان پشتیبانی در ارتباط باشید."
        }
    ];

    const filteredQuestions = useMemo(() => {
        const normalizedSearchText = searchText.trim().toLowerCase();

        if (!normalizedSearchText) {
            return supportQuestions;
        }

        return supportQuestions.filter((item) => {
            const title = item.title.toLowerCase();
            const description = item.description.toLowerCase();

            return (
                title.includes(normalizedSearchText) ||
                description.includes(normalizedSearchText)
            );
        });
    }, [searchText]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleNewTicket = () => {
        navigate("/control-panel/69/definitions/ticket");
    };

    return (
        <div className="support-page">
            <Container fluid className="support-container">
                <Row className="support-main-row">
                    <Col xs={12}>
                        <div className="support-main-card">
                            <div className="support-hero">
                                <Row className="align-items-center">
                                    <Col xs={12} md={8}>
                                        <div className="support-hero-content">
                                            <div className="support-hero-text">
                                                <button
                                                    type="button"
                                                    className="support-ticket-button support-ticket-button-top"
                                                    onClick={handleNewTicket}
                                                >
                                                    <FaPlus />
                                                    <span>
                                                        ارسال تیکت جدید
                                                    </span>
                                                    
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="support-phone-card">
                                            <div className="support-phone-icon">
                                                <FaPhoneAlt />
                                            </div>
                                            <div className="support-phone-info">
                                                <span>پشتیبانی تلفنی</span>
                                                <strong>1890</strong>
                                                <small>آماده پاسخگویی به شما</small>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <Row className="support-content-row">
                                <Col xs={12} lg={12}>
                                    <div className="support-section">
                                        <div className="support-section-header">
                                            <div className="support-section-title">
                                                <div className="support-section-icon">
                                                    <FaQuestionCircle />
                                                </div>
                                                <div>
                                                    <span>
                                                        پرسش‌های متداول
                                                    </span>
                                                    <small>
                                                        پاسخ سریع به سوالات شما
                                                    </small>
                                                </div>
                                            </div>
                                            <span className="support-question-count">
                                                {filteredQuestions.length} سوال
                                            </span>
                                        </div>
                                        {filteredQuestions.length > 0 ? (
                                            <Accordion
                                                className="support-accordion"
                                                defaultActiveKey="0"
                                            >
                                                {filteredQuestions.map((item, index) => (
                                                    <Accordion.Item
                                                        eventKey={String(index)}
                                                        key={item.id}
                                                    >
                                                        <Accordion.Header>
                                                            <div className="support-question-header">
                                                                <div className="support-question-number">
                                                                    {index + 1}
                                                                </div>
                                                                <span>
                                                                    {item.title}
                                                                </span>
                                                            </div>
                                                        </Accordion.Header>
                                                        <Accordion.Body>
                                                            <div className="support-answer-content">
                                                                {item.description}
                                                            </div>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                ))}
                                            </Accordion>
                                        ) : (
                                            <div className="support-empty">
                                                <div className="support-empty-icon">
                                                    <FaSearch />
                                                </div>
                                                <span>
                                                    پرسشی پیدا نشد
                                                </span>
                                                <small>
                                                    نتیجه‌ای مطابق جستجوی شما وجود ندارد.
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Support;