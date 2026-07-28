import React, { useState } from 'react';
import './Css/RequestForm.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPencilAlt, FaChevronDown, FaTag, FaMotorcycle, FaPlus } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoWalletOutline } from 'react-icons/io5';

function RequestForm() {
  const [sender, setSender] = useState(true);
  const [cash, setCash] = useState(true);
  const [selectedChips, setSelectedChips] = useState([false, false, false]);

  const toggleChip = (index) => {
    const updated = [...selectedChips];
    updated[index] = !updated[index];
    setSelectedChips(updated);
  };

  return (
    <Container fluid className="modern-request-container h-100 d-flex justify-content-center align-items-center p-0 p-md-2">
      <div className="modern-form-card w-100 bg-white rounded-3 p-3 border shadow-sm">
        
        {/* هدر مخصوص موبایل (در دسکتاپ مخفی می‌شود) */}
        <div className="d-flex d-md-none align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <button 
              type="button" 
              className="btn btn-link text-dark p-0 m-0 border-0"
              onClick={() => {/* اکشن باز شدن منو */}}
            >
              <RxHamburgerMenu size={24} />
            </button>
            <span className="fw-bold fs-5 me-1">ثبت درخواست</span>
          </div>

          {/* نشانگر کیف پول و موجودی */}
          <div 
            className="d-flex align-items-center gap-1 bg-warning px-2 py-1 rounded-2 border border-dark"
            style={{ cursor: "pointer" }}
          >
            <div className="bg-warning text-dark border border-dark rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: 18, height: 18 }}>
              <FaPlus size={8} />
            </div>
            <span className="fw-bold px-1" style={{ fontSize: "12px" }}>۲۵,۰۰۰ تومان</span>
            <IoWalletOutline size={20} className="text-dark" />
          </div>
        </div>

        {/* هدر مخصوص دسکتاپ (در موبایل مخفی می‌شود) */}
        <div className="form-header text-center mb-4 d-none d-md-block">
          <h5 className="fw-bold m-0 text-dark">ثبت درخواست جدید</h5>
          <span className="text-muted small-text">اطلاعات مسیر و کالا را وارد کنید</span>
        </div>

        {/* بخش مبدأ و مقصد */}
        <div className="location-box mb-3">
          <Row className="gy-3">
            <Col xs={12}>
              <div className="modern-location-row">
                <div className="d-flex align-items-center gap-2">
                  <span className="dot-indicator origin-dot"></span>
                  <span className="location-title">مبدأ:</span>
                </div>
                <div className="location-address">سیدرضی ۵۵، پلاک ۵۸</div>
                <button type="button" className="icon-btn" aria-label="ویرایش مبدأ">
                  <FaPencilAlt />
                </button>
              </div>
            </Col>

            <div className="location-divider"></div>

            <Col xs={12}>
              <div className="modern-location-row">
                <div className="d-flex align-items-center gap-2">
                  <span className="dot-indicator dest-dot"></span>
                  <span className="location-title">مقصد:</span>
                </div>
                <div className="location-address">سیدرضی ۵۵، پلاک ۵۸</div>
                <button type="button" className="icon-btn" aria-label="ویرایش مقصد">
                  <FaPencilAlt />
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* دکمه افزودن مقصد */}
        <Row className="mb-3">
          <Col xs={12}>
            <button type="button" className="add-dest-btn w-100">
              <span className="plus-icon">+</span> افزودن مقصد جدید
            </button>
          </Col>
        </Row>

        {/* نوع وسیله نقلیه */}
        <Row className="mb-3">
          <Col xs={12}>
            <div className="vehicle-banner">
              <div className="vehicle-text">
                <span className="label">نوع وسیله</span>
                <h6 className="title m-0">موتور <small className="subtitle">(همراه جعبه)</small></h6>
              </div>
              <div className="vehicle-badge-icon">
                <FaMotorcycle size={28} />
              </div>
            </div>
          </Col>
        </Row>

        {/* اینپوت‌های توقف و قاصد */}
        <Row className="gy-3 mb-3">
          <Col xs={6}>
            <div className="custom-floating-input">
              <input type="text" id="stopTime" defaultValue="بدون توقف" placeholder=" " />
              <label htmlFor="stopTime">توقف (دقیقه)</label>
            </div>
          </Col>
          <Col xs={6}>
            <div className="custom-floating-input">
              <input type="text" id="courierCode" defaultValue="کد راننده" placeholder=" " />
              <label htmlFor="courierCode">قاصد دلخواه</label>
            </div>
          </Col>
        </Row>

        {/* ارزش کالا */}
        <Row className="mb-3">
          <Col xs={12}>
            <div className="custom-floating-input">
              <input type="text" id="itemValue" defaultValue="زیر ۲۵ میلیون تومان" placeholder=" " />
              <label htmlFor="itemValue">ارزش کالا</label>
            </div>
          </Col>
        </Row>

        {/* توضیحات */}
        <Row className="mb-3">
          <Col xs={12}>
            <div className="custom-textarea-group">
              <textarea id="notes" placeholder="توضیحات" rows="3"></textarea>
            </div>
          </Col>
        </Row>

        {/* ویژگی‌های سرویس */}
        <Row className="mb-2">
          <Col xs={12}>
            <div className="modern-accordion">
              <span>ویژگی‌های سرویس</span>
              <FaChevronDown className="accordion-arrow" />
            </div>
          </Col>
        </Row>

        {/* چیپ‌ها */}
        <Row className="gx-2 gy-2 mb-3">
          {['بار سنگین', 'صندوق', 'رفت و برگشت'].map((tag, idx) => (
            <Col xs={4} key={idx}>
              <div
                className={`modern-chip ${selectedChips[idx] ? 'active' : ''}`}
                onClick={() => toggleChip(idx)}
              >
                {tag}
              </div>
            </Col>
          ))}
        </Row>

        {/* فرستنده / گیرنده */}
        <Row className="mb-2">
          <Col xs={12}>
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

        {/* نقدی / اعتباری */}
        <Row className="mb-3">
          <Col xs={12}>
            <div className="segment-toggle-box">
              <div
                className={`segment-btn ${cash ? 'active' : ''}`}
                onClick={() => setCash(true)}
              >
                نقدی
              </div>
              <div
                className={`segment-btn ${!cash ? 'active' : ''}`}
                onClick={() => setCash(false)}
              >
                اعتباری کیف پول
              </div>
            </div>
          </Col>
        </Row>

        {/* هزینه سرویس */}
        <Row className="mb-3 align-items-center">
          <Col xs={12}>
            <div className="price-card text-center">
              <span className="price-title">هزینه سرویس </span>
              <span className="price-amount text-success fw-bold fs-5 me-2">
                ۲۵,۰۰۰ <small className="fs-6">تومان</small>
              </span>
            </div>
          </Col>
        </Row>

        {/* کد تخفیف */}
        <Row className="mb-3">
          <Col xs={12}>
            <div className="modern-discount-bar">
              <div className="d-flex align-items-center gap-2 w-100">
                <FaTag className="discount-icon text-muted" />
                <input type="text" placeholder="کد تخفیف دارید؟" className="discount-input border-0 bg-transparent w-100" />
              </div>
              <button type="button" className="apply-code-btn btn btn-sm btn-light text-success fw-bold px-3">ثبت کد</button>
            </div>
          </Col>
        </Row>

        {/* دکمه ثبت درخواست */}
        <Row>
          <Col xs={12}>
            <button type="button" className="btn btn-success w-100 py-2 fw-bold fs-5">
              ثبت درخواست
            </button>
          </Col>
        </Row>

      </div>
    </Container>
  );
}

export default RequestForm;