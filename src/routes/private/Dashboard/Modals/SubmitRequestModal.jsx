import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import "../Css/SubmitRequestModal.css";

export default function AddDefMsgModal(props) {
    const [show, setShow] = useState(false);
    const [addToQuickRequest, setAddToQuickRequest] = useState(false);

    useEffect(() => {
        if (show) {
        }
    }, [show]);

    const handleShow = () => {
        setAddToQuickRequest(false);
        setShow(true);
    };

    const handleClose = () => {
        setAddToQuickRequest(false);
        setShow(false);
    };


    const handleConfirm = () => {
        const shouldAddToQuickRequest = addToQuickRequest;

        if (props?.onConfirm) {
            props.onConfirm(shouldAddToQuickRequest);
        }

        setShow(false);
        setAddToQuickRequest(false);
    };


    let newFirstChild;

    if (props?.children) {
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            {
                onClick: handleShow,
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

                    <label className="quick-request-option">
                        <Row className="align-items-center g-0">

                            <Col xs="auto">
                                <input
                                    type="checkbox"
                                    checked={addToQuickRequest}
                                    onChange={(e) => {
                                        setAddToQuickRequest(
                                            e.target.checked
                                        );
                                    }}
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

                </Modal.Body>

                <Modal.Footer className="submit-request-footer p-0">

                    <Row className="w-100 g-0">

                        <Col xs={6}>
                            <button
                                type="button"
                                className="submit-request-btn confirm-btn"
                                onClick={handleConfirm}
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