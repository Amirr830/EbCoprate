
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { GoAlertFill } from "react-icons/go";

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

    const alertContent = alert ? (
        <div
            style={{
                position: "fixed",
                top: "24px",
                left: "0",
                right: "0",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                zIndex: 2147483647,
                pointerEvents: "none",
                direction: "rtl",
                animation: "alertSlideDown 0.45s ease-out"
            }}
        >
            <div
                style={{
                    position: "relative",
                    minWidth: "340px",
                    maxWidth: "calc(100% - 40px)",
                    padding: "16px 22px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: "18px",
                    lineHeight: "1.6",
                    background:
                        "linear-gradient(135deg, #ff4d5a 0%, #dc3545 50%, #b91c2c 100%)",
                    border:
                        "1px solid rgba(255, 255, 255, 0.35)",
                    boxShadow:
                        "0 12px 35px rgba(220, 53, 69, 0.40), 0 4px 12px rgba(0, 0, 0, 0.18)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    overflow: "hidden"
                }}
            >
         
                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "10%",
                        right: "10%",
                        height: "2px",
                        background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                        opacity: "0.9"
                    }}
                />

                <div
                    style={{
                        width: "38px",
                        height: "38px",
                        minWidth: "38px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "rgba(255, 255, 255, 0.18)",
                        border:
                            "1px solid rgba(255, 255, 255, 0.35)",
                        boxShadow:
                            "inset 0 1px 2px rgba(255,255,255,0.25)"
                    }}
                >
                    <GoAlertFill
                        style={{
                            fontSize: "21px",
                            color: "#ffffff"
                        }}
                    />
                </div>

                <span style={{fontSize:"20px"}}>
                    {alert.message}
                </span>
            </div>
        </div>
    ) : null;

    return (
        <>
            {newFirstChild}

            {typeof document !== "undefined" &&
                createPortal(
                    alertContent,
                    document.body
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
