import React, { useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
    FaTruckPickup,
    FaMotorcycle,
    FaCarSide,
    FaCheck
} from "react-icons/fa";
import "../Css/VehicleTypeModal.css";

export default function AddDefMsgModal(props) {
    const [show, setShow] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState("motor");

    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const vehicleOptions = [
        {
            id: "pickup",
            vehicleClass: 1,
            title: "وانت",
            description: "مناسب بارهای حجیم و سنگین",
            icon: <FaTruckPickup />
        },
        {
            id: "motor-box",
            vehicleClass: 2,
            title: "موتور همراه جعبه",
            description: "مناسب بسته‌ها و مرسولات",
            icon: <FaMotorcycle />
        },
        {
            id: "motor",
            vehicleClass: 3,
            title: "موتور بدون جعبه",
            description: "مناسب ارسال‌های سریع",
            icon: <FaMotorcycle />
        },
        {
            id: "car",
            vehicleClass: 4,
            title: "سواری",
            description: "مناسب بسته‌های معمولی",
            icon: <FaCarSide />
        }
    ];

    let newFirstChild = null;

    if (props?.children) {
        const child = Array.isArray(props.children)
            ? props.children[0]
            : props.children;

        if (React.isValidElement(child)) {
            newFirstChild = React.cloneElement(child, {
                onClick: handleShow
            });
        }
    }

    const handleConfirm = () => {
        const selectedVehicleData = vehicleOptions.find(
            (item) => item.id === selectedVehicle
        );

        if (!selectedVehicleData) {
            return;
        }

        if (props?.onVehicleSelect) {
            props.onVehicleSelect(
                selectedVehicleData.title,
                selectedVehicleData.vehicleClass
            );
        }

        handleClose();
    };

    return (
        <>
            {newFirstChild}

            <Modal
                show={show}
                centered
                onHide={handleClose}
                className="vehicle-select-modal"
                backdropClassName="vehicle-modal-backdrop"
            >
                <Modal.Body
                    className="vehicle-modal-body"
                    dir="rtl"
                >
                    <div className="vehicle-modal-header">

                        <button
                            type="button"
                            className="vehicle-modal-close"
                            onClick={handleClose}
                        >
                            ×
                        </button>

                        <div>

                            <h5 className="vehicle-modal-title">
                                انتخاب نوع وسیله
                            </h5>

                            <p className="vehicle-modal-subtitle">
                                وسیله مناسب برای ارسال مرسوله را انتخاب کنید
                            </p>

                        </div>

                    </div>

                    <div className="vehicle-modal-divider"></div>

                    <Row className="g-3">

                        {vehicleOptions.map((vehicle) => (
                            <Col
                                xs={12}
                                sm={6}
                                key={vehicle.id}
                            >
                                <button
                                    type="button"
                                    className={`vehicle-card ${
                                        selectedVehicle === vehicle.id
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleVehicleSelect(vehicle.id)
                                    }
                                >

                                    <div className="vehicle-card-icon">
                                        {vehicle.icon}
                                    </div>

                                    <div className="vehicle-card-content">

                                        <div className="vehicle-card-title">
                                            {vehicle.title}
                                        </div>

                                        <div className="vehicle-card-description">
                                            {vehicle.description}
                                        </div>

                                    </div>

                                    <div className="vehicle-card-check">

                                        {selectedVehicle === vehicle.id && (
                                            <FaCheck />
                                        )}

                                    </div>

                                </button>
                            </Col>
                        ))}

                    </Row>

                    <div className="vehicle-modal-actions">

                        <button
                            type="button"
                            className="vehicle-cancel-btn"
                            onClick={handleClose}
                            style={{
                                fontSize: "20px"
                            }}
                        >
                            انصراف
                        </button>

                        <button
                            type="button"
                            className="vehicle-confirm-btn"
                            disabled={!selectedVehicle}
                            onClick={handleConfirm}
                            style={{
                                fontSize: "20px"
                            }}
                        >
                            ثبت
                        </button>

                    </div>

                </Modal.Body>
            </Modal>
        </>
    );
}