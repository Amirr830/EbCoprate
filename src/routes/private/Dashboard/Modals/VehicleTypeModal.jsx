
import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import {
    FaTruckPickup,
    FaMotorcycle,
    FaCarSide,
    FaCheck,
    FaMoneyBillWave
} from "react-icons/fa";
import "../Css/VehicleTypeModal.css";

export default function VehicleTypeModal(props) {
    const getDefaultVehicle = () => {
        return "";
    };

    const getVehiclePrices = (vehicleClass) => {
        const prices = {
            1: [150000, 200000, 250000, 300000],
            2: [80000, 110000, 140000, 170000],
            3: [60000, 90000, 120000, 150000],
            4: [100000, 140000, 180000, 220000]
        };

        return prices[vehicleClass] || [0, 0, 0, 0];
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("fa-IR");
    };

    const [show, setShow] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState(
        getDefaultVehicle()
    );

    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

    useEffect(() => {
        if (typeof props?.open === "boolean") {
            setShow(props.open);
        }
    }, [props?.open]);

    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);

        if (props?.onClose) {
            props.onClose();
        }
    };

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        setSelectedPriceIndex(0);
    };

    const getVehicleOptions = () => {
        return [
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
    };

    const vehicleOptions = getVehicleOptions();

    const selectedVehicleData = vehicleOptions.find(
        (item) => item.id === selectedVehicle
    );

    const selectedVehiclePrices = selectedVehicleData
        ? getVehiclePrices(selectedVehicleData.vehicleClass)
        : [0, 0, 0, 0];

    const selectedPrice = selectedVehiclePrices[selectedPriceIndex] || 0;

    let newFirstChild = null;

    if (props?.children) {
        const child = Array.isArray(props.children)
            ? props.children[0]
            : props.children;

        if (React.isValidElement(child)) {
            newFirstChild = React.cloneElement(child, {
                onClick: (e) => {
                    if (child.props.onClick) {
                        child.props.onClick(e);
                    }

                    handleShow();
                }
            });
        }
    }

    const handleConfirm = () => {
        if (!selectedVehicleData) {
            return;
        }

        if (props?.onVehicleSelect) {
            props.onVehicleSelect(
                selectedVehicleData.title,
                selectedVehicleData.vehicleClass,
                selectedPrice
            );
        }

        handleClose();
    };

    const handlePriceChange = (e) => {
        setSelectedPriceIndex(Number(e.target.value));
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
                        <div className="vehicle-modal-header-content">
                            <div className="vehicle-modal-title-icon">
                                <FaTruckPickup />
                            </div>

                            <div>
                                <h5 className="vehicle-modal-title">
                                    انتخاب نوع وسیله
                                </h5>

                                <p className="vehicle-modal-subtitle">
                                    وسیله مناسب برای ارسال مرسوله را انتخاب کنید
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="vehicle-modal-close"
                            onClick={handleClose}
                            aria-label="بستن"
                        >
                            ×
                        </button>
                    </div>

                    <div className="vehicle-modal-divider"></div>

                    <Row className="vehicle-options-row">
                        {vehicleOptions.map((vehicle) => {
                            const prices = getVehiclePrices(
                                vehicle.vehicleClass
                            );

                            const isSelected =
                                selectedVehicle === vehicle.id;

                            return (
                                <Col
                                    xs={12}
                                    key={vehicle.id}
                                    className="vehicle-option-col"
                                >
                                    <div
                                        className={`vehicle-card ${isSelected ? "selected" : ""
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className="vehicle-card-main"
                                            onClick={() =>
                                                handleVehicleSelect(
                                                    vehicle.id
                                                )
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
                                                {isSelected && <FaCheck />}
                                            </div>
                                        </button>

                                        {isSelected && (
                                            <div className="vehicle-price-section">
                                                <div className="vehicle-price-top">
                                                    <div className="vehicle-price-label">
                                                        <FaMoneyBillWave />

                                                        <span>
                                                            مبلغ ارسال
                                                        </span>
                                                    </div>

                                                    <div className="vehicle-price-value">
                                                        <span>
                                                            {formatPrice(
                                                                selectedPrice
                                                            )}
                                                        </span>

                                                        <small>
                                                            تومان
                                                        </small>
                                                    </div>
                                                </div>

                                                <div className="vehicle-price-slider-wrapper">
                                                    <div className="vehicle-price-slider-line">
                                                        <div
                                                            className="vehicle-price-slider-progress"
                                                            style={{
                                                                width: `${selectedPriceIndex *
                                                                    33.3333
                                                                    }%`
                                                            }}
                                                        ></div>

                                                        {prices.map(
                                                            (price, index) => (
                                                                <button
                                                                    key={index}
                                                                    type="button"
                                                                    className={`vehicle-price-dot ${selectedPriceIndex ===
                                                                            index
                                                                            ? "active"
                                                                            : ""
                                                                        }`}
                                                                    style={{
                                                                        right: `${index *
                                                                            33.3333
                                                                            }%`
                                                                    }}
                                                                    onClick={() =>
                                                                        setSelectedPriceIndex(
                                                                            index
                                                                        )
                                                                    }
                                                                    aria-label={`انتخاب مبلغ ${formatPrice(
                                                                        price
                                                                    )} تومان`}
                                                                ></button>
                                                            )
                                                        )}

                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="3"
                                                            step="1"
                                                            value={
                                                                selectedPriceIndex
                                                            }
                                                            onChange={
                                                                handlePriceChange
                                                            }
                                                            className="vehicle-price-range"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="vehicle-price-values">
                                                    {prices.map(
                                                        (price, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                className={
                                                                    selectedPriceIndex ===
                                                                        index
                                                                        ? "active"
                                                                        : ""
                                                                }
                                                                onClick={() =>
                                                                    setSelectedPriceIndex(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                {formatPrice(
                                                                    price
                                                                )}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>

                    {selectedVehicleData && (
                        <div className="vehicle-selected-info">
                            <div className="vehicle-selected-info-right">
                                <span className="vehicle-selected-dot"></span>

                                <span>
                                    وسیله انتخاب‌شده
                                </span>
                            </div>

                            <strong>
                                {selectedVehicleData.title}
                            </strong>
                        </div>
                    )}

                    <Row className="vehicle-modal-actions-row">

                        <Col
                            xs={12}
                            sm={6}
                            className="vehicle-action-col"
                        >
                            <button
                                type="button"
                                className="vehicle-cancel-btn"
                                onClick={handleClose}
                            >
                                انصراف
                            </button>
                        </Col>

                        <Col
                            xs={12}
                            sm={6}
                            className="vehicle-action-col"
                        >
                            <button
                                type="button"
                                className="vehicle-confirm-btn"
                                disabled={!selectedVehicle}
                                onClick={handleConfirm}
                            >
                                <FaCheck />

                                <span>
                                    تأیید
                                </span>
                            </button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}
