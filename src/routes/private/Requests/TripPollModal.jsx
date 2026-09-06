import "./css/TripPollModal.css";

import React, { useEffect, useState } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import {
    BsStarFill,
    BsEmojiFrownFill,
    BsCheckCircleFill,
    BsArrowRight,
    BsBoxSeam,
    BsClockFill,
    BsPersonCheckFill,
    BsShieldCheck,
    BsHeartFill,
    BsGeoAltFill,
    BsClockHistory,
    BsTelephoneFill,
    BsX
} from "react-icons/bs";

export default function TripPollModal(props) {
    const [show, setShow] = useState(false);
    const [params, setParams] = useState(props?.params);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (show) {
            setSelectedType(null);
            setSelectedReasons([]);
            setSubmitted(false);
        }
    }, [show]);

    useEffect(() => {
        setParams(props?.params);
    }, [props?.params]);

    const handleShow = (e) => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedType(null);
        setSelectedReasons([]);
        setSubmitted(false);
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setSelectedReasons([]);
        setSubmitted(false);
    };

    const handleReasonSelect = (reason) => {
        setSelectedReasons((prev) => {
            if (prev.includes(reason.id)) {
                return prev.filter((item) => item !== reason.id);
            }

            return [...prev, reason.id];
        });
    };

    const handleBack = () => {
        setSelectedType(null);
        setSelectedReasons([]);
        setSubmitted(false);
    };

    const handleSubmit = () => {
        if (!selectedType || selectedReasons.length === 0) {
            return;
        }

        console.log("Trip Poll:", {
            type: selectedType,
            reasons: selectedReasons,
            params: params
        });

        setSubmitted(true);
    };

    const excellentReasons = [
        {
            id: 1,
            title: "کالا سالم به مقصد رسید",
            description: "مرسوله بدون آسیب و کاملاً سالم تحویل شد",
            icon: <BsBoxSeam />
        },
        {
            id: 2,
            title: "سفر سریع و به‌موقع بود",
            description: "زمان‌بندی سفر کاملاً مناسب بود",
            icon: <BsClockFill />
        },
        {
            id: 3,
            title: "رفتار راننده عالی بود",
            description: "راننده محترم، خوش‌برخورد و حرفه‌ای بود",
            icon: <BsPersonCheckFill />
        },
        {
            id: 4,
            title: "سفر امن بود",
            description: "سفر با آرامش و امنیت کامل انجام شد",
            icon: <BsShieldCheck />
        },
        {
            id: 5,
            title: "از کیفیت سفر راضی بودم",
            description: "تجربه کلی من از این سفر بسیار خوب بود",
            icon: <BsHeartFill />
        }
    ];

    const badReasons = [
        {
            id: 6,
            title: "کالا آسیب دیده بود",
            description: "مرسوله با آسیب یا مشکل به مقصد رسید",
            icon: <BsBoxSeam />
        },
        {
            id: 7,
            title: "سفر با تأخیر انجام شد",
            description: "زمان رسیدن راننده یا تحویل مناسب نبود",
            icon: <BsClockHistory />
        },
        {
            id: 8,
            title: "رفتار راننده مناسب نبود",
            description: "نحوه برخورد یا رفتار راننده رضایت‌بخش نبود",
            icon: <BsPersonCheckFill />
        },
        {
            id: 9,
            title: "مشکل یا ناهماهنگی در مسیر",
            description: "در طول سفر مشکل یا ناهماهنگی ایجاد شد",
            icon: <BsGeoAltFill />
        },
        {
            id: 10,
            title: "نیاز به پیگیری داشتم",
            description: "برای این سفر نیاز به پشتیبانی یا پیگیری وجود داشت",
            icon: <BsTelephoneFill />
        }
    ];

    const reasons =
        selectedType === "excellent"
            ? excellentReasons
            : badReasons;

    let newFirstChild;

    if (props?.children) {
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            {
                onClick: handleShow
            }
        );
    }

    return (
        <>
            {newFirstChild}

            <Modal
                show={show}
                centered
                onHide={handleClose}
                size="lg"
                className="trip-poll-modal"
                dialogClassName="trip-poll-modal-dialog"
                backdropClassName="trip-poll-modal-backdrop"
                dir="rtl"
            >
                <Modal.Body className="trip-poll-modal-body">
                    <Container fluid className="trip-poll-container">

                        <Row className="trip-poll-header-row">
                            <Col xs={12}>
                                <div className="trip-poll-header">

                                    <button
                                        type="button"
                                        className="trip-poll-close-button"
                                        onClick={handleClose}
                                        aria-label="بستن"
                                    >
                                        <BsX />
                                    </button>

                                    <div className="trip-poll-header-content">
                                        <div className="trip-poll-title">
                                            نظرسنجی سفر
                                        </div>
                                    </div>


                                </div>
                            </Col>
                        </Row>

                        {!selectedType && !submitted && (
                            <Row className="trip-poll-content-row">

                                <Col xs={12}>
                                    <div className="trip-poll-question">
                                        <div className="trip-poll-question-title">
                                            تجربه شما از این سفر چطور بود؟
                                        </div>

                                        <div className="trip-poll-question-description">
                                            یکی از گزینه‌های زیر را انتخاب کنید
                                        </div>
                                    </div>
                                </Col>

                                <Col
                                    xs={12}
                                    md={6}
                                    className="trip-poll-type-column"
                                >
                                    <button
                                        type="button"
                                        className="trip-poll-type-card trip-poll-type-excellent"
                                        onClick={() =>
                                            handleTypeSelect("excellent")
                                        }
                                    >
                                        <div className="trip-poll-type-icon">
                                            <BsStarFill />
                                        </div>

                                        <div className="trip-poll-type-content">
                                            <div className="trip-poll-type-title">
                                                سفر عالی بود
                                            </div>

                                            <div className="trip-poll-type-description">
                                                از این سفر کاملاً راضی بودم
                                            </div>
                                        </div>

                                        <div className="trip-poll-type-arrow">
                                            <BsArrowRight />
                                        </div>
                                    </button>
                                </Col>

                                <Col
                                    xs={12}
                                    md={6}
                                    className="trip-poll-type-column"
                                >
                                    <button
                                        type="button"
                                        className="trip-poll-type-card trip-poll-type-bad"
                                        onClick={() =>
                                            handleTypeSelect("bad")
                                        }
                                    >
                                        <div className="trip-poll-type-icon">
                                            <BsEmojiFrownFill />
                                        </div>

                                        <div className="trip-poll-type-content">
                                            <div className="trip-poll-type-title">
                                                سفر بد بود
                                            </div>

                                            <div className="trip-poll-type-description">
                                                در این سفر مشکلی وجود داشت
                                            </div>
                                        </div>

                                        <div className="trip-poll-type-arrow">
                                            <BsArrowRight />
                                        </div>
                                    </button>
                                </Col>

                            </Row>
                        )}

                        {selectedType && !submitted && (
                            <Row className="trip-poll-reasons-row">

                                <Col xs={12}>
                                    <div className="trip-poll-selected-type">

                                        <div
                                            className={`trip-poll-selected-badge ${selectedType === "excellent"
                                                    ? "trip-poll-selected-badge-excellent"
                                                    : "trip-poll-selected-badge-bad"
                                                }`}
                                        >
                                            {selectedType === "excellent" ? (
                                                <>
                                                    <BsStarFill />
                                                    <span>
                                                        سفر عالی بود
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <BsEmojiFrownFill />
                                                    <span>
                                                        سفر بد بود
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="trip-poll-back-button"
                                            onClick={handleBack}
                                        >
                                            <BsArrowRight />
                                            <span>
                                                تغییر انتخاب
                                            </span>
                                        </button>

                                    </div>
                                </Col>

                                <Col xs={12}>
                                    <div className="trip-poll-reasons-title">
                                        {selectedType === "excellent"
                                            ? "چه چیزی باعث شد از سفر راضی باشی؟"
                                            : "چه مشکلی در این سفر وجود داشت؟"}
                                    </div>

                                    <div className="trip-poll-reasons-description">
                                        می‌تونی یک یا چند مورد رو انتخاب کنی
                                    </div>
                                </Col>

                                {reasons.map((reason) => (
                                    <Col
                                        key={reason.id}
                                        xs={12}
                                        sm={6}
                                        lg={6}
                                        className="trip-poll-reason-column"
                                    >
                                        <button
                                            type="button"
                                            className={`trip-poll-reason-card ${selectedReasons.includes(
                                                reason.id
                                            )
                                                    ? "trip-poll-reason-card-selected"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                handleReasonSelect(reason)
                                            }
                                        >
                                            <div className="trip-poll-reason-icon">
                                                {reason.icon}
                                            </div>

                                            <div className="trip-poll-reason-content">
                                                <div className="trip-poll-reason-title">
                                                    {reason.title}
                                                </div>

                                                <div className="trip-poll-reason-description">
                                                    {reason.description}
                                                </div>
                                            </div>

                                            <div className="trip-poll-reason-check">
                                                <BsCheckCircleFill />
                                            </div>
                                        </button>
                                    </Col>
                                ))}

                                <Col xs={12}>
                                    <div className="trip-poll-actions">

                                        <button
                                            type="button"
                                            className={`trip-poll-action-button trip-poll-submit-action ${selectedReasons.length === 0
                                                    ? "trip-poll-submit-disabled"
                                                    : ""
                                                }`}
                                            onClick={handleSubmit}
                                            disabled={
                                                selectedReasons.length === 0
                                            }
                                        >
                                            <BsCheckCircleFill />
                                            <span>
                                                ثبت
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            className="trip-poll-action-button trip-poll-close-action"
                                            onClick={handleClose}
                                        >
                                            <BsX />
                                            <span>
                                                بستن
                                            </span>
                                        </button>

                                    </div>
                                </Col>

                            </Row>
                        )}

                        {submitted && (
                            <Row className="trip-poll-success-row">
                                <Col xs={12}>
                                    <div className="trip-poll-success">

                                        <div className="trip-poll-success-icon">
                                            <BsCheckCircleFill />
                                        </div>

                                        <div className="trip-poll-success-title">
                                            ممنون از نظر ارزشمندت
                                        </div>

                                        <div className="trip-poll-success-description">
                                            نظر شما با موفقیت ثبت شد و به ما کمک می‌کند کیفیت سفرها را بهتر کنیم.
                                        </div>

                                        <button
                                            type="button"
                                            className="trip-poll-success-button"
                                            onClick={handleClose}
                                        >
                                            بستن
                                        </button>

                                    </div>
                                </Col>
                            </Row>
                        )}

                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}