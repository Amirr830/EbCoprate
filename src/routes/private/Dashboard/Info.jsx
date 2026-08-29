import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FiChevronDown, FiEye, FiTrash2 } from "react-icons/fi";
import historyData from "./DataHistoryInfo";
import "./Css/Info.css";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import paths from "../../../app/paths.json";
import strings from "../../../app/String.json"

function Info() {
  const navigate = useNavigate();
  const [quickRequests, setQuickRequests] = useState([]);

  useEffect(() => {
    const loadQuickRequests = () => {
      try {
        const savedRequests = JSON.parse(
          localStorage.getItem("quickRequests") || "[]"
        );

        const validRequests = Array.isArray(savedRequests)
          ? savedRequests
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
              .filter((item) => item.name)
          : [];

        setQuickRequests(validRequests);

        if (
          !Array.isArray(savedRequests) ||
          validRequests.length !== savedRequests.length
        ) {
          localStorage.setItem(
            "quickRequests",
            JSON.stringify(validRequests)
          );
        }
      } catch (error) {
        console.warn(
          strings.info.quickRequestReadFailed,
          error
        );

        setQuickRequests([]);
      }
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

  const handleClearQuickRequests = () => {
    localStorage.removeItem("quickRequests");
    setQuickRequests([]);
    window.dispatchEvent(new Event("quickRequestsUpdated"));
  };

  return (
    <div className="info-container">
      <Row className="g-3">
        <Col xs={12}>
          <div className="info-card history-card">
            <div className="history-header">
              <h5 className="card-title">
                {strings.info.history}
              </h5>
            </div>

            <div className="card-content">
              <div className="table-responsive history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>{strings.info.date}</th>
                      <th>{strings.info.driverCode}</th>
                      <th>{strings.info.amount}</th>
                      <th>{strings.origin}</th>
                      <th>{strings.destination}</th>
                      <th>{strings.info.details}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {historyData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="history-date">
                            <span>{item.date}</span>
                          </div>
                        </td>

                        <td>
                          <span className="driver-code">
                            {item.driverCode}
                          </span>
                        </td>

                        <td>
                          <span className="history-amount">
                            {item.amount} {strings.info.currency}
                          </span>
                        </td>

                        <td>
                          <div className="location-cell origin-location">
                            <span className="location-dot"></span>

                            <span className="location-text">
                              {item.origin}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="location-cell destination-location">
                            <span className="location-dot"></span>

                            <span className="location-text">
                              {item.destination}
                            </span>
                          </div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-warning text-black"
                          >
                            <FiEye
                              style={{
                                marginLeft: "5px",
                              }}
                            />

                            <span>
                              {strings.info.details}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={12}>
          <div className="info-card driver-performance-card">
            <div className="history-header">
              <h5 className="card-title">
                {strings.info.accountReport}
              </h5>
            </div>

            <div className="card-content">
              <div className="table-responsive history-table-wrapper">
                <table className="history-table driver-performance-table">
                  <thead>
                    <tr>
                      <th>{strings.info.performanceType}</th>
                      <th>{strings.info.date}</th>
                      <th>{strings.info.amount}</th>
                      <th>{strings.info.status}</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <div className="performance-table-type">
                          <div className="performance-icon performance-income">
                            <FiArrowDownLeft />
                          </div>

                          <span>
                            {strings.info.payFare}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="performance-table-date">
                          1404/05/18
                        </span>
                      </td>

                      <td>
                        <span className="history-amount performance-income-text">
                          20,000 {strings.info.currency}
                        </span>
                      </td>

                      <td>
                        <span className="performance-status performance-status-income">
                          {strings.info.income}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="performance-table-type">
                          <div className="performance-icon performance-expense">
                            <FiArrowUpRight />
                          </div>

                          <span>
                            {strings.info.settleOrder}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="performance-table-date">
                          1405/05/18
                        </span>
                      </td>

                      <td>
                        <span className="history-amount performance-expense-text">
                          8,500 {strings.info.currency}
                        </span>
                      </td>

                      <td>
                        <span className="performance-status performance-status-expense">
                          {strings.info.expense}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="performance-table-type">
                          <div className="performance-icon performance-income">
                            <FiArrowDownLeft />
                          </div>

                          <span>
                            {strings.info.receiveShippingCost}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="performance-table-date">
                          1403/10/28
                        </span>
                      </td>

                      <td>
                        <span className="history-amount performance-income-text">
                          35,000 {strings.info.currency}
                        </span>
                      </td>

                      <td>
                        <span className="performance-status performance-status-income">
                          {strings.info.income}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={12}>
          <div className="info-card quick-request-card">
            <div className="quick-request-header">
              <div className="quick-request-title-wrapper">
                <h5 className="card-title">
                  {strings.info.quickRequest}
                </h5>
              </div>

              {/* {quickRequests.length > 0 && (
                <button
                  type="button"
                  className="quick-request-clear-btn"
                  onClick={handleClearQuickRequests}
                >
                  <FiTrash2 />
                  <span>{strings.info.deleteAll}</span>
                </button>
              )} */}
            </div>

            <div className="card-content">
              {quickRequests.length === 0 ? (
                <div className="quick-request-empty">
                  <div className="quick-request-empty-text">
                    {strings.info.quickRequestEmpty}
                  </div>
                </div>
              ) : (
                <div className="quick-request-list">
                  {quickRequests.map((request, index) => (
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
                      <div className="quick-request-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="quick-request-content">
                        <div className="quick-request-name">
                          {request.name}
                        </div>
                      </div>

                      <div className="quick-request-arrow">
                        <FiChevronDown />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Info;