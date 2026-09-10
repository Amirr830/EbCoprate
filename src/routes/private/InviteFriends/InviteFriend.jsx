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
    <div className="container-fluid p-0 invite-page" dir="rtl">
      <div className="row justify-content-center m-0">
        <div className="col-12 p-0">
          <div className="invite-page-shell">
            <div className="row justify-content-center m-0 invite-content-row">
              <div className="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 col-xxl-7 p-0">
                <div className="invite-main-card">
                  <div className="invite-decoration">
                    <div className="invite-decoration-circle invite-decoration-one"></div>
                    <div className="invite-decoration-circle invite-decoration-two"></div>
                    <div className="invite-decoration-circle invite-decoration-three"></div>
                  </div>

                  <div className="row justify-content-center m-0">
                    <div className="col-auto p-0">
                      <div className="invite-main-icon">
                        <div className="invite-icon-glow"></div>

                        <svg
                          width="100"
                          height="100"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient
                              id="inviteGreenGradient"
                              x1="15"
                              y1="10"
                              x2="85"
                              y2="90"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop offset="0" stopColor="#34D399" />
                              <stop offset="0.5" stopColor="#10B981" />
                              <stop offset="1" stopColor="#047857" />
                            </linearGradient>

                            <filter
                              id="inviteShadow"
                              x="-30%"
                              y="-30%"
                              width="160%"
                              height="160%"
                            >
                              <feDropShadow
                                dx="0"
                                dy="8"
                                stdDeviation="8"
                                floodColor="#047857"
                                floodOpacity="0.28"
                              />
                            </filter>
                          </defs>

                          <ellipse
                            cx="50"
                            cy="88"
                            rx="30"
                            ry="6"
                            fill="#064E3B"
                            fillOpacity="0.12"
                          />

                          <g filter="url(#inviteShadow)">
                            <circle
                              cx="53"
                              cy="48"
                              r="34"
                              fill="#047857"
                            />

                            <circle
                              cx="48"
                              cy="43"
                              r="34"
                              fill="url(#inviteGreenGradient)"
                              stroke="#6EE7B7"
                              strokeWidth="2"
                            />

                            <circle
                              cx="48"
                              cy="36"
                              r="9"
                              fill="#064E3B"
                            />

                            <path
                              d="M33 55C33 47 63 47 63 55"
                              stroke="#064E3B"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                            />
                          </g>

                          <g>
                            <circle
                              cx="27"
                              cy="69"
                              r="13"
                              fill="#064E3B"
                            />

                            <circle
                              cx="25"
                              cy="67"
                              r="13"
                              fill="#10B981"
                              stroke="#6EE7B7"
                              strokeWidth="1.5"
                            />

                            <path
                              d="M25 60V74"
                              stroke="#064E3B"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />

                            <path
                              d="M18 67H32"
                              stroke="#064E3B"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center m-0">
                    <div className="col-12 p-0">
                      <h1 className="invite-main-title">
                        دوستانت را دعوت کن،
                        <span> با هم بیشتر صرفه‌جویی کنید!</span>
                      </h1>

                      <p className="invite-main-description">
                        لینک دعوت خودت را برای دوستانت بفرست.
                        آن‌ها در اولین سرویس خود از
                        <span className="invite-price">
                          ۲۰,۰۰۰ تا ۳۰,۰۰۰ تومان
                        </span>
                        مهمان ایران‌پیک هستند.
                      </p>

                      <p className="invite-secondary-description">
                        بعد از اولین سرویس موفق دوستت،
                        تو هم به همان مقدار برای سرویس بعدی
                        <span>تخفیف می‌گیری.</span>
                      </p>
                    </div>
                  </div>

                  <div className="row g-3 justify-content-center invite-benefits-row">
                    <div className="col-12 col-sm-6">
                      <div className="invite-benefit-card">
                        <div className="invite-benefit-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 12V22H4V12"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 7H22V12H2V7Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 22V7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <path
                              d="M12 7H7.5C6.11929 7 5 5.88071 5 4.5C5 3.11929 6.11929 2 7.5 2C10 2 12 7 12 7Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 7H16.5C17.8807 7 19 5.88071 19 4.5C19 3.11929 17.8807 2 16.5 2C14 2 12 7 12 7Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="invite-benefit-text">
                          <span>دوستت</span>
                          <small>تا ۳۰,۰۰۰ تومان تخفیف می‌گیرد</small>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <div className="invite-benefit-card">
                        <div className="invite-benefit-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 12V7H4V12"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 7L12 2L20 7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 12V21H20V12"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 21V15H16V21"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="invite-benefit-text">
                          <span>خودت</span>
                          <small>در سرویس بعدی تخفیف می‌گیری</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center m-0">
                    <div className="col-12 col-sm-10 col-md-9 col-lg-8 p-0">
                      <button
                        type="button"
                        className={`invite-share-button ${
                          copied ? "copied" : ""
                        }`}
                        onClick={handleCopyLink}
                      >
                        {copied ? (
                          <>
                            <span className="invite-button-icon">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>

                            لینک دعوت کپی شد!
                          </>
                        ) : (
                          <>
                            <span className="invite-button-icon">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12 16V4"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M7 9L12 4L17 9"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M5 20H19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>

                            اشتراک‌گذاری لینک دعوت
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="invite-bottom-note">
                    <span className="invite-note-dot"></span>
                    دعوت کن، تخفیف بگیر، دوباره سفر کن!
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