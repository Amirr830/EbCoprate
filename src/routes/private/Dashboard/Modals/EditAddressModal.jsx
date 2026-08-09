
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

export default function EditAddressModal(props) {
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState(props?.address || "");
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (show) {
            setAddress(props?.address || "");
        }
    }, [show, props?.address]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alert]);

    const addressType =
        props?.addressType === "origin"
            ? "مبدأ"
            : "مقصد";

    const handleShow = () => {
        if (!props?.address || !props.address.trim()) {
            setAlert({
                type: "error",
                message: "لطفا فرم را پر کنید"
            });

            return;
        }

        setAddress(props.address);
        setShow(true);
    };

    const handleSave = () => {
        if (!address || !address.trim()) {
            setAlert({
                type: "error",
                message: "لطفا فرم را پر کنید"
            });

            return;
        }

        if (props?.onAddressChange) {
            props.onAddressChange(address);
        }

        setShow(false);

        setAlert({
            type: "success",
            message: `${addressType} با موفقیت ویرایش شد`
        });
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

            {alert && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 99999,
                        minWidth: "280px",
                        maxWidth: "90%",
                        padding: "14px 24px",
                        borderRadius: "10px",
                        color: "#fff",
                        textAlign: "center",
                        fontSize: "15px",
                        fontWeight: "600",
                        boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
                        background:
                            alert.type === "error"
                                ? "#dc3545"
                                : "#198754"
                    }}
                >
                    {alert.message}
                </div>
            )}

            <Modal
                show={show}
                centered
                onHide={() => {
                    setShow(false);
                }}
                style={{
                    background: "rgba(0, 0, 0, 0.400)"
                }}
            >
                <Modal.Body
                    className="card-header p-0 card p-3"
                    dir="rtl"
                >
                    <div className="mb-3">
                        <h5 className="mb-3">
                            ویرایش {addressType}
                        </h5>

                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                            }}
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-success flex-grow-1"
                            onClick={handleSave}
                        >
                            ذخیره
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger flex-grow-1"
                            onClick={() => {
                                setShow(false);
                            }}
                        >
                            انصراف
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
