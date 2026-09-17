import React, { useState, useRef, useEffect } from 'react';
import './Css/RequestForm.css';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaPencilAlt,
  FaChevronDown,
  FaTag,
  FaTimes,
  FaPlus,
  FaClipboardList,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import paths from "../../../../src/app/paths.json";
import strings from "../../../app/String.json";
import NewDestinationModal from "./Modals/NewDestinationModal";
import VehicleTypeModal from "./Modals/VehicleTypeModal";
import SubmitRequestModal from "./Modals/SubmitRequestModal";
import CurrentRequest from "./CurrentRequest";
import Map from "./Map";
import ShippingMethodModal from "./Modals/ShippingMethodModal";
import RegisterDiscountCode from "./Modals/RegisterDiscountCode";

const getRequestData = (strings) => {
  return {
    serviceOptions: [
      {
        id: 1,
        title: strings.services.heavyLoad,
      },
      {
        id: 2,
        title: strings.services.box,
      },
      {
        id: 3,
        title: strings.services.roundTrip,
      },
      {
        id: 4,
        title: strings.services.fragile,
      },
      {
        id: 5,
        title: strings.services.insurance,
      },
      {
        id: 6,
        title: strings.services.express,
      },
      {
        id: 7,
        title: strings.services.needCall,
      },
    ],
    vehicleClassMap: {
      [strings.vehicleTypes.pickup]: 1,
      [strings.vehicleTypes.motorWithBox]: 2,
      [strings.vehicleTypes.motorWithoutBox]: 3,
      [strings.vehicleTypes.car]: 4,
    },
    stopTimes: [
      strings.requestForm.noStop,
      strings.requestForm.fifteenMinutes,
      strings.requestForm.thirtyMinutes,
    ],
    itemValues: [
      strings.requestForm.underTwentyFiveMillion,
      strings.requestForm.twentyFiveToFiftyMillion,
      strings.requestForm.fiftyToOneHundredMillion,
      strings.requestForm.overOneHundredMillion,
    ],
  };
};

function RequestForm() {
  const [sender, setSender] = useState(true);
  const [cash, setCash] = useState(true);
  const [vehicleType, setVehicleType] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originLocation, setOriginLocation] = useState({
    lat: null,
    lng: null,
  });
  const [destinationLocation, setDestinationLocation] = useState({
    lat: null,
    lng: null,
  });
  const [mobilePage, setMobilePage] = useState("request");
  const [stopTime, setStopTime] = useState("بدون توقف");
  const [courierCode, setCourierCode] = useState("");
  const [itemValue, setItemValue] = useState("زیر ۲۵ میلیون تومان");
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const [additionalDestinations, setAdditionalDestinations] = useState([]);
  const [serviceSpeed, setServiceSpeed] = useState("");
  const [discountData, setDiscountData] = useState(null);
  const [discountAlert, setDiscountAlert] = useState("");
  const [openAdditionalDestinationId, setOpenAdditionalDestinationId] = useState(null);
  const [showAdditionalDestinationModal, setShowAdditionalDestinationModal] = useState(false);
  const [addressModalType, setAddressModalType] = useState("destination");
  const [addressModalInitialData, setAddressModalInitialData] = useState(null);
  const [editingAdditionalDestinationId, setEditingAdditionalDestinationId] = useState(null);

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const requestData = getRequestData(strings);

  const handleDiscountSelect = (discount) => {
    if (!discount?.code) {
      return;
    }

    setDiscountCode(discount.code);
    setDiscountData(discount);
    setDiscountAlert("");
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountData(null);
    setDiscountAlert("");
  };

  const handleInvalidDiscount = () => {
    setDiscountAlert(
      "امکان انتخاب کد تخفیف امکان‌پذیر نیست؛ کد تخفیف نامعتبر است!"
    );

    setTimeout(() => {
      setDiscountAlert("");
    }, 4000);
  };

  const getVehicleClass = () => {
    return requestData.vehicleClassMap[vehicleType] || 0;
  };

  const getStopTimeSec = () => {
    if (stopTime === strings.requestForm.fifteenMinutes) {
      return 15;
    }

    if (stopTime === strings.requestForm.thirtyMinutes) {
      return 30;
    }

    return 0;
  };

  const getPaymentType = () => {
    if (cash) {
      return {
        payType: 1,
        payTypeName: "نقدی",
      };
    }

    return {
      payType: 2,
      payTypeName: "اعتباری از کیف پول",
    };
  };

  const resetForm = () => {
    setOriginAddress("");
    setDestinationAddress("");
    setOriginLocation({
      lat: null,
      lng: null,
    });
    setDestinationLocation({
      lat: null,
      lng: null,
    });
    setAdditionalDestinations([]);
    setVehicleType("");
    setSelectedServices([]);
    setSender(true);
    setCash(true);
    setServiceOpen(false);
    setStopTime(strings.requestForm.noStop);
    setCourierCode("");
    setItemValue(strings.requestForm.underTwentyFiveMillion);
    setNotes("");
    setDiscountCode("");
    setDiscountData(null);
    setDiscountAlert("");
    setDiscountDescription("");
    setServiceSpeed("");
    setShowAdditionalDestinationModal(false);
    setAddressModalType("destination");
    setAddressModalInitialData(null);
    setEditingAdditionalDestinationId(null);
  };

  const resetOtherFields = () => {
    setVehicleType("");
    setSelectedServices([]);
    setSender(true);
    setCash(true);
    setServiceOpen(false);
    setStopTime(strings.requestForm.noStop);
    setCourierCode("");
    setItemValue(strings.requestForm.underTwentyFiveMillion);
    setNotes("");
    setDiscountCode("");
    setDiscountData(null);
    setDiscountAlert("");
    setServiceSpeed("");
    setDiscountDescription("");
  };

  useEffect(() => {
    const quickRequest = location?.state?.quickRequest;

    if (!quickRequest) {
      return;
    }

    setOriginAddress(quickRequest.originAddress || "");
    setDestinationAddress(quickRequest.destinationAddress || "");

    setOriginLocation(
      quickRequest.originLocation || {
        lat: null,
        lng: null,
      }
    );

    setDestinationLocation(
      quickRequest.destinationLocation || {
        lat: null,
        lng: null,
      }
    );

    setAdditionalDestinations(
      quickRequest.additionalDestinations || []
    );

    setVehicleType(quickRequest.vehicleType || "");
    setSelectedServices(quickRequest.selectedServices || []);

    setSender(
      typeof quickRequest.sender === "boolean"
        ? quickRequest.sender
        : true
    );

    setCash(
      typeof quickRequest.cash === "boolean"
        ? quickRequest.cash
        : true
    );

    setStopTime(
      quickRequest.stopTime || strings.requestForm.noStop
    );

    setCourierCode(
      quickRequest.courierCode || ""
    );

    setItemValue(
      quickRequest.itemValue ||
      strings.requestForm.underTwentyFiveMillion
    );

    setNotes(
      quickRequest.notes || ""
    );

    setDiscountCode(
      quickRequest.discountCode || ""
    );

    setDiscountData(
      quickRequest.discountData || null
    );

    setServiceSpeed(
      quickRequest.serviceSpeed || ""
    );

    window.history.replaceState({}, document.title);
  }, [location.state]);

  const toggleService = (item) => {
    if (selectedServices.includes(item)) {
      setSelectedServices(
        selectedServices.filter((x) => x !== item)
      );
    } else {
      setSelectedServices([
        ...selectedServices,
        item,
      ]);
    }
  };

  const createDestinationId = () => {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}`;
  };

  const closeAddressModal = () => {
    setShowAdditionalDestinationModal(false);
    setAddressModalInitialData(null);
    setEditingAdditionalDestinationId(null);
    setOpenAdditionalDestinationId(null);
  };

  const openOriginModal = () => {
    resetOtherFields();

    setAddressModalType("origin");
    setAddressModalInitialData({
      address: originAddress || "",
      fullAddress: originAddress || "",
      lat: originLocation.lat,
      lng: originLocation.lng,
      latitude: originLocation.lat,
      longitude: originLocation.lng,
      phone: "",
      floor: "",
      description: "",
    });
    setEditingAdditionalDestinationId(null);
    setShowAdditionalDestinationModal(true);
  };

  const openDestinationModal = () => {
    resetOtherFields();

    setAddressModalType("destination");
    setAddressModalInitialData({
      address: destinationAddress || "",
      fullAddress: destinationAddress || "",
      lat: destinationLocation.lat,
      lng: destinationLocation.lng,
      latitude: destinationLocation.lat,
      longitude: destinationLocation.lng,
      phone: "",
      floor: "",
      description: "",
    });
    setEditingAdditionalDestinationId(null);
    setShowAdditionalDestinationModal(true);
  };

  const addAdditionalDestination = () => {
    const newId = createDestinationId();

    const newDestination = {
      id: newId,
      address: "",
      fullAddress: "",
      lat: null,
      lng: null,
      latitude: null,
      longitude: null,
      phone: "",
      floor: "",
      description: "",
    };

    setAdditionalDestinations((prev) => [
      ...prev,
      newDestination,
    ]);

    setAddressModalType("additional");
    setAddressModalInitialData(newDestination);
    setEditingAdditionalDestinationId(newId);
    setOpenAdditionalDestinationId(newId);
    setShowAdditionalDestinationModal(true);
  };

  const openAdditionalDestinationModal = (item) => {
    resetOtherFields();

    setAddressModalType("additional");
    setAddressModalInitialData({
      ...item,
      address: item.address || item.fullAddress || "",
      fullAddress: item.fullAddress || item.address || "",
      lat: item.lat ?? item.latitude ?? null,
      lng: item.lng ?? item.longitude ?? null,
      latitude: item.latitude ?? item.lat ?? null,
      longitude: item.longitude ?? item.lng ?? null,
      phone: item.phone || "",
      floor: item.floor || "",
      description: item.description || "",
    });
    setEditingAdditionalDestinationId(item.id);
    setOpenAdditionalDestinationId(item.id);
    setShowAdditionalDestinationModal(true);
  };

  const handleAddressSubmit = (data) => {
    if (!data?.address) {
      return;
    }

    const addressData = data.address;

    const address =
      addressData.address ||
      addressData.fullAddress ||
      "";

    const lat =
      data.lat ??
      addressData.lat ??
      data.latitude ??
      addressData.latitude ??
      null;

    const lng =
      data.lng ??
      addressData.lng ??
      data.lon ??
      addressData.lon ??
      data.longitude ??
      addressData.longitude ??
      null;

    const phone =
      addressData.phone || "";

    const floor =
      addressData.floor || "";

    const description =
      addressData.description || "";

    const fullAddress =
      addressData.fullAddress ||
      address ||
      "";

    if (data.addressType === "origin") {
      setOriginAddress(address);

      setOriginLocation({
        lat,
        lng,
      });

      closeAddressModal();
      return;
    }

    if (data.addressType === "destination") {
      setDestinationAddress(address);

      setDestinationLocation({
        lat,
        lng,
      });

      closeAddressModal();
      return;
    }

    if (data.addressType === "additional") {
      if (!editingAdditionalDestinationId) {
        closeAddressModal();
        return;
      }

      setAdditionalDestinations((prev) =>
        prev.map((item) => {
          if (
            item.id !==
            editingAdditionalDestinationId
          ) {
            return item;
          }

          return {
            ...item,
            address,
            fullAddress,
            lat,
            lng,
            latitude: lat,
            longitude: lng,
            phone,
            floor,
            description,
          };
        })
      );

      closeAddressModal();
    }
  };

  const handleAddressClick = () => {
    resetOtherFields();
  };

  const removeOrigin = () => {
    setOriginAddress("");
    setOriginLocation({
      lat: null,
      lng: null,
    });
  };

  const removeDestination = () => {
    setDestinationAddress("");
    setDestinationLocation({
      lat: null,
      lng: null,
    });
  };

  const removeAdditionalDestination = (id) => {
    setAdditionalDestinations((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    setOpenAdditionalDestinationId(null);

    if (
      editingAdditionalDestinationId === id
    ) {
      closeAddressModal();
    }
  };

  const handleConfirmSubmit = (confirmData) => {
    const selectedAccessibilityIds = selectedServices
      .map((serviceTitle) => {
        const service = requestData.serviceOptions.find(
          (item) => item.title === serviceTitle
        );

        return service?.id;
      })
      .filter(Boolean);

    const selectedAccessibilityNames = selectedServices
      .map((serviceTitle) => {
        const service = requestData.serviceOptions.find(
          (item) => item.title === serviceTitle
        );

        return service?.title;
      })
      .filter(Boolean);

    const addresses = [
      {
        fullAddress: originAddress,
        findAddress: originAddress,
        lat: originLocation.lat,
        lng: originLocation.lng,
        neighbourhood: "",
        neighbourhoodLat: null,
        neighbourhoodLng: null,
        neighbourhoodCode: null,
        addressPhone: strings.requestForm.addressPhone,
        cityCode: 1,
        cityName: strings.requestForm.cityName,
      },
      {
        fullAddress: destinationAddress,
        findAddress: destinationAddress,
        lat: destinationLocation.lat,
        lng: destinationLocation.lng,
        neighbourhood: "",
        neighbourhoodLat: null,
        neighbourhoodLng: null,
        neighbourhoodCode: null,
        addressPhone: strings.requestForm.addressPhone,
        cityCode: 1,
        cityName: strings.requestForm.cityName,
      },
      ...additionalDestinations
        .filter((item) => item.fullAddress || item.address)
        .map((item) => ({
          fullAddress:
            item.fullAddress ||
            item.address ||
            "",
          findAddress:
            item.fullAddress ||
            item.address ||
            "",
          lat: item.lat ?? item.latitude ?? null,
          lng: item.lng ?? item.longitude ?? null,
          neighbourhood: "",
          neighbourhoodLat: null,
          neighbourhoodLng: null,
          neighbourhoodCode: null,
          addressPhone:
            item.phone ||
            strings.requestForm.addressPhone,
          cityCode: 1,
          cityName: strings.requestForm.cityName,
        })),
    ];

    const paymentType = getPaymentType();

    const savedRequestData = {
      originAddress,
      destinationAddress,
      originLocation,
      destinationLocation,
      additionalDestinations,
      vehicleType,
      selectedServices,
      sender,
      cash,
      stopTime,
      courierCode,
      itemValue,
      notes,
      discountCode,
      discountData,
      discountDescription,
      serviceSpeed,
      payType: paymentType.payType,
      payTypeName: paymentType.payTypeName,
    };

    const params = {
      custName: strings.requestForm.customerName,
      custTel: strings.requestForm.addressPhone,
      custMobile: strings.requestForm.addressPhone,
      desc: notes || strings.requestForm.tripDescription,
      vehicleClass: getVehicleClass(),
      serviceSpeed: serviceSpeed || 0,
      stopTimeSec: getStopTimeSec(),
      discountCode: discountCode || null,
      discountDescription: discountDescription || "",
      accessibilities: selectedAccessibilityIds.join(","),
      accessibilitiesStr: selectedAccessibilityNames.join(","),
      fareExtra: 0,
      farePercent: 0,
      fareAlternative: 0,
      agentType: 3,
      fullResult: 1,
      tripCount: 1,
      targetDriverCode: 123,
      force: 0,
      addresses,
      payType: paymentType.payType,
      payTypeName: paymentType.payTypeName,
    };

    console.log("paramsssssssss:", params);

    const quickRequestName =
      typeof confirmData === "string"
        ? confirmData.trim()
        : "";

    if (quickRequestName) {
      try {
        const savedQuickRequests =
          JSON.parse(
            localStorage.getItem("quickRequests") ||
            "[]"
          );

        const oldQuickRequests =
          Array.isArray(savedQuickRequests)
            ? savedQuickRequests
              .filter(
                (item) =>
                  item &&
                  typeof item === "object" &&
                  typeof item.name === "string"
              )
              .map((item) => ({
                ...item,
                name: item.name.trim(),
              }))
              .filter(
                (item) => item.name
              )
            : [];

        const newQuickRequest = {
          id: Date.now(),
          name: quickRequestName,
          ...requestData,
        };

        const updatedQuickRequests = [
          ...oldQuickRequests,
          newQuickRequest,
        ];

        localStorage.setItem(
          "quickRequests",
          JSON.stringify(
            updatedQuickRequests
          )
        );

        window.dispatchEvent(
          new Event("quickRequestsUpdated")
        );
      } catch (error) {
        console.warn(
          strings.requestForm.quickRequestSaveFailed,
          error
        );
      }
    }

    navigate(
      paths.private.definitions.CurrentRequest,
      {
        state: {
          requestStarted: true,
          ...savedRequestData,
        },
      }
    );
  };

  const renderMobileHeader = () => {
    return (
      <div className="mobile-common-header">
      </div>
    );
  };

  const renderMobilePage = () => {
    return (
      <div className="modern-form-card w-100 bg-white rounded-3 p-3 pt-2 shadow-sm">
        <div className="route-card mb-2">
          <div className="route-item">
            <div className="route-side">
              <span className="route-dot origin-dot"></span>

              <span className="route-label">
                {strings.origin}
              </span>
            </div>

            <div
              className="route-address"
              style={{
                cursor: "pointer",
                width: "100%",
              }}
              onClick={openOriginModal}
            >
              {originAddress ? (
                originAddress
              ) : (
                <span className="route-placeholder">
                  {strings.requestForm.notSelectedOrigin}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className="btn btn-sm btn-warning route-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openOriginModal();
                }}
              >
                <FaPencilAlt />
              </button>

              <button
                type="button"
                className="btn btn-sm btn-danger route-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOrigin();
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="route-item">
            <div className="route-side">
              <span className="route-dot dest-dot"></span>

              <span className="route-label">
                {strings.destination}
              </span>
            </div>

            <div
              className="route-address"
              style={{
                cursor: "pointer",
                width: "100%",
              }}
              onClick={openDestinationModal}
            >
              {destinationAddress ? (
                destinationAddress
              ) : (
                <span className="route-placeholder">
                  {strings.requestForm.notSelectedDestination}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className="btn btn-sm btn-warning route-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDestinationModal();
                }}
              >
                <FaPencilAlt />
              </button>

              <button
                type="button"
                className="btn btn-sm btn-danger route-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeDestination();
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {additionalDestinations.map(
            (item, index) => {
              const destinationNumber =
                index + 2;

              const destinationText =
                item.fullAddress ||
                item.address ||
                "";

              return (
                <div
                  className="route-item"
                  key={item.id}
                  style={{
                    position: "relative",
                    minHeight: "58px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  }}
                  onClick={() =>
                    openAdditionalDestinationModal(
                      item
                    )
                  }
                >
                  <div className="route-side">
                    <span
                      className="route-dot dest-dot"
                      style={{
                        backgroundColor: "#ffc107",
                        borderColor: "#ffc107",
                      }}
                    ></span>

                    <span className="route-label">
                      مقصد {destinationNumber}
                    </span>
                  </div>

                  <div
                    className="route-address"
                    style={{
                      width: "100%",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      lineHeight: "1.8",
                      cursor: "pointer",
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {destinationText ? (
                      destinationText
                    ) : (
                      <span className="route-placeholder">
                        برای انتخاب مقصد {destinationNumber} کلیک کنید
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-warning"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openAdditionalDestinationModal(
                          item
                        );
                      }}
                      title={`ویرایش مقصد ${destinationNumber}`}
                      style={{
                        width: "32px",
                        height: "32px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                      }}
                    >
                      <FaPencilAlt />
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeAdditionalDestination(
                          item.id
                        );
                      }}
                      title={`حذف مقصد ${destinationNumber}`}
                      style={{
                        width: "32px",
                        height: "32px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <Row className="mb-2">
          <Col xs={12}>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={addAdditionalDestination}
              style={{
                minHeight: "48px",
                borderRadius: "10px",
                fontSize: "16px",
              }}
            >
              <span
                className="plus-icon"
                style={{
                  marginLeft: "8px",
                  fontSize: "20px",
                }}
              >
                +
              </span>

              {strings.requestForm.addNewDestination}
            </button>
          </Col>
        </Row>

        <NewDestinationModal
          addressType={addressModalType}
          onAddressSubmit={handleAddressSubmit}
          onClose={closeAddressModal}
          isOpen={showAdditionalDestinationModal}
          initialData={addressModalInitialData}
        />

        <Row className="mb-2 mt-1">
          <Col xs={12}>
            <div className="vehicle-dropdown">
              <VehicleTypeModal
                onVehicleSelect={(vehicle) => {
                  setVehicleType(vehicle);
                }}
              >
                <button
                  type="button"
                  className={`select-vehicle-btn ${vehicleType
                      ? "vehicle-selected-btn"
                      : ""
                    }`}
                  style={{
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {vehicleType ||
                    strings.requestForm.vehicleType}
                </button>
              </VehicleTypeModal>
            </div>
          </Col>
        </Row>

        <Row className="g-2 mb-2 request-detail-fields">
          <Col xs={12} md={4}>
            <div className="custom-floating-input modern-field h-100">
              <select
                id="stopTime"
                value={stopTime}
                onChange={(e) =>
                  setStopTime(
                    e.target.value
                  )
                }
              >
                {requestData.stopTimes.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="stopTime">
                {strings.requestForm.stopTime}
              </label>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="custom-floating-input modern-field h-100">
              <input
                id="courierCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={
                  strings.requestForm.courierCodePlaceholder
                }
                autoComplete="off"
                value={courierCode}
                onChange={(e) =>
                  setCourierCode(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <label htmlFor="courierCode">
                {strings.requestForm.courierCode}
              </label>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="custom-floating-input modern-field h-100">
              <select
                id="itemValue"
                value={itemValue}
                onChange={(e) =>
                  setItemValue(
                    e.target.value
                  )
                }
              >
                {requestData.itemValues.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="itemValue">
                {strings.requestForm.itemValue}
              </label>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <div className="custom-textarea-group">
              <textarea
                id="notes"
                placeholder={
                  strings.requestForm.notes
                }
                rows="2"
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
              ></textarea>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <div className="service-dropdown">
              <label className="service-label">
                {strings.requestForm.serviceFeatures}
              </label>

              <div
                className={`service-box ${serviceOpen
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setServiceOpen(
                    !serviceOpen
                  )
                }
              >
                <div className="selected-tags">
                  {selectedServices.length ===
                    0 ? (
                    <div></div>
                  ) : (
                    selectedServices.map(
                      (item) => (
                        <div
                          className="service-tag"
                          key={item}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          {item}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedServices(
                                selectedServices.filter(
                                  (x) =>
                                    x !==
                                    item
                                )
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      )
                    )
                  )}
                </div>

                <FaChevronDown
                  className={`dropdown-icon ${serviceOpen
                      ? "rotate"
                      : ""
                    }`}
                />
              </div>

              {serviceOpen && (
                <div className="service-menu">
                  {requestData.serviceOptions.map(
                    (item) => (
                      <div
                        key={item.id}
                        className={`service-item ${selectedServices.includes(
                          item.title
                        )
                            ? "selected"
                            : ""
                          }`}
                        onClick={() =>
                          toggleService(
                            item.title
                          )
                        }
                      >
                        <span>
                          {item.title}
                        </span>

                        {selectedServices.includes(
                          item.title
                        ) && (
                            <span className="check">
                              ✓
                            </span>
                          )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <label className="segment-label">
              {strings.requestForm.payer}
            </label>

            <div className="segment-toggle-box">
              <div
                className={`segment-btn ${sender
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setSender(true)
                }
              >
                {strings.requestForm.sender}
              </div>

              <div
                className={`segment-btn ${!sender
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setSender(false)
                }
              >
                {strings.requestForm.receiver}
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <label className="segment-label">
              {strings.requestForm.paymentMethod}
            </label>

            <div className="segment-toggle-box">
              <div
                className={`segment-btn ${cash
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setCash(true)
                }
              >
                {strings.requestForm.cash}
              </div>

              {sender && (
                <div
                  className={`segment-btn ${!cash
                      ? "active"
                      : ""
                    }`}
                  onClick={() =>
                    setCash(false)
                  }
                >
                  {strings.requestForm.creditWallet}
                </div>
              )}
            </div>
          </Col>
        </Row>

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

        <Row className="mb-2">
          <Col xs={12}>
            <div className="payment-discount-card">
              <div className="discount-question-row">
                <span className="discount-question">
                  {discountData?.code ? (
                    <>
                      کد تخفیف :{" "}
                      <span className="discount-question-selected">
                        {discountData.code}
                      </span>
                    </>
                  ) : (
                    strings.requestForm.discountQuestion
                  )}
                </span>

                <div className="discount-action-buttons">
                  {discountData?.code && (
                    <button
                      type="button"
                      className="remove-discount-btn"
                      onClick={
                        handleRemoveDiscount
                      }
                      title="حذف کد تخفیف"
                    >
                      <FaTimes />
                    </button>
                  )}

                  <RegisterDiscountCode
                    onDiscountSelect={
                      handleDiscountSelect
                    }
                    onInvalidDiscount={
                      handleInvalidDiscount
                    }
                  >
                    <button
                      type="button"
                      className="apply-code-btn btn btn-success"
                    >
                      {
                        strings.requestForm.registerCode
                      }
                    </button>
                  </RegisterDiscountCode>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-2">
          <Col xs={8}>
            <SubmitRequestModal
              onConfirm={(
                quickRequestName
              ) => {
                handleConfirmSubmit(
                  quickRequestName
                );
              }}
            >
              <button
                type="button"
                className="btn btn-success w-100 py-2"
                style={{
                  fontSize: "20px",
                }}
              >
                {strings.requestForm.request}
              </button>
            </SubmitRequestModal>
          </Col>

          <Col xs={4}>
            <ShippingMethodModal
              onSelect={(speed) => {
                setServiceSpeed(speed);
              }}
            >
              <button
                type="button"
                className="btn btn-warning text-black w-100 py-2"
                style={{
                  fontSize: "15px",
                  borderRadius: "8px",
                  height: "50px",
                }}
              >
                {
                  strings.requestForm.shippingMethod
                }
              </button>
            </ShippingMethodModal>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container
      fluid
      className="modern-request-container d-flex justify-content-center align-items-start p-0 p-md-2"
    >
      <div className="d-xl-none w-100 mobile-content-area">
        {renderMobileHeader()}

        {mobilePage === "request" && (
          <div className="mobile-page-wrapper mobile-request-page">
            {renderMobilePage()}
          </div>
        )}

        {mobilePage === "info" && (
          <div className="mobile-page-wrapper mobile-current-page">
            <CurrentRequest />
          </div>
        )}

        {mobilePage === "map" && (
          <div className="mobile-page-wrapper mobile-map-page">
            <Map />
          </div>
        )}
      </div>

      <div className="d-none d-xl-block w-100">
        {renderMobilePage()}
      </div>

      <Row className="d-xl-none mobile-bottom-navigation">
        <Col xs={4}>
          <button
            type="button"
            className={`mobile-nav-btn ${mobilePage === "request"
                ? "active"
                : ""
              }`}
            onClick={() => {
              setMobilePage("request");
            }}
            aria-label="درخواست سفر"
          >
            <span className="mobile-nav-icon">
              <FaPlus />
            </span>

            <span>
              درخواست سفر
            </span>
          </button>
        </Col>

        <Col xs={4}>
          <button
            type="button"
            className={`mobile-nav-btn ${mobilePage === "info"
                ? "active"
                : ""
              }`}
            onClick={() => {
              setMobilePage("info");
            }}
            aria-label="اطلاعات سفر"
          >
            <span className="mobile-nav-icon">
              <FaClipboardList />
            </span>

            <span>
              اطلاعات سفر
            </span>
          </button>
        </Col>

        <Col xs={4}>
          <button
            type="button"
            className={`mobile-nav-btn ${mobilePage === "map"
                ? "active"
                : ""
              }`}
            onClick={() => {
              setMobilePage("map");
            }}
            aria-label="نقشه"
          >
            <span className="mobile-nav-icon">
              <FaMapMarkedAlt />
            </span>

            <span>
              نقشه
            </span>
          </button>
        </Col>
      </Row>
    </Container>
  );
}

export default RequestForm;