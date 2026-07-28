import React from 'react';
import "./Css/Info.css";

function Info() {
  return (
    <div className="info-container">
      <div className="info-card history-card">
        <h3 className="card-title">تاریخچه</h3>
        <div className="card-content">
        </div>
      </div>

      <div className="info-card quick-request-card">
        <h3 className="card-title">درخواست سریع</h3>
        <div className="card-content">
        </div>
      </div>

      <div className="info-card driver-performance-card">
        <h3 className="card-title">عملکرد راننده</h3>
        <div className="card-content">
        </div>
      </div>
    </div>
  );
}

export default Info;