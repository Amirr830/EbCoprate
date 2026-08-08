import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Css/NewDestinationModal.css";


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

function MapController({ position }) {
    const map = useMap()
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
            if (position) {
                map.flyTo(position, 17, {
                    animate: true,
                    duration: 1.2,
                });
            } else {
                map.setView(MASHHAD_CENTER, 13);
            }
        }, 150);
    }, [map, position]);
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
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [formData, setFormData] = useState({
        province: "خراسان رضوی",
        city: "مشهد",
        street: "",
        alley: "",
        plaque: "",
        unit: "",
        postalCode: "",
        description: "",
    });

    const handleShow = () => {
        setShow(true);
        setStep(1);
        setSearch("");
        setSearchResults([]);
        setShowResults(false);
        setSelectedPosition(null);
        setSelectedAddress("");
        setFormData({
            province: "خراسان رضوی",
            city: "مشهد",
            street: "",
            alley: "",
            plaque: "",
            unit: "",
            postalCode: "",
            description: "",
        });
    };


    const handleClose = () => {
        setShow(false);
        setStep(1);
        setSearch("");
        setSearchResults([]);
        setShowResults(false);
        setSelectedPosition(null);
        setSelectedAddress("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
        setSelectedPosition(position);
        setSelectedAddress(
            result.display_name || ""
        );
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
        setSearch(
            result.name ||
            street ||
            ""
        );
        setFormData((prev) => ({
            ...prev,
            province:
                address.state ||
                "خراسان رضوی",
            city: city,
            street: street,
        }));

        setShowResults(false);
    };


    const handleMapClick = async (event) => {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;
        const position = [lat, lon];
        setSelectedPosition(position);
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
                throw new Error(
                    "Reverse geocoding failed"
                );
            }

            const data = await response.json();
            if (!data) {
                return;
            }

            setSelectedAddress(
                data.display_name || ""
            );

            const address = data.address || {};
            const street =
                address.road ||
                address.pedestrian ||
                address.residential ||
                "";
            const city =
                address.city ||
                address.town ||
                address.municipality ||
                "مشهد";
            setSearch(street);
            setFormData((prev) => ({
                ...prev,
                province:
                    address.state ||
                    "خراسان رضوی",

                city: city,
                street: street,
            }));


        } catch (error) {

            console.error(
                "Reverse Address Error:",
                error
            );

        }
    };



    const handleNextStep = () => {
        if (!selectedPosition) {
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
            latitude:
                selectedPosition?.[0] || null,
            longitude:
                selectedPosition?.[1] || null,
            address:
                selectedAddress || "",
        };

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
                    <div className="address-modal-header">
                        <div className="address-header-title">
                            <div className="address-header-icon">
                                <span>⌖</span>
                            </div>
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

                        <button
                            type="button"
                            className="address-close-btn"
                            onClick={handleClose}
                        >
                            ×
                        </button>
                    </div>

                    <div className="address-stepper">
                        <div
                            className={`step-item ${
                                step >= 1
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
                            className={`step-line ${
                                step >= 2
                                    ? "active"
                                    : ""
                            }`}
                        />

                        <div
                            className={`step-item ${
                                step >= 2
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

                    </div>

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
                                        placeholder="مثلاً سیدرضی ۲۰، مشهد"
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
                                        position={
                                            selectedPosition
                                        }
                                    />
                                    {selectedPosition && (
                                        <Marker
                                            position={
                                                selectedPosition
                                            }
                                            icon={
                                                markerIcon
                                            }
                                        />
                                    )}
                                </MapContainer>

                                {!selectedPosition && (
                                    <div className="map-center-hint">
                                        <div className="map-hint-icon">
                                            ⌖
                                        </div>
                                        <span>
                                            روی نقشه کلیک کنید یا خیابان را جستجو کنید
                                        </span>
                                    </div>
                                )}
                            </div>

                            {selectedPosition && (
                                <div className="selected-address-box">
                                    <div className="selected-address-icon">
                                        ✓
                                    </div>

                                    <div className="selected-address-content">
                                        <span>
                                            موقعیت انتخاب شد
                                        </span>
                                        <strong>
                                            {selectedAddress ||
                                                "موقعیت روی نقشه انتخاب شد"}
                                        </strong>
                                    </div>
                                </div>
                            )}


                            <button
                                type="button"
                                className={`address-next-btn ${
                                    selectedPosition
                                        ? "enabled"
                                        : "disabled"
                                }`}
                                disabled={
                                    !selectedPosition
                                }
                                onClick={
                                    handleNextStep
                                }
                            >
                                <span>
                                    مرحله بعدی
                                </span>

                                <span className="next-arrow">
                                    ←
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

                                    <strong>
                                        {selectedAddress ||
                                            "موقعیت روی نقشه"}
                                    </strong>
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
                                <div className="row g-3">
                                    <div className="col-12 col-sm-6 col-md-5">
                                        <label>
                                            استان
                                        </label>

                                        <input
                                            type="text"
                                            name="province"
                                            value={
                                                formData.province
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="form-control address-input"
                                        />
                                    </div>


                                    <div className="col-12 col-sm-6 col-md-5">
                                        <label>
                                            شهر
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={
                                                formData.city
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            className="form-control address-input"
                                        />
                                    </div>


                                    <div className="col-12 col-sm-6 col-md-5">
                                        <label>
                                            خیابان
                                            <span className="required">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="street"
                                            value={
                                                formData.street
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="مثلاً سیدرضی"
                                            className="form-control address-input"
                                            required
                                        />
                                    </div>


                                    <div className="col-12 col-sm-6 col-md-5">

                                        <label>
                                            کوچه
                                        </label>

                                        <input
                                            type="text"
                                            name="alley"
                                            value={
                                                formData.alley
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="مثلاً کوچه ۲۰"
                                            className="form-control address-input"
                                        />
                                    </div>

                                    <div className="col-6 col-sm-4 col-md-5">
                                        <label>
                                            پلاک
                                        </label>

                                        <input
                                            type="text"
                                            name="plaque"
                                            value={
                                                formData.plaque
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="پلاک"
                                            className="form-control address-input"
                                        />

                                    </div>


                                    <div className="col-6 col-sm-4 col-md-5">
                                        <label>
                                            واحد
                                        </label>

                                        <input
                                            type="text"
                                            name="unit"
                                            value={
                                                formData.unit
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="واحد"
                                            className="form-control address-input"
                                        />

                                    </div>

                                    <div className="col-12 col-sm-6 col-md-5">

                                        <label>
                                            کد پستی
                                        </label>

                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={
                                                formData.postalCode
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="کد پستی ۱۰ رقمی"
                                            maxLength={10}
                                            className="form-control address-input"
                                        />

                                    </div>


                                    <div className="col-12">

                                        <label>
                                            توضیحات آدرس
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            placeholder="توضیحات تکمیلی آدرس..."
                                            rows={4}
                                            className="form-control address-textarea"
                                        />

                                    </div>
                                </div>
                            </div>

                            <div className="address-form-buttons">
                                <div className="row w-100 g-2">
                                    <div className="col-5 col-sm-4 col-md-3">

                                        <button
                                            type="button"
                                            className="address-back-btn w-100"
                                            onClick={
                                                handlePreviousStep
                                            }
                                        >
                                            → بازگشت
                                        </button>
                                    </div>


                                    <div className="col-7 col-sm-8 col-md-9">

                                        <button
                                            type="submit"
                                            className="address-submit-btn w-100"
                                        >
                                            ثبت آدرس
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