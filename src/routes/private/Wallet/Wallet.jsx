
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wallet.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Offcanvas,
} from "react-bootstrap";
import {
  FaWallet,
  FaArrowUp,
  FaCreditCard,
  FaHistory,
  FaPlus,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import strings from "../../../app/String.json";
import paths from "../../../app/paths.json";
import SideBar from "../Dashboard/SideBar";

function Wallet() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatAmount = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");
    if (!onlyNumbers) {
      return "";
    }
    return Number(onlyNumbers).toLocaleString("en-US");
  };

  const handleAmountChange = (e) => {
    setAmount(formatAmount(e.target.value));
  };

  const handleSuggestedAmount = (value) => {
    setAmount(formatAmount(String(value)));
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  const handleWalletClick = () => {
    navigate("/control-panel/67/definitions/wallet");
  };

  const numericAmount = amount.replace(/,/g, "");

  return (
    <div className="wallet-page-wrapper">
      <div
        className="wallet-mobile-header d-md-none"
        style={{ marginTop: "5px" }}
      >
        <div className="wallet-mobile-header-inner">
          <div className="wallet-mobile-page-title">
          </div>
        </div>
      </div>

      <div style={{ marginTop: "5px" }}></div>

      <Offcanvas
        show={showMenu}
        onHide={handleCloseMenu}
        placement="end"
        dir="rtl"
        className="custom-mobile-menu p-0"
      >
        <Offcanvas.Header className="d-flex justify-content-end align-items-center border-bottom pb-2 pt-3 px-3">
          <button
            type="button"
            className="btn p-0 border-0 text-muted"
            onClick={handleCloseMenu}
          >
            <FaTimes size={20} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 overflow-hidden">
          <SideBar />
        </Offcanvas.Body>
      </Offcanvas>

      <Container fluid className="wallet-container">
        <Row className="wallet-main-row g-4">
          <Col xs={12} xl={6}>
            <div className="wallet-main-card">
              <div className="wallet-balance-box">
                <div className="wallet-balance-top">
                  <div className="wallet-balance-label">
                    <span className="wallet-small-icon">
                      <FaWallet />
                    </span>
                    <span>{strings.wallet.balance}</span>
                  </div>
                  <div className="wallet-status">
                    <FaCheckCircle />
                    <span>فعال</span>
                  </div>
                </div>
                <div className="wallet-balance-content">
                  <div className="wallet-balance-number">
                    {strings.wallet.zeroBalance}
                  </div>
                </div>
                <div className="wallet-balance-bottom">
                  <span>موجودی قابل استفاده</span>
                  <FaArrowUp />
                </div>
              </div>

              <div className="wallet-deposit-section">
                <div className="wallet-section-heading">
                  <div className="wallet-section-icon">
                    <FaPlus />
                  </div>
                  <div>
                    <h5>{strings.wallet.increaseBalance}</h5>
                    <p>{strings.wallet.increaseBalanceDescription}</p>
                  </div>
                </div>

                <div className="wallet-suggested-section">
                  <div className="wallet-field-title">
                    {strings.wallet.suggestedAmounts}
                  </div>
                  <div className="wallet-suggested-grid">
                    <button
                      type="button"
                      className="wallet-suggested-btn"
                      onClick={() => handleSuggestedAmount(1000000)}
                    >
                      <span className="suggested-amount">1,000,000</span>
                      <span className="suggested-label">
                        {strings.wallet.oneMillionRial}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="wallet-suggested-btn"
                      onClick={() => handleSuggestedAmount(5000000)}
                    >
                      <span className="suggested-amount">5,000,000</span>
                      <span className="suggested-label">
                        {strings.wallet.fiveMillionRial}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="wallet-suggested-btn"
                      onClick={() => handleSuggestedAmount(10000000)}
                    >
                      <span className="suggested-amount">10,000,000</span>
                      <span className="suggested-label">
                        {strings.wallet.tenMillionRial}
                      </span>
                    </button>
                  </div>
                </div>

                <Form.Group className="wallet-amount-group">
                  <Form.Label className="wallet-field-title">
                    {strings.wallet.customAmount}
                  </Form.Label>
                  <div
                    className={`wallet-input-wrapper ${
                      amountFocused ? "wallet-input-focused" : ""
                    }`}
                  >
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder={strings.wallet.customAmountPlaceholder}
                      className="wallet-amount-input"
                      onFocus={() => setAmountFocused(true)}
                      onBlur={() => setAmountFocused(false)}
                    />
                    {amount && (
                      <span className="wallet-input-unit">
                        {strings.wallet.rial}
                      </span>
                    )}
                  </div>
                </Form.Group>

                <Button
                  type="button"
                  className="wallet-payment-btn"
                  disabled={!numericAmount}
                >
                  <span className="wallet-payment-icon">
                    <FaCreditCard />
                  </span>
                  <span>{strings.wallet.onlinePayment}</span>
                  <span className="wallet-payment-arrow">←</span>
                </Button>
              </div>
            </div>
          </Col>

          <Col xs={12} xl={6}>
            <div className="wallet-history-card">
              <div className="wallet-history-header">
                <div className="wallet-history-title-wrapper">
                  <div className="wallet-history-icon">
                    <FaHistory />
                  </div>
                  <div>
                    <h5>{strings.wallet.financialHistory}</h5>
                    <p style={{fontSize:"15px"}}>سوابق و تراکنش‌های کیف پول</p>
                  </div>
                </div>
                <div className="wallet-history-count">۰ تراکنش</div>
              </div>

              <div className="wallet-history-divider"></div>

              <div className="wallet-empty-state">
                <div className="wallet-empty-icon">
                  <FaHistory />
                </div>
                <h3>{strings.wallet.noTransactions}</h3>
                <h6>{strings.wallet.noTransactionsDescription}</h6>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Wallet;
