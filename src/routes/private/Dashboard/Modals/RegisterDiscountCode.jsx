import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import "../Css/RegisterDiscountCode.css";

export default function RegisterDiscountCode(props) {
    const [show, setShow] = useState(false);
    const [params, setParams] = useState(props?.params);
    const [discountCode, setDiscountCode] = useState("");
    const [discountStatus, setDiscountStatus] = useState(null);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [discountAlert, setDiscountAlert] = useState("");

    useEffect(() => {
        if (show) {
            getDiscountCodes();
        }
    }, [show]);

    const getDiscountCodes = () => {
        const codes = [
            {
                id: 1,
                code: "کاربران جدید",
                title: "تخفیف ویژه کاربران جدید",
                description: "۱۰ درصد تخفیف برای اولین درخواست",
                percent: 10,
                status: false
            },
            {
                id: 2,
                code: "سرویس ویژه",
                title: "تخفیف ویژه سرویس",
                description: "۲۰ درصد تخفیف روی هزینه سرویس",
                percent: 20,
                status: false
            },
            {
                id: 3,
                code: "کاربران ویژه",
                title: "تخفیف کاربران ویژه",
                description: "۳۰ درصد تخفیف برای کاربران ویژه",
                percent: 30,
                status: true
            },
            {
                id: 4,
                code: "اولین سفارش",
                title: "تخفیف اولین سفارش",
                description: "۵۰ هزار تومان تخفیف",
                amount: 50000,
                status: true
            },
            {
                id: 5,
                code: "ویژه",
                title: "تخفیف ویژه سرویس",
                description: "۲۵ درصد تخفیف روی هزینه سرویس",
                percent: 25,
                status: true
            }
        ];

        setDiscountCodes(codes);
    };

    const checkDiscountCode = (code) => {
        const value = code.trim();

        if (!value) {
            return {
                valid: false,
                message: "لطفاً کد تخفیف را وارد کنید.",
                data: null
            };
        }

        const foundCode = discountCodes.find(
            (item) =>
                item.code.toLowerCase() ===
                value.toLowerCase()
        );

        if (foundCode && foundCode.status === true) {
            return {
                valid: true,
                message: "کد تخفیف معتبر است.",
                data: foundCode
            };
        }

        return {
            valid: false,
            message: "کد تخفیف معتبر نیست!",
            data: foundCode || null
        };
    };

    const validateDiscountCode = () => {
        const result = checkDiscountCode(discountCode);

        setDiscountStatus(result);

        if (!result.valid) {
            setDiscountAlert(
                result.message
            );

            return;
        }

        setDiscountAlert("");

        setDiscountCode(result.data.code);

        if (props?.onDiscountSelect) {
            props.onDiscountSelect(result.data);
        }

        setTimeout(() => {
            setShow(false);
            setDiscountStatus(null);
            setDiscountAlert("");
        }, 300);
    };

    const handleDiscountCodeChange = (e) => {
        const value = e.target.value;

        setDiscountCode(value);

        setDiscountStatus(null);
        setDiscountAlert("");
    };

    const handleSelectDiscount = (code) => {
        setDiscountCode(code);

        setDiscountStatus(null);
        setDiscountAlert("");
    };

    const handleShow = () => {
        setShow(true);
        setDiscountCode("");
        setDiscountStatus(null);
        setDiscountAlert("");
    };

    const handleClose = () => {
        setShow(false);
        setDiscountCode("");
        setDiscountStatus(null);
        setDiscountAlert("");
    };

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
                className="register-discount-modal"
                dir="rtl"
            >
                <Modal.Body className="register-discount-modal-body">
                    {discountAlert && (
                        <div className="discount-global-alert">
                            <div className="discount-global-alert-icon">
                                !
                            </div>

                            <div className="discount-global-alert-text">
                                {discountAlert}
                            </div>

                            <button
                                type="button"
                                className="discount-global-alert-close"
                                onClick={() =>
                                    setDiscountAlert("")
                                }
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="discount-modal-header">
                        <button
                            type="button"
                            className="discount-close-button"
                            onClick={handleClose}
                        >
                            ×
                        </button>

                        <div className="discount-header-content">
                            <h5>
                                کد تخفیف
                            </h5>

                            <span>
                                کد تخفیف خود را وارد کنید و از تخفیف استفاده کنید
                            </span>
                        </div>
                        <div className="discount-header-icon">
                            %
                        </div>
                    </div>

                    <div className="discount-input-section">
                        <label className="discount-input-label">
                            کد تخفیف
                        </label>

                        <Row className="g-2">
                            <Col xs={7}>
                                <div
                                    className={`discount-input-wrapper ${
                                        discountStatus?.valid
                                            ? "discount-input-valid"
                                            : discountStatus?.valid === false
                                                ? "discount-input-invalid"
                                                : ""
                                    }`}
                                >
                                    <span className="discount-input-icon">
                                        %
                                    </span>

                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={
                                            handleDiscountCodeChange
                                        }
                                        placeholder="مثلاً VIP30"
                                        className="discount-code-input"
                                    />
                                </div>
                            </Col>

                            <Col xs={5}>
                                <button
                                    type="button"
                                    className="discount-submit-button"
                                    onClick={
                                        validateDiscountCode
                                    }
                                >
                                    ثبت کد
                                </button>
                            </Col>

                        </Row>

                        {discountStatus && (
                            <div
                                className={`discount-validation-message ${
                                    discountStatus.valid
                                        ? "discount-valid"
                                        : "discount-invalid"
                                }`}
                            >
                                <span className="discount-status-icon">
                                    {discountStatus.valid
                                        ? "✓"
                                        : "!"}
                                </span>

                                <span>
                                    {discountStatus.message}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="discount-list-container">
                        <div className="discount-list-header">
                            <div>
                                <span className="discount-list-title">
                                    کدهای تخفیف
                                </span>

                                <span className="discount-list-subtitle">
                                    برای انتخاب، روی هر کارت کلیک کنید
                                </span>
                            </div>
                            <div className="discount-count">
                                {discountCodes.length}
                            </div>
                        </div>

                        <div className="discount-list">
                            {discountCodes.map((item) => (
                                <div
                                    className={`discount-code-card ${
                                        discountCode.toLowerCase() ===
                                        item.code.toLowerCase()
                                            ? "discount-code-card-selected"
                                            : ""
                                    }`}
                                    key={item.id}
                                    onClick={() =>
                                        handleSelectDiscount(
                                            item.code
                                        )
                                    }
                                >

                                    <div className="discount-card-main">
                                        <div className="discount-card-icon">
                                            %
                                        </div>

                                        <div className="discount-card-info">
                                            <div className="discount-code-name">
                                                {item.code}
                                            </div>
                                            <div className="discount-code-description">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="discount-card-action">
                                        <div className="discount-card-value">
                                            {item.percent
                                                ? `${item.percent}%`
                                                : `${item.amount} تومان`}
                                        </div>

                                        <button
                                            type="button"
                                            className="discount-select-button"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                handleSelectDiscount(
                                                    item.code
                                                );
                                            }}
                                        >
                                            انتخاب
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </>
    );
}