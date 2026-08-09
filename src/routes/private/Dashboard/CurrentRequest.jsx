import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Css/CurrentRequest.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoCallSharp, IoTimeOutline } from 'react-icons/io5';
import { FaMotorcycle } from 'react-icons/fa';
import { useLocation, useNavigationType } from 'react-router-dom';

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
  originAddress = "",
  destinationAddress = "",
  vehicleType = "",
  selectedServices = [],
  sender = true,
  cash = true,
} = location.state || {};

const requestStarted =
  navigationRequestStarted && navigationType === "PUSH";

const [courierFound, setCourierFound] = useState(false);

const position = [36.3155, 59.5323];

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

  return (
    <div className="current-request-container dir-rtl">

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
                      امروز
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

                  <div className="current-time-icon">
                    <IoTimeOutline size={21} />
                  </div>

                  <div className="current-time-content">

                    <div className="current-time-value">
                      {new Intl.DateTimeFormat('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      }).format(new Date())}
                    </div>

                    <div className="current-time-period">
                      {new Date().getHours() < 12 ? 'صبح' : 'بعدازظهر'}
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

          <span className="fw-bold text-muted">
            در حال جستجو...
          </span>
        </div>
      </div>
    ) : (
      <div className="d-flex align-items-center justify-content-between">
        <div className="courier-avatar rounded-3 border d-flex align-items-center justify-content-center text-muted small-text bg-white">
          تصویر قاصد
        </div>

        <div className="flex-grow-1 px-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold text-dark me-1">
              محمود زارع
            </span>

            <span className="badge bg-white text-dark border rounded-pill px-2 py-1 small-text">
              موتور هوندا
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center small-text text-muted">
            <span>
              09151231231
            </span>

            <span>
              کد قاصد: 999
            </span>
          </div>
        </div>

        <div className="d-flex flex-column align-items-center gap-1">
          <div className="plate-box text-center fw-bold">
            <div>1342</div>
            <div>23523</div>
          </div>

          <a
            href="tel:09151234578"
            className="btn btn-success call-btn rounded-circle d-flex align-items-center justify-content-center"
          >
            <IoCallSharp
              style={{ fontSize: "15px" }}
              size={18}
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
                  مبدأ
                </span>

                <span className="route-address-value">
                  {originAddress || "مبدأ ثبت نشده است"}
                </span>
              </div>
            </div>

            <div className="route-address-item">
              <div className="route-address-indicator">
                <span className="route-dot route-dot-destination"></span>
              </div>

              <div className="route-address-content">
                <span className="route-address-label route-destination-label">
                  مقصد
                </span>

                <span className="route-address-value">
                  {destinationAddress || "مقصد ثبت نشده است"}
                </span>
              </div>
            </div>
          </div>






          <div className="d-flex align-items-center justify-content-between gap-3 my-2">
            <div className="text-end">
              <span className="text-danger small-text d-block mb-1">
                پرداخت اعتباری در مبدأ
              </span>

              <div className="price-tag text-success fw-bold fs-4">
                25,000 <span className="fs-6 fw-normal text-dark">تومان</span>
              </div>
            </div>

            <button className="btn btn-success px-4 py-2 rounded-3 shadow-sm text-white">
              پرداخت از کیف پول
            </button>
          </div>
        </div>

        <div className="request-card shadow-sm p-3 rounded-4 bg-white border">
          <div className="position-relative mb-2">

            <button
              type="button"
              className="btn p-0 text-secondary border-0 position-absolute top-0 start-0"
            >
              <BsThreeDotsVertical size={20} />
            </button>

            <div className="d-flex align-items-center justify-content-between">

              <div className="vehicle-badge bg-success text-white px-3 py-2 rounded-3 d-flex align-items-center gap-2">
                <FaMotorcycle size={20} />

                <div className="text-end">
                  <div className="opacity-75" style={{ fontSize: "11px" }}>
                    نوع وسیله
                  </div>

                  <div className="fw-bold" style={{ fontSize: "12px" }}>
                    {vehicleType || "نوع وسیله مشخص نشده"}
                  </div>
                </div>
              </div>

              <div className="flex-grow-1 text-center">

                <span className="status-title fw-bold text-danger d-block fs-6">
                  در حال یافتن نزدیک‌ترین قاصد
                </span>

                <div className="d-flex align-items-center justify-content-center gap-1 mt-1 text-muted">
                  <span className="text-danger fw-semibold small-text">
                    در حال جستجو
                  </span>

                  <IoTimeOutline size={16} />

                  <span className="small-text">
                    12:53:30 پنج‌شنبه 25 آبان
                  </span>
                </div>

              </div>

            </div>

          </div>

          <div className="addresses-list-row my-2">

            <div className="address-item">
              <span className="dot dot-danger"></span>

              <div className="address-content">
                <span className="address-label text-danger">
                  مبدأ
                </span>

                <span className="address-value">
                  {originAddress || "مبدأ ثبت نشده است"}
                </span>
              </div>
            </div>

            <div className="address-divider"></div>

            <div className="address-item">
              <span className="dot dot-green"></span>

              <div className="address-content">
                <span className="address-label text-success">
                  مقصد
                </span>

                <span className="address-value">
                  {destinationAddress || "مقصد ثبت نشده است"}
                </span>
              </div>
            </div>

          </div>

          <div className="d-flex flex-wrap gap-1">
            {selectedServices.map((service) => (
              <span
                key={service}
                className="badge bg-warning-subtle text-dark border border-warning rounded-2 px-2 py-1 small-text"
              >
                {service}
              </span>
            ))}

            {!cash && sender && (
              <span className="badge bg-danger text-white rounded-2 px-2 py-1 small-text">
                اعتباری
              </span>
            )}

            {cash && (
              <span className="badge bg-success text-white rounded-2 px-2 py-1 small-text">
                نقدی
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CurrentRequest;