
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FiChevronDown, FiEye } from "react-icons/fi";
import historyData from "./DataHistoryInfo";
import "./Css/Info.css";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import paths from "../../../app/paths.json";

function Info() {

  const navigate = useNavigate();

  const [quickRequests, setQuickRequests] = useState([]);

  useEffect(() => {
    const loadQuickRequests = () => {
      const savedRequests = JSON.parse(
        localStorage.getItem("quickRequests") || "[]"
      );

      setQuickRequests(savedRequests);
    };

    loadQuickRequests();

    window.addEventListener(
      "quickRequestsUpdated",
      loadQuickRequests
    );

    window.addEventListener(
      "storage",
      loadQuickRequests
    );

    return () => {
      window.removeEventListener(
        "quickRequestsUpdated",
        loadQuickRequests
      );

      window.removeEventListener(
        "storage",
        loadQuickRequests
      );
    };
  }, []);

  return (
    <div className="info-container">
      <Row className="g-3">
        <Col xs={12}>
          <div className="info-card history-card">
            <div className="history-header">
              <h3 className="card-title">تاریخچه</h3>

              <span className="history-count">
                {historyData.length.toLocaleString("fa-IR")} سفارش
              </span>
            </div>

            <div className="card-content">
              <div className="table-responsive history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>تاریخ و ساعت</th>
                      <th>کد راننده</th>
                      <th>مبلغ</th>
                      <th>مسیر سفارش</th>
                      <th>جزئیات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {historyData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="history-date">
                            <span>{item.date}</span>
                            <small>{item.time}</small>
                          </div>
                        </td>

                        <td>
                          <span className="driver-code">
                            {item.driverCode}
                          </span>
                        </td>

                        <td>
                          <span className="history-amount">
                            {item.amount} تومان
                          </span>
                        </td>

                        <td>
                          <div className="route-info">
                            <div className="route-item">
                              <span className="route-dot origin-dot"></span>
                              <span>{item.origin}</span>
                            </div>

                            <div className="route-line"></div>

                            <div className="route-item">
                              <span className="route-dot destination-dot"></span>
                              <span>{item.destination}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="history-details-btn"
                            disabled
                          >
                            <FiEye />
                            <span>جزئیات</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {historyData.length > 3 && (
                <button
                  type="button"
                  className="history-more-btn"
                  disabled
                >
                  <span>نمایش بیشتر</span>
                  <FiChevronDown />
                </button>
              )}
            </div>
          </div>
        </Col>

        <Col xs={12} lg={6}>
          <div className="info-card quick-request-card">
            <h3 className="card-title">
              درخواست سریع
            </h3>

            <div className="card-content">
              {quickRequests.length === 0 ? (
                <div className="quick-request-empty">
                  هنوز درخواستی به درخواست سریع اضافه نشده است.
                </div>
              ) : (
                <div className="quick-request-list">
                  {quickRequests.map((request) => (
                    <div
                      key={request.id}
                      className="quick-request-item"
                      onClick={() => {
                        navigate(
                          paths.private.definitions.RequestForm,
                          {
                            state: {
                              quickRequest: request,
                            },
                          }
                        );
                      }}
                    >
                      <div className="quick-request-main">
                        <div className="quick-request-route">
                          <span className="quick-request-dot origin-dot"></span>

                          <span>
                            {request.originAddress}
                          </span>
                        </div>

                        <div className="quick-request-route">
                          <span className="quick-request-dot destination-dot"></span>

                          <span>
                            {request.destinationAddress}
                          </span>
                        </div>
                      </div>

                      <div className="quick-request-details">
                        <span>
                          {request.vehicleType}
                        </span>

                        <span>
                          {request.selectedServices?.length || 0} ویژگی
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>


        <Col xs={12} lg={6}>
          <div className="info-card driver-performance-card">
            <h3 className="card-title">عملکرد راننده</h3>
            <div className="card-content">
              <div className="driver-performance-list">
                <div className="performance-item">
                  <div className="performance-icon performance-income">
                    <FiArrowDownLeft />
                  </div>
                  <div className="performance-info">
                    <span className="performance-title">پرداخت کرایه</span>
                    <span className="performance-time">امروز، 14:32</span>
                  </div>
                  <div className="performance-amount income">
                    <span>20,000 تومان</span>
                    <small>ورودی</small>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-icon performance-expense">
                    <FiArrowUpRight />
                  </div>
                  <div className="performance-info">
                    <span className="performance-title">تسویه سفارش</span>
                    <span className="performance-time">امروز، 13:48</span>
                  </div>
                  <div className="performance-amount expense">
                    <span>8,500 تومان</span>
                    <small>خروجی</small>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-icon performance-income">
                    <FiArrowDownLeft />
                  </div>
                  <div className="performance-info">
                    <span className="performance-title">دریافت هزینه ارسال</span>
                    <span className="performance-time">امروز، 12:15</span>
                  </div>
                  <div className="performance-amount income">
                    <span>35,000 تومان</span>
                    <small>ورودی</small>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-icon performance-expense">
                    <FiArrowUpRight />
                  </div>
                  <div className="performance-info">
                    <span className="performance-title">پرداخت هزینه مسیر</span>
                    <span className="performance-time">امروز، 11:40</span>
                  </div>
                  <div className="performance-amount expense">
                    <span>12,000 تومان</span>
                    <small>خروجی</small>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-icon performance-income">
                    <FiArrowDownLeft />
                  </div>
                  <div className="performance-info">
                    <span className="performance-title">دریافت پاداش</span>
                    <span className="performance-time">امروز، 10:20</span>
                  </div>
                  <div className="performance-amount income">
                    <span>50,000 تومان</span>
                    <small>ورودی</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>



      </Row>
    </div>
  );
}

export default Info;
