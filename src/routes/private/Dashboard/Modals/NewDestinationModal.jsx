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
import "../Css/NewDestinationModal.css";
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

function MapController({ selectedPosition }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (selectedPosition) {
        map.flyTo(selectedPosition, 17, {
          animate: true,
          duration: 1.2,
        });
      } else {
        map.setView(MASHHAD_CENTER, 13);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [map, selectedPosition]);

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

export default function NewDestinationModal(props) {
  const {
    addressType = "destination",
    onAddressSubmit,
    children,
  } = props;

  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const emptyAddress = {
    address: "",
    phone: "",
    floor: "",
    description: "",
  };

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    floor: "",
    description: "",
  });

  const isOrigin = addressType === "origin";

  const locationTitle = isOrigin
    ? "مبدأ"
    : "مقصد";

  const locationReceiveText = isOrigin
    ? "اطلاعات محل دریافت"
    : "اطلاعات محل تحویل";

  const locationDescription = isOrigin
    ? "توضیحات محل دریافت..."
    : "توضیحات محل تحویل...";

  const resetModal = () => {
    setStep(1);
    setSearch("");
    setSearchResults([]);
    setShowResults(false);
    setSearchLoading(false);
    setSelectedPosition(null);
    setSelectedAddress("");
    setShowAlert(false);
    setAlertMessage("");

    setFormData({
      ...emptyAddress,
    });
  };

  const handleShow = (event) => {
    if (event) {
      event.preventDefault();
    }

    resetModal();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    resetModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;

    const numericValue = value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const updateAddressFromMap = (
    data,
    position
  ) => {
    if (!data) {
      return;
    }

    const address =
      data.address || {};

    const street =
      address.road ||
      address.pedestrian ||
      address.residential ||
      address.neighbourhood ||
      "";

    const addressText =
      data.display_name || "";

    setSelectedPosition(position);
    setSelectedAddress(addressText);

    setSearch(
      street || ""
    );

    setFormData((prev) => ({
      ...prev,
      address:
        street ||
        addressText ||
        "",
    }));
  };

  const handleMarkerDragEnd = async (
    event
  ) => {
    const {
      lat,
      lng,
    } = event.target.getLatLng();

    const newPosition = [
      lat,
      lng,
    ];

    setSelectedPosition(newPosition);

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

      const response =
        await fetch(url, {
          headers: {
            Accept:
              "application/json",
          },
        });

      if (!response.ok) {
        throw new Error(
          "Reverse geocoding failed"
        );
      }

      const data =
        await response.json();

      updateAddressFromMap(
        data,
        newPosition
      );
    } catch (error) {
      console.error(
        "Reverse Address Error:",
        error
      );
    }
  };

  useEffect(() => {
    if (!show || step !== 1) {
      return;
    }

    const value =
      search.trim();

    if (value.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeout =
      setTimeout(
        async () => {
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

            const response =
              await fetch(url, {
                headers: {
                  Accept:
                    "application/json",
                },
              });

            if (!response.ok) {
              throw new Error(
                "جستجوی آدرس ناموفق"
              );
            }

            const data =
              await response.json();

            setSearchResults(
              data || []
            );

            setShowResults(true);
          } catch (error) {
            setSearchResults([]);
            setShowResults(true);
          } finally {
            setSearchLoading(false);
          }
        },
        500
      );

    return () =>
      clearTimeout(timeout);
  }, [
    search,
    show,
    step,
  ]);

  const handleSelectResult = (
    result
  ) => {
    const lat =
      Number(result.lat);

    const lon =
      Number(result.lon);

    const position = [
      lat,
      lon,
    ];

    const address =
      result.address || {};

    const street =
      address.road ||
      address.pedestrian ||
      address.residential ||
      address.neighbourhood ||
      "";

    const addressText =
      result.display_name || "";

    setSelectedPosition(
      position
    );

    setSelectedAddress(
      addressText
    );

    setSearch(
      result.name ||
      street ||
      ""
    );

    setFormData((prev) => ({
      ...prev,
      address:
        street ||
        addressText ||
        "",
    }));

    setShowResults(false);
  };

  const handleMapClick =
    async (event) => {
      const lat =
        event.latlng.lat;

      const lon =
        event.latlng.lng;

      const position = [
        lat,
        lon,
      ];

      setSelectedPosition(
        position
      );

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

        const response =
          await fetch(url, {
            headers: {
              Accept:
                "application/json",
            },
          });

        if (!response.ok) {
          throw new Error(
            "Reverse geocoding failed"
          );
        }

        const data =
          await response.json();

        updateAddressFromMap(
          data,
          position
        );
      } catch (error) {
        console.error(
          "Reverse Address Error:",
          error
        );
      }
    };

  const handleNextStep =
    () => {
      if (!selectedPosition) {
        setAlertMessage(
          `لطفاً موقعیت ${locationTitle} را روی نقشه انتخاب کنید`
        );

        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3500);

        return;
      }

      setStep(2);
    };

  const handlePreviousStep =
    () => {
      setStep(1);
    };

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    if (!selectedPosition) {
      setAlertMessage(
        `لطفاً موقعیت ${locationTitle} را انتخاب کنید`
      );

      setShowAlert(true);

      return;
    }

    if (!formData.address.trim()) {
      setAlertMessage(
        "لطفاً فیلد آدرس را پر کنید"
      );

      setShowAlert(true);

      return;
    }

    if (!formData.phone.trim()) {
      setAlertMessage(
        "لطفاً شماره تماس را وارد کنید"
      );

      setShowAlert(true);

      return;
    }

    const finalAddress = {
      ...formData,
      latitude:
        selectedPosition?.[0] ||
        null,
      longitude:
        selectedPosition?.[1] ||
        null,
      fullAddress:
        selectedAddress ||
        formData.address ||
        "",
    };

    if (onAddressSubmit) {
      onAddressSubmit({
        addressType,
        address: finalAddress,
      });
    }

    handleClose();
  };

  let newFirstChild =
    null;

  if (children) {
    const child =
      Array.isArray(children)
        ? children[0]
        : children;

    const originalOnClick =
      child?.props?.onClick;

    newFirstChild =
      React.cloneElement(
        child,
        {
          onClick: (event) => {
            if (originalOnClick) {
              originalOnClick(event);
            }

            handleShow(event);
          },
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
                  اطلاعات ناقص است
                </strong>

                <span>
                  {alertMessage}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAlert(false)
                }
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
                    ? `انتخاب موقعیت ${locationTitle}`
                    : `تکمیل آدرس ${locationTitle}`}
                </h5>

                <span>
                  {step === 1
                    ? `موقعیت ${locationTitle} را روی نقشه انتخاب کنید`
                    : `اطلاعات کامل ${locationTitle} را وارد کنید`}
                </span>

              </div>
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
                        searchResults.length >
                        0
                      ) {
                        setShowResults(
                          true
                        );
                      }
                    }}
                    placeholder="نام خیابان را وارد کنید..."
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
                        (
                          result,
                          index
                        ) => {

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
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler
                    onMapClick={
                      handleMapClick
                    }
                  />

                  <MapController
                    selectedPosition={
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
                      draggable={true}
                      eventHandlers={{
                        dragend:
                          handleMarkerDragEnd,
                      }}
                    >

                      <Tooltip
                        direction="top"
                        offset={[
                          0,
                          -35,
                        ]}
                        permanent={false}
                      >
                        {locationTitle}
                      </Tooltip>

                    </Marker>
                  )}

                </MapContainer>

                {!selectedPosition && (
                  <div className="map-center-hint">

                    <span>
                      موقعیت {locationTitle} را روی نقشه انتخاب کنید
                    </span>

                  </div>
                )}

              </div>

              {selectedPosition && (
                <div className="selected-address-box">
                  <div className="selected-address-content">
                    <span>
                      موقعیت {locationTitle} انتخاب شد
                    </span>

                    <strong>
                      {selectedAddress ||
                        `موقعیت ${locationTitle} روی نقشه انتخاب شد`}
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
                <span
                  style={{
                    fontSize: "20px",
                  }}
                >
                  مرحله بعدی
                </span>
              </button>

            </div>
          )}

          {step === 2 && (

            <form
              className="address-step-two"
              onSubmit={
                handleSubmit
              }
            >

              <div className="location-summary">
                <div className="summary-icon">
                  ✓
                </div>

                <div className="summary-content">
                  <div className="location-summary-routes">
                    <div className="route-summary-item origin-summary">
                      <span className="route-summary-dot">
                        ●
                      </span>

                      <div>

                        <span
                          style={{
                            fontSize:
                              "15px",
                          }}
                        >
                          {locationTitle}
                        </span>

                        <p
                          style={{
                            fontSize:
                              "15px",
                          }}
                        >
                          {selectedAddress ||
                            `موقعیت ${locationTitle} انتخاب شد`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handlePreviousStep
                  }
                  style={{
                    fontSize:
                      "15px",
                  }}
                >
                  تغییر موقعیت
                </button>

              </div>

              <div className="address-form">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="address-location-card origin-card">
                      <div className="address-location-card-header">
                        <div className="address-location-card-icon">
                          <span>
                            ●
                          </span>
                        </div>

                        <div>
                          <strong>
                            مشخصات {locationTitle}
                          </strong>

                          <span>
                            {locationReceiveText}
                          </span>
                        </div>
                      </div>

                      <div className="address-form-grid">
                        <div className="address-field address-field-large">

                          <label>
                            آدرس
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
                              name="address"
                              value={
                                formData.address
                              }
                              onChange={
                                handleInputChange
                              }
                              placeholder="آدرس را وارد کنید..."
                              className="form-control address-input"
                            />

                          </div>
                        </div>

                        <div className="address-field">
                          <label>
                            شماره تماس
                            <span className="required">
                              *
                            </span>
                          </label>

                          <div className="address-input-wrapper">
                            <span className="address-field-icon">
                              ☎
                            </span>

                            <input
                              type="text"
                              name="phone"
                              value={
                                formData.phone
                              }
                              onChange={
                                handleNumericInputChange
                              }
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="شماره تماس را وارد کنید..."
                              className="form-control address-input"
                            />

                          </div>
                        </div>

                        <div className="address-field-small">
                          <label>
                            طبقه
                          </label>

                          <div className="address-input-wrapper">
                            <span className="address-field-icon">
                              ▦
                            </span>
                            <input
                              type="text"
                              name="floor"
                              value={
                                formData.floor
                              }
                              onChange={
                                handleNumericInputChange
                              }
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="طبقه را وارد کنید..."
                              className="form-control address-input"
                            />

                          </div>
                        </div>

                        <div className="address-field address-description-field">
                          <label>
                            توضیحات {locationTitle}
                          </label>

                          <div className="address-input-wrapper address-textarea-wrapper">
                            <span className="address-field-icon textarea-icon">
                              ✎
                            </span>
                            <textarea
                              name="description"
                              value={
                                formData.description
                              }
                              onChange={
                                handleInputChange
                              }
                              placeholder={
                                locationDescription
                              }
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
                      type="submit"
                      className="w-100 btn btn-success"
                      style={{
                        fontSize:
                          "20px",
                      }}
                    >
                      ثبت
                    </button>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      className="w-100 btn btn-danger"
                      onClick={
                        handlePreviousStep
                      }
                      style={{
                        fontSize:
                          "20px",
                      }}
                    >
                      بازگشت
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