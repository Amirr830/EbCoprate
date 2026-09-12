import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Css/CurrentRequest.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoCallSharp, IoTimeOutline } from 'react-icons/io5';
import { FaMotorcycle } from 'react-icons/fa';
import { useLocation, useNavigationType } from 'react-router-dom';
import strings from "../../../app/String.json"
import PaymentModal from "./Modals/PaymentModal"

const courierIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function CurrentRequest() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const {
    requestStarted: navigationRequestStarted = false,
    originAddress: navigationOriginAddress = "",
    destinationAddress: navigationDestinationAddress = "",
    vehicleType = "",
    selectedServices = [],
    sender = true,
    cash = true,
  } = location.state || {};

  const requestStarted =
    navigationRequestStarted && navigationType === "PUSH";

  const originAddress = requestStarted ? navigationOriginAddress : "";
  const destinationAddress = requestStarted ? navigationDestinationAddress : "";

  const [courierFound, setCourierFound] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const position = [36.3155, 59.5323];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!requestStarted) {
      setCourierFound(false);
      return;
    }

    setCourierFound(false);

    const timer = setTimeout(() => {
      setCourierFound(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [requestStarted]);

  const [remainingMinutes, setRemainingMinutes] = useState(45);

  useEffect(() => {
    if (!requestStarted) {
      setRemainingMinutes(45);
      return;
    }

    setRemainingMinutes(45);

    const timer = setInterval(() => {
      setRemainingMinutes((prev) => {
        if (prev <= 5) {
          clearInterval(timer);
          return 0;
        }

        return prev - 5;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [requestStarted]);

  return (
    <div className="current-request-container dir-rtl">
      <div className="current-request-scroll-content">
        <div className="d-flex flex-column gap-3">
          <div className="request-card shadow-sm p-3 mt-3 rounded-4 bg-white border">

            <div className="current-datetime-card mb-3">
              <div className="row align-items-center g-2">

                <div className="col-12 col-sm-7">
                  <div className="current-date-section">

                    <div className="current-date-icon">
                      <span>📅</span>
                    </div>

                    <div className="current-date-info">

                      <div className="current-date-label">
                        {strings.today}
                      </div>

                      <div className="current-date-value">
                        {(() => {
                          const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }).formatToParts(new Date());

                          const weekday = parts.find(
                            (item) => item.type === 'weekday'
                          )?.value;

                          const day = parts.find(
                            (item) => item.type === 'day'
                          )?.value;

                          const month = parts.find(
                            (item) => item.type === 'month'
                          )?.value;

                          const year = parts.find(
                            (item) => item.type === 'year'
                          )?.value;

                          return `${weekday}، ${day} ${month} ${year}`;
                        })()}
                      </div>

                    </div>

                  </div>
                </div>

                <div className="col-12 col-sm-5">
                  <div className="current-time-section">

                    {/* <div className="current-time-icon">
                      <IoTimeOutline size={21} />
                    </div> */}

                    <div className="current-time-content">

                      <div className="current-time-value">
                        {new Intl.DateTimeFormat('fa-IR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        }).format(currentTime)}
                      </div>

                      <div className="current-time-period">
                        {currentTime.getHours() < 12 ? 'صبح' : 'بعدازظهر'}
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>

            {requestStarted && (
              <div className="courier-info-box my-2 p-2 rounded-3 bg-light">
                {!courierFound ? (
                  <div className="w-100 d-flex align-items-center justify-content-center py-3">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="spinner-border spinner-border-sm text-success"
                        role="status"
                        aria-hidden="true"
                      ></span>

                      <span className="-bold text-muted">
                        {strings.courierSearching}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="courier-avatar rounded-3 border d-flex align-items-center justify-content-center text-muted small-text bg-white">
                      {strings.courierImage}
                    </div>

                    <div className="flex-grow-1 px-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className=" text-dark me-1">
                          {strings.courierName}
                        </span>

                        <span>
                          {strings.motorcycleHonda}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center small-text text-muted">
                        <span>
                          {strings.courierPhone}
                        </span>

                        <span>
                          {strings.courierCode}: 999
                        </span>
                      </div>
                    </div>

                    <div className="d-flex flex-column align-items-center gap-1">
                      <div className="plate-box text-center">
                        <div>{strings.plateFirstNumber}</div>
                        <div>{strings.plateSecondNumber}</div>
                      </div>

                      <a
                        href="tel:09151234578"
                        className="btn btn-success call-btn rounded-circle d-flex align-items-center justify-content-center"
                      >
                        <IoCallSharp
                          size={30}
                        />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="route-address-card py-2 border-top border-bottom my-2">
              <div className="route-address-item">
                <div className="route-address-indicator">
                  <span className="route-dot route-dot-origin"></span>
                  <span className="route-line"></span>
                </div>

                <div className="route-address-content">
                  <span className="route-address-label route-origin-label">
                    {strings.origin}
                  </span>

                  <span className="route-address-value" style={{ fontSize: "15px" }}>
                    {originAddress || strings.requestForm.notSelectedOrigin}
                  </span>
                </div>
              </div>

              <div className="route-address-item">
                <div className="route-address-indicator">
                  <span className="route-dot route-dot-destination"></span>
                </div>

                <div className="route-address-content">
                  <span className="route-address-label route-destination-label">
                    {strings.destination}
                  </span>

                  <span className="route-address-value" style={{ fontSize: "15px" }}>
                    {destinationAddress || strings.requestForm.notSelectedDestination}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between gap-3 my-2">
              <div className="text-end">
                <span
                  className="text-black small-text d-block mb-1"
                  style={{ fontSize: "15px" }}
                >
                  {strings.paymentWith} : {selectedPaymentMethod?.title || strings.notSelected}
                </span>

                <div className="price-tag text-success fs-4">
                  {strings.price} <span className="fs-6" color='green'>{strings.currency}</span>
                </div>
              </div>

              <PaymentModal
                onPaymentSelect={(method) => {
                  setSelectedPaymentMethod(method);
                }}
              >
                <button className="btn btn-success px-4 py-2 rounded-3 shadow-sm text-white">
                  {strings.payment}
                </button>
              </PaymentModal>
            </div>
          </div>

          <div className="request-card shadow-sm p-3 rounded-4 bg-white border">
            <div className="position-relative mb-2">
              <div className="d-flex align-items-center justify-content-between">

                <div className="vehicle-badge bg-success text-white px-3 py-2 rounded-3 d-flex align-items-center gap-2">
                  <FaMotorcycle size={20} />

                  <div className="text-end">
                    <div className="opacity-75" style={{ fontSize: "14px" }}>
                      {strings.vehicle}
                    </div>

                    <div style={{ fontSize: "14px" }}>
                      {vehicleType || strings.vehicleNotSpecified}
                    </div>
                  </div>
                </div>

                {requestStarted && (
                  <div className="flex-grow-1 text-center">
                    {remainingMinutes > 0 ? (
                      <>
                        <span className="status-title  text-danger d-block fs-7">
                          {strings.DriverOnPath}
                        </span>

                        <div className="d-flex align-items-center justify-content-center gap-1 mt-1 text-muted">
                          <IoTimeOutline size={16} />

                          <span className="small-text">
                            {String(remainingMinutes).padStart(2, "0")}:00
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="status-title text-success d-block fs-6">
                          {strings.driverArrivedOrigin}
                        </span>

                        <div className="d-flex align-items-center justify-content-center gap-1 mt-1 text-success">
                          <IoTimeOutline size={16} />

                          <span className="small-text">
                            {strings.driverReadyToReceive}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>
            </div>

            <div className="route-address-card">
              <div className="route-address-item route-origin-item">
                <div className="route-address-indicator">
                  <span className="route-dot route-dot-origin"></span>
                  <span className="route-line"></span>
                </div>

                <div className="route-address-content">

                  <div className="route-address-header">
                    <span className="route-address-label route-origin-label" style={{ fontSize: "15px" }}>
                      {strings.origin}
                    </span>

                  </div>

                  <div className="route-address-value" style={{ fontSize: "15px" }}>
                    {originAddress || strings.requestForm.notSelectedOrigin}
                  </div>

                </div>

              </div>

              <div className="route-address-item route-destination-item">

                <div className="route-address-indicator">
                  <span className="route-dot route-dot-destination"></span>
                </div>

                <div className="route-address-content">

                  <div className="route-address-header" style={{ fontSize: "15px" }}>
                    <span className="route-address-label route-destination-label">
                      {strings.destination}
                    </span>
                  </div>

                  <div className="route-address-value" style={{ fontSize: "15px" }}>
                    {destinationAddress || strings.requestForm.notSelectedDestination}
                  </div>
                </div>
              </div>
            </div>

            {requestStarted && (
              <div className="request-services-payment">

                {selectedServices?.length > 0 && (
                  <div className="request-services-list">
                    {selectedServices.map((service) => (
                      <span
                        key={service}
                        className="request-service-badge"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                )}

                <div className="request-payment">
                  <span className="request-payment-label">
                    {strings.paymentMethod}
                  </span>

                  <span
                    className={`request-payment-value ${
                      cash
                        ? "request-payment-cash"
                        : "request-payment-credit"
                    }`}
                  >
                    {cash ? strings.cash : strings.credit}
                  </span>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentRequest;