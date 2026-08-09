import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Css/NewDestinationModal.css";
import { FaTimes } from "react-icons/fa";

const markerIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const MASHHAD_CENTER = [36.2972, 59.6067];

const destinationMarkerIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

    iconRetinaUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

function MapController({
    originPosition,
    destinationPosition,
}) {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();

            const position =
                destinationPosition ||
                originPosition;

            if (position) {
                map.flyTo(position, 17, {
                    animate: true,
                    duration: 1.2,
                });
            } else {
                map.setView(
                    MASHHAD_CENTER,
                    13
                );
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [
        map,
        originPosition,
        destinationPosition,
    ]);

    return null;
}


function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click: (event) => {
            onMapClick(event);
        },
    });
    return null;
}


export default function AddDefMsgModal(props) {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(1);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);


    const [originPosition, setOriginPosition] = useState(null);
    const [destinationPosition, setDestinationPosition] = useState(null);
    const [originAddress, setOriginAddress] = useState("");
    const [destinationAddress, setDestinationAddress] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);



    const [formData, setFormData] = useState({
        origin: {
            province: "خراسان رضوی",
            city: "مشهد",
            street: "",
            alley: "",
            plaque: "",
            unit: "",
            postalCode: "",
            description: "",
        },

        destination: {
            province: "خراسان رضوی",
            city: "مشهد",
            street: "",
            alley: "",
            plaque: "",
            unit: "",
            postalCode: "",
            description: "",
        },
    });


    const handleMarkerDragEnd = async (event, type) => {
        const { lat, lng } = event.target.getLatLng();

        const newPosition = [lat, lng];

        if (type === "origin") {
            setOriginPosition(newPosition);
        }

        if (type === "destination") {
            setDestinationPosition(newPosition);
        }

        try {
            const url =
                "https://nominatim.openstreetmap.org/reverse" +
                "?format=jsonv2" +
                "&addressdetails=1" +
                "&accept-language=fa" +
                "&lat=" +
                lat +
                "&lon=" +
                lng;

            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Reverse geocoding failed");
            }

            const data = await response.json();

            if (!data) {
                return;
            }

            const addressText =
                data.display_name || "";

            const address =
                data.address || {};

            const street =
                address.road ||
                address.pedestrian ||
                address.residential ||
                address.neighbourhood ||
                "";

            const city =
                address.city ||
                address.town ||
                address.municipality ||
                "مشهد";

            const province =
                address.state ||
                "خراسان رضوی";

            if (type === "origin") {
                setOriginAddress(addressText);

                setFormData((prev) => ({
                    ...prev,

                    origin: {
                        ...prev.origin,

                        province,
                        city,
                        street,
                    },
                }));
            }

            if (type === "destination") {
                setDestinationAddress(addressText);

                setFormData((prev) => ({
                    ...prev,

                    destination: {
                        ...prev.destination,

                        province,
                        city,
                        street,
                    },
                }));
            }

        } catch (error) {
        }
    };

    const handleShow = () => {
        setShow(true);
        setStep(1);

        setSearch("");
        setSearchResults([]);
        setShowResults(false);

        setOriginPosition(null);
        setDestinationPosition(null);

        setOriginAddress("");
        setDestinationAddress("");

        setShowAlert(false);
        setAlertMessage("");

        setFormData({
            origin: {
                province: "خراسان رضوی",
                city: "مشهد",
                street: "",
                alley: "",
                plaque: "",
                unit: "",
                postalCode: "",
                description: "",
            },

            destination: {
                province: "خراسان رضوی",
                city: "مشهد",
                street: "",
                alley: "",
                plaque: "",
                unit: "",
                postalCode: "",
                description: "",
            },
        });
    };


    const handleClose = () => {
        setShow(false);
        setStep(1);
        setSearch("");
        setSearchResults([]);
        setShowResults(false);
        setOriginPosition(null);
        setDestinationPosition(null);
        setOriginAddress("");
        setDestinationAddress("");
        setShowAlert(false);
        setAlertMessage("");
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [name]: value,
            },
        }));
    };

    useEffect(() => {
        if (!show || step !== 1) {
            return;
        }
        const value = search.trim();
        if (value.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setSearchLoading(true);
                const query =
                    `${value}, مشهد, خراسان رضوی, ایران`;
                const url =
                    "https://nominatim.openstreetmap.org/search" +
                    "?format=jsonv2" +
                    "&addressdetails=1" +
                    "&limit=8" +
                    "&countrycodes=ir" +
                    "&accept-language=fa" +
                    "&q=" +
                    encodeURIComponent(query);

                const response = await fetch(url, {
                    headers: {
                        Accept: "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("جستجوی آدرس ناموفق");
                }
                const data = await response.json();
                setSearchResults(data || []);
                setShowResults(true);

            } catch (error) {
                setSearchResults([]);
                setShowResults(true);
            } finally {
                setSearchLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(timeout);
        };

    }, [search, show, step]);


    const handleSelectResult = (result) => {
        const lat = Number(result.lat);
        const lon = Number(result.lon);

        const position = [lat, lon];

        let targetType = null;

        if (!originPosition) {
            targetType = "origin";
            setOriginPosition(position);
        } else if (!destinationPosition) {
            targetType = "destination";
            setDestinationPosition(position);
        } else {
            return;
        }

        const address = result.address || {};

        const street =
            address.road ||
            address.pedestrian ||
            address.residential ||
            address.neighbourhood ||
            "";

        const city =
            address.city ||
            address.town ||
            address.municipality ||
            "مشهد";

        const addressText =
            result.display_name || "";

        setSearch(
            result.name ||
            street ||
            ""
        );

        if (targetType === "origin") {
            setOriginAddress(addressText);

            setFormData((prev) => ({
                ...prev,

                origin: {
                    ...prev.origin,

                    province:
                        address.state ||
                        "خراسان رضوی",

                    city: city,
                    street: street,
                },
            }));
        }

        if (targetType === "destination") {
            setDestinationAddress(addressText);

            setFormData((prev) => ({
                ...prev,

                destination: {
                    ...prev.destination,

                    province:
                        address.state ||
                        "خراسان رضوی",

                    city: city,
                    street: street,
                },
            }));
        }

        setShowResults(false);
    };


    const handleMapClick = async (event) => {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;

        const position = [lat, lon];

        let targetType = null;

        if (!originPosition) {
            targetType = "origin";
            setOriginPosition(position);
        } else if (!destinationPosition) {
            targetType = "destination";
            setDestinationPosition(position);
        } else {
            return;
        }

        try {
            const url =
                "https://nominatim.openstreetmap.org/reverse" +
                "?format=jsonv2" +
                "&addressdetails=1" +
                "&accept-language=fa" +
                "&lat=" +
                lat +
                "&lon=" +
                lon;

            const response = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Reverse geocoding failed");
            }

            const data = await response.json();

            if (!data) {
                return;
            }

            const addressText =
                data.display_name || "";

            const address = data.address || {};

            const street =
                address.road ||
                address.pedestrian ||
                address.residential ||
                address.neighbourhood ||
                "";

            const city =
                address.city ||
                address.town ||
                address.municipality ||
                "مشهد";

            if (targetType === "origin") {
                setOriginAddress(addressText);

                setFormData((prev) => ({
                    ...prev,

                    origin: {
                        ...prev.origin,

                        province:
                            address.state ||
                            "خراسان رضوی",

                        city: city,
                        street: street,
                    },
                }));
            }

            if (targetType === "destination") {
                setDestinationAddress(addressText);

                setFormData((prev) => ({
                    ...prev,

                    destination: {
                        ...prev.destination,

                        province:
                            address.state ||
                            "خراسان رضوی",

                        city: city,
                        street: street,
                    },
                }));
            }

        } catch (error) {
            console.error(
                "Reverse Address Error:",
                error
            );
        }
    };


    const handleNextStep = () => {
        if (!originPosition || !destinationPosition) {
            setAlertMessage(
                "لطفاً مبدأ و مقصد را انتخاب کنید"
            );

            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 3500);

            return;
        }

        setStep(2);
    };

    const handlePreviousStep = () => {

        setStep(1);
    };

const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        originLatitude:
            originPosition?.[0] || null,
        originLongitude:
            originPosition?.[1] || null,
        originAddress:
            originAddress || "",
        destinationLatitude:
            destinationPosition?.[0] || null,
        destinationLongitude:
            destinationPosition?.[1] || null,
        destinationAddress:
            destinationAddress || "",
    };
    console.log("Final Data:", finalData);
    if (props?.onAddressSubmit) {
        props.onAddressSubmit(finalData);
    }
    handleClose();
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

    return (
        <>
            {newFirstChild}
            <Modal
                show={show}
                onHide={handleClose}
                centered
                size="lg"
                backdrop="static"
                keyboard={false}
                className="add-address-modal"
            >

                <Modal.Body
                    className="add-address-modal-body"
                    dir="rtl"
                >
                    {showAlert && (
                        <div className="address-top-alert">
                            <div className="address-top-alert-icon">
                                !
                            </div>

                            <div className="address-top-alert-content">
                                <strong>
                                    انتخاب موقعیت ناقص است
                                </strong>

                                <span>
                                    {alertMessage}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAlert(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                    <div className="address-modal-header">

                        <button
                            type="button"
                            className="address-close-btn btn btn-danger"
                            onClick={handleClose}
                        >
                            <FaTimes />
                        </button>


                        <div className="address-header-title">
                            <div>
                                <h5>
                                    {step === 1
                                        ? "انتخاب موقعیت"
                                        : "تکمیل آدرس"}
                                </h5>

                                <span>
                                    {step === 1
                                        ? "موقعیت آدرس را روی نقشه انتخاب کنید"
                                        : "اطلاعات کامل آدرس را وارد کنید"}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* <div className="address-stepper">
                        <div
                            className={`step-item ${step >= 1
                                ? "active"
                                : ""
                                }`}
                        >

                            <div className="step-number">
                                ۱
                            </div>

                            <span>
                                موقعیت
                            </span>
                        </div>


                        <div
                            className={`step-line ${step >= 2
                                ? "active"
                                : ""
                                }`}
                        />

                        <div
                            className={`step-item ${step >= 2
                                ? "active"
                                : ""
                                }`}
                        >

                            <div className="step-number">
                                ۲
                            </div>

                            <span>
                                اطلاعات آدرس
                            </span>

                        </div>

                    </div> */}

                    {step === 1 && (

                        <div className="address-step-one">
                            <div className="address-search-wrapper">
                                <div className="address-search-box">
                                    <div className="search-icon">
                                        ⌕
                                    </div>

                                    <input
                                        type="text"
                                        className="address-search-input"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(
                                                e.target.value
                                            );
                                        }}
                                        onFocus={() => {

                                            if (
                                                searchResults.length > 0
                                            ) {
                                                setShowResults(true);
                                            }

                                        }}
                                        placeholder="سیدرضی ۲۰، مشهد"
                                    />

                                    {searchLoading && (
                                        <div className="search-spinner">
                                            <span />
                                        </div>
                                    )}
                                </div>

                                {showResults && (
                                    <div className="address-search-results">
                                        {searchLoading ? (
                                            <div className="search-loading">
                                                <div className="small-loader" />
                                                <span>
                                                    در حال جستجوی آدرس...
                                                </span>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map(
                                                (result, index) => {
                                                    const address =
                                                        result.address ||
                                                        {};
                                                    const mainName =
                                                        result.name ||
                                                        address.road ||
                                                        address.pedestrian ||
                                                        address.residential ||
                                                        "موقعیت پیدا شده";
                                                    return (
                                                        <button
                                                            key={`${result.place_id}-${index}`}
                                                            type="button"
                                                            className="search-result-item"
                                                            onClick={() =>
                                                                handleSelectResult(
                                                                    result
                                                                )
                                                            }
                                                        >

                                                            <div className="result-location-icon">
                                                                ⌖
                                                            </div>

                                                            <div className="result-text">
                                                                <strong>
                                                                    {mainName}
                                                                </strong>
                                                                <span>
                                                                    {
                                                                        result.display_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            )

                                        ) : (

                                            <div className="no-search-result">
                                                <span>
                                                    ⌕
                                                </span>
                                                <div>
                                                    <strong>
                                                        نتیجه‌ای پیدا نشد
                                                    </strong>

                                                    <small>
                                                        نام خیابان را دقیق‌تر وارد کنید.
                                                    </small>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="address-map-wrapper">
                                <MapContainer
                                    center={MASHHAD_CENTER}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    className="address-map"
                                >
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapClickHandler
                                        onMapClick={
                                            handleMapClick
                                        }
                                    />
                                    <MapController
                                        originPosition={originPosition}
                                        destinationPosition={destinationPosition}
                                    />

                                    {originPosition && (
                                        <Marker
                                            position={originPosition}
                                            icon={markerIcon}
                                            draggable={true}
                                            eventHandlers={{
                                                dragend: (event) =>
                                                    handleMarkerDragEnd(
                                                        event,
                                                        "origin"
                                                    ),
                                            }}
                                        >
                                            <Tooltip
                                                direction="top"
                                                offset={[0, -35]}
                                                permanent={false}
                                            >
                                                مبدأ
                                            </Tooltip>
                                        </Marker>
                                    )}

                                    {destinationPosition && (
                                        <Marker
                                            position={destinationPosition}
                                            icon={destinationMarkerIcon}
                                            draggable={true}
                                            eventHandlers={{
                                                dragend: (event) =>
                                                    handleMarkerDragEnd(
                                                        event,
                                                        "destination"
                                                    ),
                                            }}
                                        >
                                            <Tooltip
                                                direction="top"
                                                offset={[0, -35]}
                                                permanent={false}
                                            >
                                                مقصد
                                            </Tooltip>
                                        </Marker>
                                    )}
                                </MapContainer>

                                {!originPosition && !destinationPosition && (
                                    <div className="map-center-hint">
                                        <span>
                                            ابتدا مبدأ را روی نقشه انتخاب کنید
                                        </span>
                                    </div>
                                )}

                                {originPosition && !destinationPosition && (
                                    <div className="map-center-hint">
                                        <span>
                                            حالا مقصد را روی نقشه انتخاب کنید
                                        </span>
                                    </div>
                                )}
                            </div>

                            {(originPosition || destinationPosition) && (
                                <div className="selected-address-box">

                                    <div className="selected-address-icon">
                                        ✓
                                    </div>

                                    <div className="selected-address-content">

                                        <span>
                                            {destinationPosition
                                                ? "مبدأ و مقصد انتخاب شدند"
                                                : "مبدأ انتخاب شد؛ حالا مقصد را انتخاب کنید"}
                                        </span>

                                        <strong>
                                            {destinationPosition
                                                ? "هر دو موقعیت با موفقیت انتخاب شدند"
                                                : originAddress ||
                                                "موقعیت مبدأ روی نقشه انتخاب شد"}
                                        </strong>

                                    </div>

                                </div>
                            )}


                            <button
                                type="button"
                                className={`address-next-btn ${originPosition && destinationPosition
                                    ? "enabled"
                                    : "disabled"
                                    }`}
                                disabled={false}
                                onClick={
                                    handleNextStep
                                }
                            >
                                <span style={{ fontSize: "20px" }}>
                                    مرحله بعدی
                                </span>
                            </button>
                        </div>
                    )}

                    {step === 2 && (

                        <form
                            className="address-step-two"
                            onSubmit={handleSubmit}
                        >


                            <div className="location-summary">
                                <div className="summary-icon">
                                    ✓
                                </div>

                                <div className="summary-content">
                                    <span>
                                        موقعیت انتخاب شده
                                    </span>

                                    <div className="location-summary-routes">

                                        <div className="route-summary-item origin-summary">

                                            <span className="route-summary-dot">
                                                ●
                                            </span>

                                            <div>
                                                <small>
                                                    مبدأ
                                                </small>

                                                <strong>
                                                    {originAddress ||
                                                        "موقعیت مبدأ انتخاب شد"}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="route-summary-arrow">
                                            ←
                                        </div>


                                        <div className="route-summary-item destination-summary">

                                            <span className="route-summary-dot">
                                                ●
                                            </span>

                                            <div>
                                                <small>
                                                    مقصد
                                                </small>

                                                <strong>
                                                    {destinationAddress ||
                                                        "موقعیت مقصد انتخاب شد"}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>
                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handlePreviousStep
                                    }
                                >
                                    تغییر موقعیت
                                </button>
                            </div>


                            <div className="address-form">

                                <div className="row g-4">

                                    {/* ================= مبدأ ================= */}

                                    <div className="col-12 col-lg-6">

                                        <div className="address-location-card origin-card">

                                            <div className="address-location-card-header">

                                                <div className="address-location-card-icon">
                                                    <span>●</span>
                                                </div>

                                                <div>
                                                    <strong>
                                                        مشخصات مبدأ
                                                    </strong>

                                                    <small>
                                                        اطلاعات محل دریافت
                                                    </small>
                                                </div>

                                            </div>

                                            <div className="address-form-grid">

                                                {/* استان */}
                                                <div className="address-field">
                                                    <label>
                                                        استان
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ⌖
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="province"
                                                            value={formData.origin.province}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            className="form-control address-input"
                                                            placeholder="نام استان"
                                                        />
                                                    </div>
                                                </div>

                                                {/* شهر */}
                                                <div className="address-field">
                                                    <label>
                                                        شهر
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ●
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={formData.origin.city}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            className="form-control address-input"
                                                            placeholder="نام شهر"
                                                        />
                                                    </div>
                                                </div>

                                                {/* خیابان */}
                                                <div className="address-field address-field-large">
                                                    <label>
                                                        خیابان
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ⌁
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="street"
                                                            value={formData.origin.street}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            placeholder="سیدرضی"
                                                            className="form-control address-input"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* کوچه */}
                                                <div className="address-field">
                                                    <label>
                                                        کوچه
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ⌂
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="alley"
                                                            value={formData.origin.alley}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            placeholder="کوچه"
                                                            className="form-control address-input"
                                                        />
                                                    </div>
                                                </div>

                                                {/* پلاک */}
                                                <div className="address-field-small">
                                                    <label>
                                                        پلاک
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            #
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="plaque"
                                                            value={formData.origin.plaque}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            placeholder="پلاک"
                                                            className="form-control address-input"
                                                        />
                                                    </div>
                                                </div>

                                                {/* واحد */}
                                                <div className="address-field-small">
                                                    <label>
                                                        واحد
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ▦
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="unit"
                                                            value={formData.origin.unit}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            placeholder="واحد"
                                                            className="form-control address-input"
                                                        />
                                                    </div>
                                                </div>

                                                {/* توضیحات */}
                                                <div className="address-field address-description-field">
                                                    <label>
                                                        توضیحات مبدأ
                                                    </label>

                                                    <div className="address-input-wrapper address-textarea-wrapper">

                                                        <span className="address-field-icon textarea-icon">
                                                            ✎
                                                        </span>

                                                        <textarea
                                                            name="description"
                                                            value={
                                                                formData.origin.description
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "origin"
                                                                )
                                                            }
                                                            placeholder="توضیحات محل دریافت..."
                                                            rows={4}
                                                            className="form-control address-textarea"
                                                        />

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                    {/* ================= مقصد ================= */}

                                    <div className="col-12 col-lg-6">

                                        <div className="address-location-card destination-card">

                                            <div className="address-location-card-header">

                                                <div className="address-location-card-icon">
                                                    <span>●</span>
                                                </div>

                                                <div>
                                                    <strong>
                                                        مشخصات مقصد
                                                    </strong>

                                                    <small>
                                                        اطلاعات محل تحویل
                                                    </small>
                                                </div>

                                            </div>

                                            <div className="address-form-grid">

                                                {/* استان */}
                                                <div className="address-field">
                                                    <label>
                                                        استان
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ⌖
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="province"
                                                            value={
                                                                formData.destination.province
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            className="form-control address-input"
                                                            placeholder="نام استان"
                                                        />
                                                    </div>
                                                </div>

                                                {/* شهر */}
                                                <div className="address-field">
                                                    <label>
                                                        شهر
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ●
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={
                                                                formData.destination.city
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            className="form-control address-input"
                                                            placeholder="نام شهر"
                                                        />
                                                    </div>
                                                </div>

                                                {/* خیابان */}
                                                <div className="address-field address-field-large">
                                                    <label>
                                                        خیابان
                                                        <span className="required">
                                                            *
                                                        </span>
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ⌁
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="street"
                                                            value={
                                                                formData.destination.street
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            placeholder="سیدرضی"
                                                            className="form-control address-input"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* کوچه */}
                                                <div className="address-field">
                                                    <label>
                                                        کوچه
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ⌂
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="alley"
                                                            value={
                                                                formData.destination.alley
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            placeholder="کوچه"
                                                            className="form-control address-input"
                                                        />
                                                    </div>
                                                </div>

                                                {/* پلاک */}
                                                <div className="address-field-small">
                                                    <label>
                                                        پلاک
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            #
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="plaque"
                                                            value={
                                                                formData.destination.plaque
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            placeholder="پلاک"
                                                            className="form-control address-input"
                                                        />
                                                    </div>
                                                </div>

                                                {/* واحد */}
                                                <div className="address-field-small">
                                                    <label>
                                                        واحد
                                                    </label>

                                                    <div className="address-input-wrapper">
                                                        <span className="address-field-icon">
                                                            ▦
                                                        </span>

                                                        <input
                                                            type="text"
                                                            name="unit"
                                                            value={
                                                                formData.destination.unit
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            placeholder="واحد"
                                                            className="form-control address-input"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="address-field address-description-field">
                                                    <label>
                                                        توضیحات مقصد
                                                    </label>

                                                    <div className="address-input-wrapper address-textarea-wrapper">

                                                        <span className="address-field-icon textarea-icon">
                                                            ✎
                                                        </span>

                                                        <textarea
                                                            name="description"
                                                            value={
                                                                formData.destination.description
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    e,
                                                                    "destination"
                                                                )
                                                            }
                                                            placeholder="توضیحات محل تحویل..."
                                                            rows={4}
                                                            className="form-control address-textarea"
                                                        />

                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>


                            <div className="address-form-buttons">
                                <div className="row w-100 g-2">
                                    <div className="col-6">
                                        <button
                                            type="button"
                                            className=" w-100 btn btn-danger"
                                            onClick={handlePreviousStep}
                                        >
                                            بازگشت
                                        </button>
                                    </div>


                                    <div className="col-6">
                                        <button
                                            type="submit"
                                            className=" w-100 btn btn-success"
                                        >
                                            ثبت
                                        </button>
                                    </div>
                                </div>


                            </div>

                        </form>
                    )}
                </Modal.Body>

            </Modal>
        </>
    );
}