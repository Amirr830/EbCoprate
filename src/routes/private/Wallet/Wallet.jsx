import React, { useState } from "react";
import "./Wallet.css";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";
import strings from "../../../app/String.json";

function Wallet() {
  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);

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

  const numericAmount = amount.replace(/,/g, "");

  return (
    <div className="wallet-page-wrapper">
      <Container fluid className="px-3">
        <Row className="mb-2 mb-lg-3 align-items-center">
          <Col
            xs={12}
            className="d-flex justify-content-between align-items-center text-muted small"
          >
          </Col>
        </Row>

        <Row className="g-3 align-items-stretch">
          <Col xs={12} lg={3} className="d-none d-lg-block"></Col>

          <Col xs={12} lg={4}>
            <div className="wallet-card h-100 p-3 p-xl-4 d-flex flex-column justify-content-between">
              <Row className="align-items-center mb-3">
                <Col xs={5} className="text-center">
                  <div className="wallet-illustration mx-auto d-flex align-items-center justify-content-center">
                    <FaWallet size={32} className="text-success" />
                  </div>
                </Col>

                <Col xs={7} className="text-end">
                  <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-success bg-opacity-10 text-success dir-rtl">
                    <FaWallet />

                    <span>
                      {strings.wallet.balance}:{" "}
                      {strings.wallet.zeroBalance}
                    </span>
                  </div>
                </Col>
              </Row>

              <div className="text-end mb-3">
                <h6 className="mb-1 text-dark">
                  {strings.wallet.increaseBalance}
                </h6>

                <p className="text-muted small mb-0">
                  {strings.wallet.increaseBalanceDescription}
                </p>
              </div>

              <div className="mb-3">
                <div className="text-end text-muted small mb-2">
                  {strings.wallet.suggestedAmounts}
                </div>

                <Row className="g-2">
                  <Col xs={4}>
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="w-100 rounded-pill py-1 text-nowrap"
                      onClick={() => handleSuggestedAmount(1000000)}
                    >
                      {strings.wallet.oneMillionRial}
                    </Button>
                  </Col>

                  <Col xs={4}>
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="w-100 rounded-pill py-1 text-nowrap"
                      onClick={() => handleSuggestedAmount(5000000)}
                    >
                      {strings.wallet.fiveMillionRial}
                    </Button>
                  </Col>

                  <Col xs={4}>
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="w-100 rounded-pill py-1 text-nowrap"
                      onClick={() => handleSuggestedAmount(10000000)}
                    >
                      {strings.wallet.tenMillionRial}
                    </Button>
                  </Col>
                </Row>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="custom-amount-label">
                  {strings.wallet.customAmount}
                </Form.Label>

                <Form.Control
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={strings.wallet.customAmountPlaceholder}
                  className="custom-amount-input shadow-none"
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#22c55e";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(34, 197, 94, 0.22)";
                  }}
                  onMouseLeave={(e) => {
                    if (!amountFocused) {
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  style={{
                    borderColor: amountFocused
                      ? "#22c55e"
                      : "#cbd5e1",
                    boxShadow: amountFocused
                      ? "0 0 0 3px rgba(34, 197, 94, 0.22)"
                      : "none",
                    outline: "none",
                  }}
                />

                {amount && (
                  <div className="amount-unit">
                    {strings.wallet.rial}
                  </div>
                )}
              </Form.Group>

              <Button
                type="button"
                className="w-100 py-2 rounded-3 border-0 bg-emerald"
                disabled={!numericAmount}
              >
                {strings.wallet.onlinePayment}
              </Button>
            </div>
          </Col>

          <Col xs={12} lg={4}>
            <div className="wallet-card h-100 d-flex flex-column justify-content-between p-3 p-xl-4">
              <div className="d-flex justify-content-end text-muted small">
                {strings.wallet.financialHistory}
              </div>

              <div className="text-center text-muted my-auto py-4">
                <FaWallet
                  size={40}
                  className="mb-3 opacity-25"
                />

                <h6 className="mb-1 text-secondary">
                  {strings.wallet.noTransactions}
                </h6>

                <small className="text-muted">
                  {strings.wallet.noTransactionsDescription}
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Wallet;