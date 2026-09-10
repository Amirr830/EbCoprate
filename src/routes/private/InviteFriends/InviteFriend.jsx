
import React, { useState } from "react";
import "./InviteFriend.css";

function InviteFriends(props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const inviteLink =
      props?.inviteLink || "https://example.com/invite?ref=12345";

    navigator.clipboard.writeText(inviteLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="container-fluid p-0" dir="rtl">
      <div className="row justify-content-center m-0">
        <div className="col-12 p-0">
          <div className="invite-modal-container">

            <div className="row align-items-center justify-content-between mb-3 mx-0 invite-modal-header">
              <div className="col-auto p-0">
                <span className="invite-modal-title">
                  دعوت از دوستان
                </span>
              </div>
            </div>

            <div className="row m-0 invite-card-inner">
              <div className="col-12 d-flex flex-column align-items-center p-0">

                <div className="invite-icon-wrapper mb-3">
                  <svg
                    width="85"
                    height="85"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="greenGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>

                      <filter
                        id="glow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="8"
                          stdDeviation="12"
                          floodColor="#10B981"
                          floodOpacity="0.35"
                        />
                      </filter>
                    </defs>

                    <ellipse
                      cx="50"
                      cy="85"
                      rx="35"
                      ry="8"
                      fill="#000000"
                      fillOpacity="0.15"
                    />

                    <g filter="url(#glow)">
                      <circle
                        cx="52"
                        cy="48"
                        r="36"
                        fill="#047857"
                      />

                      <circle
                        cx="48"
                        cy="44"
                        r="36"
                        fill="url(#greenGrad)"
                        stroke="#34D399"
                        strokeWidth="2"
                      />

                      <circle
                        cx="48"
                        cy="36"
                        r="10"
                        fill="#064E3B"
                      />

                      <path
                        d="M 32 56 C 32 46, 64 46, 64 56"
                        stroke="#064E3B"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                    </g>

                    <g>
                      <circle
                        cx="28"
                        cy="68"
                        r="14"
                        fill="#064E3B"
                      />

                      <circle
                        cx="26"
                        cy="66"
                        r="14"
                        fill="#10B981"
                        stroke="#34D399"
                        strokeWidth="1.5"
                      />

                      <path
                        d="M 26 59 V 73 M 19 66 H 33"
                        stroke="#064E3B"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </div>

                <h3 className="invite-heading text-center w-100">
                  سرویس ارزان‌تر، با دعوت از دوستان
                </h3>

                <p className="invite-description text-center w-100">
                  لینک دعوت را برای دوستان‌تان بفرستید تا در اولین سرویس‌شان،
                  مبلغ{" "}
                  <span className="highlight-text">
                    ۲۰,۰۰۰
                  </span>{" "}
                  الی{" "}
                  <span className="highlight-text">
                    ۳۰,۰۰۰
                  </span>{" "}
                  تومان مهمان ایران‌پیک باشند.
                </p>

                <p className="invite-subdescription text-center w-100">
                  شما هم بعد از پایان اولین سرویس موفق دوستان‌تان، به{" "}
                  <span className="highlight-bold">
                    همان مقدار
                  </span>{" "}
                  در سرویس بعدی‌تان تخفیف می‌گیرید.
                </p>

                <div className="row w-100 justify-content-center m-0">
                  <div className="col-12 col-sm-9 p-0">
                    <button
                      className={`invite-submit-btn w-100 ${
                        copied ? "copied" : ""
                      }`}
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginLeft: "8px" }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>

                          لینک کپی شد!
                        </>
                      ) : (
                        "اشتراک‌گذاری لینک"
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteFriends;
