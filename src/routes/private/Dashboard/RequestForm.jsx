import React, { useState, useRef, useEffect } from 'react';
import './Css/RequestForm.css';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { FaPencilAlt, FaChevronDown, FaTag, FaMotorcycle, FaPlus, FaTimes } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoWalletOutline } from 'react-icons/io5';
import SideBar from './SideBar';
import { FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import paths from "../../../../src/app/paths.json";
import NewDestinationModal from "./Modals/NewDestinationModal"
import EdirAddressModal from "./Modals/EditAddressModal"
import VehicleTypeModal from "./Modals/VehicleTypeModal"
import strings from "../../../app/String.json"
import SubmitRequestModal from "./Modals/SubmitRequestModal"
import { useLocation } from "react-router-dom";

function RequestForm() {
  const [sender, setSender] = useState(true);
  const [cash, setCash] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);
  const [vehicleType, setVehicleType] = useState("");
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [editAddress, setEditAddress] = useState("");

  const serviceOptions = [
    "بار سنگین",
    "صندوق",
    "رفت و برگشت",
    "حمل مرسوله شکستنی",
    "بیمه بار",
    "ارسال فوری",
    "نیاز به تماس",
  ];

  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");


  const resetForm = () => {

    setOriginAddress("");
    setDestinationAddress("");
    setVehicleType("");
    setSelectedServices([]);

    setSender(true);
    setCash(true);

    setServiceOpen(false);

  };

  useEffect(() => {
    const quickRequest = location?.state?.quickRequest;
    if (!quickRequest) {
      return;
    }
    setOriginAddress(quickRequest.originAddress || "");
    setDestinationAddress(
      quickRequest.destinationAddress || ""
    );
    setVehicleType(
      quickRequest.vehicleType || ""
    );
    setSelectedServices(
      quickRequest.selectedServices || []
    );
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

    window.history.replaceState(
      {},
      document.title
    );


  }, [location.state]);



  const toggleService = (item) => {
    if (selectedServices.includes(item)) {
      setSelectedServices(
        selectedServices.filter((x) => x !== item)
      );
    } else {
      setSelectedServices([...selectedServices, item]);
    }
  };

  const handleAddressSubmit = (data) => {
    const createAddress = (addressData) => {
      const parts = [
        addressData.province,
        addressData.city,
        addressData.street,
        addressData.alley
          ? `کوچه ${addressData.alley}`
          : "",
        addressData.plaque
          ? `پلاک ${addressData.plaque}`
          : "",
        addressData.unit
          ? `واحد ${addressData.unit}`
          : "",
      ];

      return parts
        .filter(Boolean)
        .join("، ");
    };

    const address = createAddress(data.address);

    if (data.addressType === "origin") {
      setOriginAddress(address);
    }

    if (data.addressType === "destination") {
      setDestinationAddress(address);
    }
  };


  const handleConfirmSubmit = (shouldAddToQuickRequest) => {
    const requestData = {
      originAddress,
      destinationAddress,
      vehicleType,
      selectedServices,
      sender,
      cash,
    };

    if (shouldAddToQuickRequest) {
      const oldQuickRequests = JSON.parse(
        localStorage.getItem("quickRequests") || "[]"
      );

      const newQuickRequest = {
        id: Date.now(),
        ...requestData,
      };

      const updatedQuickRequests = [
        ...oldQuickRequests,
        newQuickRequest,
      ];

      localStorage.setItem(
        "quickRequests",
        JSON.stringify(updatedQuickRequests)
      );

      window.dispatchEvent(
        new Event("quickRequestsUpdated")
      );
    }

    navigate(paths.private.definitions.CurrentRequest, {
      state: {
        requestStarted: true,
        ...requestData,
      },
    });
  };



  return (
    <Container fluid className="modern-request-container h-100 d-flex justify-content-center align-items-center p-0 p-md-2">

      <Offcanvas
        show={showMenu}
        onHide={handleCloseMenu}
        placement="end"
        dir="rtl"
        className="custom-mobile-menu p-0"
      >
        <Offcanvas.Header className="d-flex justify-content-end align-items-center border-bottom pb-2 pt-3 px-3">
          <button type="button" className="btn p-0 border-0 text-muted" onClick={handleCloseMenu}>
            <FaTimes size={20} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 overflow-hidden">
          <SideBar />
        </Offcanvas.Body>
      </Offcanvas>

      <div className="modern-form-card w-100 bg-white rounded-3 p-4 pt-3 mt-2 border shadow-sm">
        <div className="form-scroll-content">
          <div className="d-flex d-md-none align-items-center justify-content-between pb-3 mb-3 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-link text-dark p-0 m-0 border-0 hamburger-btn"
                onClick={handleShowMenu}
              >
                <RxHamburgerMenu size={24} />
              </button>
              {/* <span className="fw-bold fs-5 me-1">ثبت درخواست</span> */}
            </div>

            <div
              className="d-flex align-items-center gap-1 bg-warning px-2 py-1 rounded-2 border border-dark"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(paths.private.definitions.Wallet)}
            >
              <div
                className="bg-warning text-dark border border-dark rounded-circle p-1 d-flex align-items-center justify-content-center"
                style={{ width: 18, height: 18 }}
              >
                <FaPlus size={8} />
              </div>

              <span className=" px-1" style={{ fontSize: "16px" }}>
                ۲۵,۰۰۰ تومان
              </span>

              {/* <IoWalletOutline size={20} className="text-dark" /> */}
            </div>
          </div>
        </div>

        <div className="route-card mb-3">

          <div className="route-item">
            <div className="route-side">
              <span className="route-dot origin-dot"></span>
              <span className="route-label">مبدأ</span>
            </div>

            {originAddress ? (
              <div className="route-address">
                {originAddress}
              </div>
            ) : (
              <NewDestinationModal
                addressType="origin"
                onAddressSubmit={handleAddressSubmit}
              >
                <div
                  className="route-address"
                  style={{
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <span className="route-placeholder">
                    هنوز مبدأ انتخاب نشده است
                  </span>
                </div>
              </NewDestinationModal>
            )}

            <EdirAddressModal
              address={originAddress}
              addressType="origin"
              onAddressChange={(newAddress) => {
                setOriginAddress(newAddress);
              }}
            >
              <button
                type="button"
                className="route-edit"
              >
                <FaPencilAlt />
              </button>
            </EdirAddressModal>
          </div>


          <div className="route-item">
            <div className="route-side">
              <span className="route-dot dest-dot"></span>
              <span className="route-label">مقصد</span>
            </div>

            {destinationAddress ? (
              <div className="route-address">
                {destinationAddress}
              </div>
            ) : (
              <NewDestinationModal
                addressType="destination"
                onAddressSubmit={handleAddressSubmit}
              >
                <div
                  className="route-address"
                  style={{
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <span className="route-placeholder">
                    هنوز مقصد انتخاب نشده است
                  </span>
                </div>
              </NewDestinationModal>
            )}

            <EdirAddressModal
              address={destinationAddress}
              addressType="destination"
              onAddressChange={(newAddress) => {
                setDestinationAddress(newAddress);
              }}
            >
              <button
                type="button"
                className="route-edit"
              >
                <FaPencilAlt />
              </button>
            </EdirAddressModal>
          </div>

        </div>

        <Row className="mb-3">
          <NewDestinationModal
            onAddressSubmit={handleAddressSubmit}
          >
            <Col xs={12}>
              <button type="button" className="btn btn-primary w-100">
                <span className="plus-icon">+</span> افزودن مقصد جدید
              </button>
            </Col>
          </NewDestinationModal>
        </Row>

        <Row className="g-3 mb-3">
          <Col xs={12} md={6}>
            <div className="vehicle-dropdown">
              <label className="vehicle-label">
                نوع وسیله
              </label>

              <VehicleTypeModal
                onVehicleSelect={(vehicle) => {
                  setVehicleType(vehicle);
                }}
              >
                <button
                  type="button"
                  className={`select-vehicle-btn ${vehicleType ? "vehicle-selected-btn" : ""}`}
                  style={{
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {vehicleType || "انتخاب نوع وسیله"}
                </button>
              </VehicleTypeModal>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="custom-floating-input modern-field h-100">
              <select id="stopTime" defaultValue="بدون توقف">
                <option>بدون توقف</option>
                <option>۱۵ دقیقه</option>
                <option>۳۰ دقیقه</option>
              </select>

              <label htmlFor="stopTime">
                توقف (دقیقه)
              </label>
            </div>
          </Col>
        </Row>

        <Row className="g-3 mb-3">
          <Col xs={12} md={6}>
            <div className="custom-floating-input modern-field h-100">
              <input
                id="courierCode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="کد قاصد..."
                autoComplete="off"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />

              <label htmlFor="courierCode">
                کد قاصد
              </label>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="custom-floating-input modern-field h-100">
              <select id="itemValue" defaultValue="زیر ۲۵ میلیون تومان">
                <option>زیر ۲۵ میلیون تومان</option>
                <option>۲۵ تا ۵۰ میلیون تومان</option>
                <option>۵۰ تا ۱۰۰ میلیون تومان</option>
                <option>بیش از ۱۰۰ میلیون تومان</option>
              </select>

              <label htmlFor="itemValue">
                ارزش کالا
              </label>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <div className="custom-textarea-group">
              <textarea id="notes" placeholder="توضیحات..." rows="3"></textarea>
            </div>
          </Col>
        </Row>


        <Row className="mb-3">
          <Col xs={12}>
            <div className="service-dropdown">
              <label className="service-label">
                ویژگی سرویس
              </label>

              <div
                className={`service-box ${serviceOpen ? "active" : ""}`}
                onClick={() => setServiceOpen(!serviceOpen)}
              >

                <div className="selected-tags">

                  {selectedServices.length === 0 ? (

                    <div>
                    </div>

                  ) : (
                    selectedServices.map((item) => (
                      <div
                        className="service-tag"
                        key={item}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item}

                        <button
                          onClick={() =>
                            setSelectedServices(
                              selectedServices.filter(
                                (x) => x !== item
                              )
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <FaChevronDown
                  className={`dropdown-icon ${serviceOpen ? "rotate" : ""
                    }`}
                />
              </div>

              {serviceOpen && (
                <div className="service-menu">
                  {serviceOptions.map((item) => (
                    <div
                      key={item}
                      className={`service-item ${selectedServices.includes(item)
                        ? "selected"
                        : ""
                        }`}
                      onClick={() => toggleService(item)}
                    >
                      <span>{item}</span>
                      {selectedServices.includes(item) && (
                        <span className="check">✓</span>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <label className="segment-label">
              پرداخت کننده
            </label>

            <div className="segment-toggle-box">
              <div
                className={`segment-btn ${sender ? 'active' : ''}`}
                onClick={() => setSender(true)}
              >
                فرستنده
              </div>
              <div
                className={`segment-btn ${!sender ? 'active' : ''}`}
                onClick={() => setSender(false)}
              >
                گیرنده
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <label className="segment-label">
              روش پرداخت
            </label>

            <div className="segment-toggle-box">
              <div
                className={`segment-btn ${cash ? 'active' : ''}`}
                onClick={() => setCash(true)}
              >
                نقدی
              </div>

              {sender && (
                <div
                  className={`segment-btn ${!cash ? 'active' : ''}`}
                  onClick={() => setCash(false)}
                >
                  اعتباری کیف پول
                </div>
              )}
            </div>
          </Col>
        </Row>


        <Row className="mb-3 g-2 align-items-stretch">

          <Col xs={4} md={5}>
            <div className="price-card h-100 d-flex flex-column justify-content-center text-center">
              <span className="price-title">هزینه سرویس</span>

              <span className="price-amount text-success">
                <span style={{ fontSize: "21px" }}>25,000 تومان</span>
              </span>
            </div>
          </Col>

          <Col xs={8} md={7}>
            <div className="modern-discount-bar h-100">
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <FaTag className="discount-icon text-muted" />

                <input
                  type="text"
                  placeholder="کد تخفیف دارید؟"
                  className="discount-input border-0 bg-transparent w-100"
                  style={{
                    fontSize: "16px",
                  }}
                />
              </div>

              <button
                type="button"
                className="apply-code-btn btn btn-success"
              >
                ثبت کد
              </button>
            </div>
          </Col>

        </Row>


        <Row>
          <Col xs={12}>
            <SubmitRequestModal
              onConfirm={(shouldAddToQuickRequest) => {
                handleConfirmSubmit(shouldAddToQuickRequest);
              }}
            >
              <button
                type="button"
                className="btn btn-success w-100 py-2 fw-bold fs-5"
              >
                ثبت درخواست
              </button>
            </SubmitRequestModal>
          </Col>
        </Row>

      </div>
    </Container>
  );
}

export default RequestForm;