import React, { useState, useRef, useEffect } from 'react';
import './Css/RequestForm.css';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { FaPencilAlt, FaChevronDown, FaTag, FaMotorcycle, FaPlus, FaTimes } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoWalletOutline } from 'react-icons/io5';
import SideBar from './SideBar';

function RequestForm() {
  const [sender, setSender] = useState(true);
  const [cash, setCash] = useState(true);
  const [selectedChips, setSelectedChips] = useState([false, false, false]);
  const [showMenu, setShowMenu] = useState(false);
  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);
  const toggleChip = (index) => {
    const updated = [...selectedChips];
    updated[index] = !updated[index];
    setSelectedChips(updated);
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

      <div className="modern-form-card w-100 bg-white rounded-3 p-4 pt-3 mt-1 border shadow-sm">
        <div className="d-flex d-md-none align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-link text-dark p-0 m-0 border-0 hamburger-btn"
              onClick={handleShowMenu}
            >
              <RxHamburgerMenu size={24} />
            </button>
            <span className="fw-bold fs-5 me-1">ثبت درخواست</span>
          </div>

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

        <div className="form-header text-center mb-2 d-none d-md-block">
          <h6 className="fw-bold m-0 text-dark">ثبت درخواست جدید</h6>
          <span className="text-muted small-text">اطلاعات مسیر و کالا را وارد کنید</span>
        </div>

        <div className="route-card mb-3">

          <div className="route-item">
            <div className="route-side">
              <span className="route-dot origin-dot"></span>
              <span className="route-label">مبدأ</span>
            </div>

            <div className="route-address">
              سیدرضی ۵۵، پلاک ۵۸
            </div>

            <button className="route-edit">
              <FaPencilAlt />
            </button>
          </div>

          <div className="route-item">
            <div className="route-side">
              <span className="route-dot dest-dot"></span>
              <span className="route-label">مقصد</span>
            </div>

            <div className="route-address">
              سیدرضی ۵۵، پلاک ۵۸
            </div>

            <button className="route-edit">
              <FaPencilAlt />
            </button>
          </div>

        </div>

        <Row className="mb-3">
          <Col xs={12}>
            <button type="button" className="add-dest-btn w-100">
              <span className="plus-icon">+</span> افزودن مقصد جدید
            </button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <button
              type="button"
              className="vehicle-banner-btn w-100"
              onClick={() => {
              }}
            >
              <div className="vehicle-text">
                <span className="label">نوع وسیله</span>
                <h6 className="title m-0">
                  موتور <small className="subtitle">(همراه جعبه)</small>
                </h6>
              </div>

              <div className="vehicle-badge-icon">
                <FaMotorcycle size={28} />
              </div>
            </button>
          </Col>
        </Row>

        <Row className="gy-3 mb-3">
          <Col xs={6}>
            <div className="custom-floating-input">
              <select id="stopTime" defaultValue="بدون توقف">
                <option value="بدون توقف">بدون توقف</option>
                <option value="15">۱۵ دقیقه</option>
                <option value="30">۳۰ دقیقه</option>
              </select>

              <label htmlFor="stopTime">توقف (دقیقه)</label>
            </div>
          </Col>
          <Col xs={6}>
            <div className="custom-floating-input">
              <input
                type="text"
                id="courierCode"
                className="modern-input"
                placeholder="کد یا نام قاصد را وارد کنید..."
                autoComplete="off"
              />
              <label htmlFor="courierCode">قاصد دلخواه</label>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <div className="custom-floating-input">
              <select id="itemValue" defaultValue="زیر ۲۵ میلیون تومان">
                <option value="زیر ۲۵ میلیون تومان">زیر ۲۵ میلیون تومان</option>
                <option value="۲۵ تا ۵۰ میلیون تومان">۲۵ تا ۵۰ میلیون تومان</option>
                <option value="۵۰ تا ۱۰۰ میلیون تومان">۵۰ تا ۱۰۰ میلیون تومان</option>
                <option value="بیش از ۱۰۰ میلیون تومان">بیش از ۱۰۰ میلیون تومان</option>
              </select>

              <label htmlFor="itemValue">ارزش کالا</label>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <div className="custom-textarea-group">
              <textarea id="notes" placeholder="توضیحات" rows="3"></textarea>
            </div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col xs={12}>
            <div className="modern-accordion">
              <span>ویژگی‌های سرویس</span>
              <FaChevronDown className="accordion-arrow" />
            </div>
          </Col>
        </Row>

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

        <Row className="mb-3 g-2 align-items-stretch">

          <Col xs={12} md={5}>
            <div className="price-card h-100 d-flex flex-column justify-content-center text-center">
              <span className="price-title">هزینه سرویس</span>

              <span className="price-amount text-success fw-bold">
                ۲۵,۰۰۰ <small>تومان</small>
              </span>
            </div>
          </Col>

          <Col xs={12} md={7}>
            <div className="modern-discount-bar h-100">
              <div className="d-flex align-items-center gap-2 flex-grow-1">
                <FaTag className="discount-icon text-muted" />

                <input
                  type="text"
                  placeholder="کد تخفیف دارید؟"
                  className="discount-input border-0 bg-transparent w-100"
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