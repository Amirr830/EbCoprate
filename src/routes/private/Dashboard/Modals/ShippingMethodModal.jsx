import React, { useState, useCallback } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
    FaTruck,
    FaMotorcycle,
    FaBoxOpen,
    FaCheckCircle,
} from "react-icons/fa";
import "../Css/ShippingMethodModal.css";

const shippingMethods = [
    {
        id: "normal",
        serviceSpeed: 1,
        title: "ارسال عادی",
        description: "ارسال با زمان‌بندی معمول",
        icon: <FaTruck />,
        badge: "پیشنهادی",
    },
    {
        id: "express",
        serviceSpeed: 2,
        title: "ارسال فوری",
        description: "ارسال سریع در کوتاه‌ترین زمان",
        icon: <FaMotorcycle />,
        badge: "سریع",
    },
    {
        id: "scheduled",
        serviceSpeed: 3,
        title: "ارسال زمان‌بندی شده",
        description: "انتخاب زمان مناسب برای ارسال",
        icon: <FaBoxOpen />,
        badge: "انعطاف‌پذیر",
    },
];

function ShippingMethodModal({ children, onSelect }) {
    const [show, setShow] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("");

    const handleShow = useCallback(() => {
        setShow(true);
    }, []);

    const handleClose = useCallback(() => {
        setShow(false);
    }, []);

    const handleSelect = useCallback(
        (method) => {
            setSelectedMethod(method.id);

            if (onSelect) {
                onSelect(method.serviceSpeed);
            }

            setShow(false);
        },
        [onSelect]
    );

    return (
        <>
            <div
                onClick={handleShow}
                style={{ cursor: "pointer" }}
            >
                {children}
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                centered
                dir="rtl"
                className="shipping-method-modal"
                animation={true}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Body className="p-0">
                    <div className="shipping-modal-container">

                        <div className="shipping-modal-header">

                            <button
                                type="button"
                                className="shipping-close-btn"
                                onClick={handleClose}
                            >
                                ×
                            </button>

                            <div className="shipping-header-content">
                            </div>

                            <p className="shipping-modal-title">
                                نحوه ارسال
                            </p>

                            <div className="shipping-header-icon">
                                <FaTruck />
                            </div>

                        </div>

                        <div className="shipping-modal-content">

                            <Row className="g-3">
                                {shippingMethods.map((method) => (
                                    <Col
                                        xs={12}
                                        key={method.id}
                                    >
                                        <button
                                            type="button"
                                            className={`shipping-method-card ${
                                                selectedMethod === method.id
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => handleSelect(method)}
                                        >

                                            <div className="shipping-method-icon">
                                                {method.icon}
                                            </div>

                                            <div className="shipping-method-info">

                                                <div className="shipping-method-title">

                                                    <p>
                                                        {method.title}
                                                    </p>

                                                    <span className="shipping-method-badge">
                                                        {method.badge}
                                                    </span>

                                                </div>

                                                <span className="shipping-method-description">
                                                    {method.description}
                                                </span>

                                            </div>

                                            <div className="shipping-method-check">

                                                {selectedMethod === method.id ? (
                                                    <FaCheckCircle />
                                                ) : (
                                                    <span></span>
                                                )}

                                            </div>

                                        </button>
                                    </Col>
                                ))}
                            </Row>

                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ShippingMethodModal;