import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Css/CurrentRequest.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoCallSharp, IoTimeOutline } from 'react-icons/io5';
import { FaMotorcycle } from 'react-icons/fa';

const courierIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function CurrentRequest() {
  const position = [36.3155, 59.5323];

  return (
    <div className="current-request-container dir-rtl">

      <div className="d-flex flex-column gap-3">
        <div className="request-card shadow-sm p-3 mt-3 rounded-4 bg-white border">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <button type="button" className="btn p-0 text-secondary border-0">
              <BsThreeDotsVertical size={20} />
            </button>
            <div className="d-flex flex-column align-items-center justify-content-center text-center w-100">
              <span className="status-title fw-bold text-danger fs-5 mb-2">
                در حال حرکت به سوی مبدأ
              </span>

              <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 text-muted small-text">
                <IoTimeOutline size={16} />
                <span>رسیدن تا: 12:25</span>

                <span className="mx-1">•</span>

                <span>12:15:30 پنج‌شنبه 25 آبان</span>
              </div>
            </div>
          </div>

          <div className="leaflet-map-wrapper my-2 rounded-3 overflow-hidden border">
            <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '160px', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={courierIcon}>
                <Popup>موقعیت لحظه‌ای قاصد</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="courier-info-box d-flex align-items-center justify-content-between my-2 p-2 rounded-3 bg-light">
            <div className="courier-avatar rounded-3 border d-flex align-items-center justify-content-center text-muted small-text bg-white">
              تصویر قاصد
            </div>

            <div className="flex-grow-1 px-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-dark me-1">محمود زارع</span>
                <span className="badge bg-white text-dark border rounded-pill px-2 py-1 small-text">موتور هوندا</span>
              </div>
              <div className="d-flex justify-content-between align-items-center small-text text-muted">
                <span>0915 123 4578</span>
                <span>کد قاصد: 999</span>
              </div>
            </div>

            <div className="d-flex flex-column align-items-center gap-1">
              <div className="plate-box text-center fw-bold">
                <div>1342</div>
                <div>23523</div>
              </div>
              <a href="tel:09151234578" className="btn btn-success call-btn rounded-circle d-flex align-items-center justify-content-center">
                <IoCallSharp style={{ fontSize: "15px" }} size={18} />
              </a>
            </div>
          </div>

          <div className="addresses-row py-2 border-top border-bottom my-2">

            <div className="address-box">
              <span className="dot dot-danger"></span>

              <span className="fw-bold text-primary me-1">مبدأ : </span>

              <span className="address-text">
                سیدرضی ۵۵، پلاک ۵۸
              </span>
            </div>

            <div className="mx-3 address-arrow">
              ←
            </div>

            <div className="address-box">
              <span className="dot dot-green"></span>

              <span className="fw-bold text-success me-1">مقصد : </span>

              <span className="address-text">
                سیدرضی ۵۵، پلاک ۵۸
              </span>
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
                    موتور (همراه جعبه)
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
                  سیدرضی ۵۵، پلاک ۵۸
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
                  سیدرضی ۵۵، پلاک ۵۸
                </span>
              </div>
            </div>

          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex flex-wrap gap-1">
              <span className="badge bg-warning-subtle text-dark border border-warning rounded-2 px-2 py-1 small-text">
                بار حجیم
              </span>
              <span className="badge bg-warning-subtle text-dark border border-warning rounded-2 px-2 py-1 small-text">
                بازگشت به مبدأ
              </span>
              <span className="badge bg-danger text-white rounded-2 px-2 py-1 small-text">
                اعتباری
              </span>
            </div>

            <div className="text-end">
              <span className="text-danger small-text d-block mb-1">پرداخت اعتباری در مبدأ</span>
              <div className="price-tag text-success fw-bold fs-5">
                25,000 <span className="fs-6 fw-normal text-dark">تومان</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CurrentRequest;