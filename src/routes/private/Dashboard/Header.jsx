import React from "react";
import "./Css/Header.css";
import {
    FaWallet,
    FaUserFriends,
    FaHeadset
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import paths from '../../../../src/app/paths.json';
import SupportTrainingModal from "../modals/SupportTrainingModal";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const isWalletPage =
        location.pathname === paths.private.definitions.Wallet;

    return (
        <header className="dashboard-header">
            <div className="container-fluid dashboard-header-container">
                <div className="row dashboard-header-row align-items-center g-0">
                    <div className="col-auto dashboard-header-left">
                        {!isWalletPage && (
                            <button
                                type="button"
                                className="wallet-button"
                                onClick={() =>
                                    navigate(paths.private.definitions.Wallet)
                                }
                            >
                                <span className="wallet-icon-box">
                                    <FaWallet className="wallet-icon" />
                                </span>

                                <span className="wallet-price">
                                    25,000
                                </span>

                                <span className="wallet-currency">
                                    تومان
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="col dashboard-header-center">
                        <div className="dashboard-header-center-inner">
                            <div className="dashboard-header-line"></div>
                        </div>
                    </div>

                    <div className="col-auto dashboard-header-right">
                        <div className="row dashboard-header-actions align-items-center g-2">
                            <div className="col-auto">
                                <button
                                    type="button"
                                    className="header-btn invite-btn"
                                    onClick={() =>
                                        navigate(
                                            "/control-panel/72/definitions/inviteFriend"
                                        )
                                    }
                                >
                                    <span className="header-btn-icon">
                                        <FaUserFriends />
                                    </span>

                                    <span className="header-btn-text">
                                        دعوت از دوستان
                                    </span>
                                </button>
                            </div>

                            <div className="col-auto">
                                <SupportTrainingModal>
                                    <button
                                        type="button"
                                        className="header-btn support-btn"
                                    >
                                        <span className="header-btn-icon">
                                            <FaHeadset />
                                        </span>

                                        <span className="header-btn-text">
                                            پشتیبانی و آموزش
                                        </span>
                                    </button>
                                </SupportTrainingModal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;