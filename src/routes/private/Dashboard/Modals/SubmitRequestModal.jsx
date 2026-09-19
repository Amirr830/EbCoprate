import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import "../Css/SubmitRequestModal.css";

export default function AddDefMsgModal(props) {
    const [show, setShow] = useState(false);
    const [addToQuickRequest, setAddToQuickRequest] = useState(false);
    const [quickRequestName, setQuickRequestName] = useState("");
    const [serviceCost, setServiceCost] = useState(0);
    const [discount, setDiscount] = useState(0);

    const handleShow = () => {
        setAddToQuickRequest(false);
        setQuickRequestName("");
        setServiceCost(Number(props?.serviceCost || 0));
        setDiscount(0);
        setShow(true);
    };

    useEffect(() => {
        if (props?.open) {
            handleShow();
        }
    }, [props?.open, props?.serviceCost]);

    const handleClose = () => {
        setAddToQuickRequest(false);
        setQuickRequestName("");
        setShow(false);

        if (props?.onClose) {
            props.onClose();
        }
    };

    const handleQuickRequestChange = (e) => {
        const checked = e.target.checked;
        setAddToQuickRequest(checked);

        if (!checked) {
            setQuickRequestName("");
        }
    };

    const handleConfirm = () => {
        const name = addToQuickRequest
            ? quickRequestName.trim()
            : null;

        if (addToQuickRequest && !name) {
            return;
        }

        if (props?.onConfirm) {
            props.onConfirm(name);
        }

        setShow(false);
        setAddToQuickRequest(false);
        setQuickRequestName("");
    };

    let newFirstChild;

    if (props?.children) {
        newFirstChild = React.cloneElement(
            props.children?.length > 1
                ? props.children[0]
                : props.children,
            {
                onClick: handleShow,
            }
        );
    }

    const isNameValid =
        !addToQuickRequest ||
        quickRequestName.trim().length > 0;

    const finalAmount = Math.max(
        serviceCost - discount,
        0
    );

    const formatPrice = (value) => {
        return new Intl.NumberFormat("fa-IR").format(value);
    };

    return (
        <>
            {newFirstChild}

            <Modal
                show={show}
                centered
                onHide={handleClose}
                dir="rtl"
                className="submit-request-modal"
            >
                <Modal.Header className="submit-request-header">
                    <button
                        type="button"
                        className="submit-request-close"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </Modal.Header>

                <Modal.Body className="submit-request-body">
                    <div className="submit-request-icon">
                        ✓
                    </div>

                    <div className="submit-request-question">
                        آیا مطمئن هستید می‌خواهید این سفارش را ثبت کنید؟
                    </div>

                    <div className="submit-request-description">
                        پس از تأیید، درخواست شما ثبت خواهد شد.
                    </div>

                    {props?.vehicleType && (
                        <div className="submit-request-vehicle-card">
                            <div className="submit-request-vehicle-right">
                                <span className="submit-request-vehicle-dot"></span>

                                <span>
                                    نوع وسیله
                                </span>
                            </div>

                            <strong>
                                {props.vehicleType}
                            </strong>
                        </div>
                    )}

                    <div className="request-price-card">
                        <div className="request-price-header">
                            <div className="request-price-header-icon">
                                ﷼
                            </div>

                            <div className="request-price-header-content">
                                <span className="request-price-header-title">
                                    جزئیات هزینه سرویس
                                </span>

                                <span className="request-price-header-text">
                                    مبلغ نهایی پس از اعمال تخفیف محاسبه شده است
                                </span>
                            </div>
                        </div>

                        <div className="request-price-details">
                            <div className="request-price-row">
                                <div className="request-price-label">
                                    <span className="request-price-dot service-dot"></span>

                                    <span>
                                        هزینه سرویس
                                    </span>
                                </div>

                                <div className="request-price-value service-price">
                                    {formatPrice(serviceCost)}

                                    <span className="request-price-unit">
                                        تومان
                                    </span>
                                </div>
                            </div>

                            <div className="request-price-row">
                                <div className="request-price-label">
                                    <span className="request-price-dot discount-dot"></span>

                                    <span>
                                        تخفیف
                                    </span>
                                </div>

                                <div className="request-price-value discount-price">
                                    - {formatPrice(discount)}

                                    <span className="request-price-unit">
                                        تومان
                                    </span>
                                </div>
                            </div>

                            <div className="request-price-divider"></div>

                            <div className="request-final-price">
                                <div className="request-final-label">
                                    <span className="request-final-icon">
                                        ✓
                                    </span>

                                    <span>
                                        مبلغ نهایی
                                    </span>
                                </div>

                                <div className="request-final-value">
                                    <span className="request-final-number">
                                        {formatPrice(finalAmount)}
                                    </span>

                                    <span className="request-final-unit">
                                        تومان
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <label className="quick-request-option">
                        <Row className="align-items-center g-0">
                            <Col xs="auto">
                                <input
                                    type="checkbox"
                                    checked={addToQuickRequest}
                                    onChange={handleQuickRequestChange}
                                    className="quick-request-checkbox"
                                />
                            </Col>

                            <Col>
                                <div className="quick-request-content">
                                    <span className="quick-request-title">
                                        اضافه شدن به درخواست سریع
                                    </span>

                                    <span className="quick-request-text">
                                        این سفارش برای استفاده مجدد ذخیره شود
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </label>

                    {addToQuickRequest && (
                        <div className="quick-request-name-box">
                            <label className="quick-request-name-label">
                                نام درخواست سریع مربوط به این سفر را وارد کنید
                            </label>

                            <input
                                type="text"
                                value={quickRequestName}
                                onChange={(e) =>
                                    setQuickRequestName(
                                        e.target.value
                                    )
                                }
                                className="quick-request-name-input"
                                placeholder="مثلاً تست"
                                autoFocus
                            />
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className="submit-request-footer p-0">
                    <Row className="w-100 g-0">
                        <Col xs={6}>
                            <button
                                type="button"
                                className="submit-request-btn confirm-btn"
                                onClick={handleConfirm}
                                disabled={!isNameValid}
                            >
                                ثبت
                            </button>
                        </Col>
                        <Col xs={6}>
                            <button
                                type="button"
                                className="submit-request-btn cancel-btn"
                                onClick={handleClose}
                            >
                                انصراف
                            </button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    );
}