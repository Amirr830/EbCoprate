import React from "react";
import "./Wallet.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaWallet,
  FaCreditCard,
  FaHistory,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

function Wallet() {
  return (
    <div className="wallet">
      <Container fluid>
        <Row className="g-4">

          <Col xs={12} lg={7}>
            <div className="wallet-card transaction-card">

              <div className="card-title">
                <FaHistory />
                <span>تاریخچه تراکنش ها</span>
              </div>

              <div className="empty-history">
                <FaWallet className="empty-icon" />
                <h5>هنوز تراکنشی ثبت نشده است</h5>
                <p>پس از اولین شارژ یا پرداخت، اطلاعات اینجا نمایش داده می‌شود.</p>
              </div>

            </div>
          </Col>

          <Col xs={12} lg={5}>
            <div className="wallet-card">

              <div className="wallet-balance">

                <div className="wallet-icon">
                  <FaWallet />
                </div>

                <div>
                  <small>موجودی کیف پول</small>
                  <h2>۰ تومان</h2>
                </div>

              </div>

              <div className="charge-box">
                <label>مبلغ شارژ</label>
                <div className="amount-buttons">
                  <button>50,000</button>
                  <button>100,000</button>
                  <button>200,000</button>
                </div>

                <input
                  type="text"
                  placeholder="مبلغ دلخواه"
                />

                <button className="pay-btn">
                  <FaCreditCard />
                  پرداخت آنلاین
                </button>

              </div>

              <div className="wallet-info">
                <div>
                  <FaArrowDown className="text-success" />
                  <span>واریز امروز</span>
                  <strong>۰ تومان</strong>
                </div>

                <div>
                  <FaArrowUp className="text-danger" />
                  <span>برداشت امروز</span>
                  <strong>۰ تومان</strong>
                </div>

              </div>


            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
}

export default Wallet;