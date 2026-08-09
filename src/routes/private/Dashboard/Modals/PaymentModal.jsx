import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
    FaMoneyBillWave,
    FaWallet,
    FaCreditCard,
    FaFileInvoiceDollar,
    FaCheckCircle
} from "react-icons/fa";
import "../Css/PaymentModal.css";

export default function AddDefMsgModal(props) {

    const [show, setShow] = useState(false);
    const [params, setParams] = useState(props?.params);
    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        if (show) {
            // بعد از نمایش مودال
        }
    }, [show]);

    const handleShow = () => {
        setShow(true);
    };

    const handlePaymentSelect = (method) => {
        setPaymentMethod(method);
    };

    const paymentMethods = [
        {
            id: "cash",
            title: "پرداخت نقدی",
            description: "پرداخت مبلغ به‌صورت نقدی",
            icon: <FaMoneyBillWave />,
            color: "cash"
        },
        {
            id: "wallet",
            title: "کیف پول",
            description: "پرداخت از موجودی کیف پول",
            icon: <FaWallet />,
            color: "wallet"
        },
        {
            id: "card",
            title: "کارت بانکی",
            description: "پرداخت با کارت بانکی",
            icon: <FaCreditCard />,
            color: "card"
        },
        {
            id: "credit",
            title: "پرداخت اعتباری",
            description: "پرداخت از اعتبار حساب",
            icon: <FaFileInvoiceDollar />,
            color: "credit"
        }
    ];

    var newFirstChild;

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow }
        );

    return (
        <>
            {newFirstChild}

            <Modal
                show={show}
                centered
                onHide={() => setShow(false)}
                className="payment-modal"
                dir="rtl"
            >
                <Modal.Body className="payment-modal-body">

                    <div className="payment-header">

                        <button
                            type="button"
                            className="payment-close-btn"
                            onClick={() => setShow(false)}
                        >
                            ×
                        </button>

                        <div className="payment-header-content">
                            <h5>انتخاب روش پرداخت</h5>
                            <span>
                                روش پرداخت موردنظر خود را انتخاب کنید
                            </span>
                        </div>

                    </div>

                    <div className="payment-divider"></div>

                    <Row className="g-3">

                        {paymentMethods.map((method) => (

                            <Col
                                xs={12}
                                sm={6}
                                key={method.id}
                            >

                                <div
                                    className={`payment-method-card ${paymentMethod === method.id
                                            ? "payment-method-selected"
                                            : ""
                                        }`}
                                    onClick={() => handlePaymentSelect(method.id)}
                                >

                                    <div
                                        className={`payment-method-icon ${method.color}`}
                                    >
                                        {method.icon}
                                    </div>

                                    <div className="payment-method-content">
                                        <div className="payment-method-title">
                                            {method.title}
                                        </div>

                                        <div className="payment-method-description">
                                            {method.description}
                                        </div>

                                    </div>

                                    <div className="payment-method-check">

                                        {paymentMethod === method.id && (
                                            <FaCheckCircle />
                                        )}

                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <div className="payment-selected-box">
                        <span>
                            روش پرداخت انتخاب‌شده
                        </span>

                        <strong>
                            {
                                paymentMethods.find(
                                    item => item.id === paymentMethod
                                )?.title || "هنوز انتخاب نشده"
                            }
                        </strong>

                    </div>

                    <div className="payment-actions">

                        <button
                            type="button"
                            className="payment-confirm-btn"
                            disabled={!paymentMethod}
                            onClick={() => {
                                console.log("Payment Method:", paymentMethod);
                                setShow(false);
                            }}
                            style={{fontSize:"17px"}}
                        >
                            ثبت
                        </button>
                        <button
                            type="button"
                            className="payment-cancel-btn"
                            onClick={() => setShow(false)}
                            style={{fontSize:"17px"}}
                        >
                            انصراف
                        </button>


                    </div>

                </Modal.Body>
            </Modal>
        </>
    );
}