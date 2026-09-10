import React from "react";
import "./Css/Header.css";
import {
    FaUserCircle,
    FaWallet,
    FaUserFriends,
    FaHeadset,
    FaPlus,
    FaArrowLeft,
} from "react-icons/fa";
import { TiHome, TiPower } from "react-icons/ti";
import { useNavigate, useLocation } from "react-router-dom";
import paths from '../../../../src/app/paths.json';
import Storages from "../../../app/storages"
import dictionary from "../../../../src/app/dictionary.json"
import answerModal from "../../../modals/answerModal";
import Wallet from "../Wallet/Wallet"
import SupportTrainingModal from "../modals/SupportTrainingModal"
import InviteFriendsModal from "../modals/InviteFriendsModal"

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const showBack =
        location.pathname !== paths.private.dashboard;

    const isWalletPage =
        location.pathname === paths.private.definitions.Wallet;

    return (
        <header className="dashboard-header">
            <div className="container-fluid px-3">
                <div className="row align-items-center g-2 flex-nowrap">

                    <div className="col-auto">
                        <div className="d-flex align-items-center gap-3">


                            {!isWalletPage && (
                                <button
                                    className="wallet-button"
                                    onClick={() => navigate(paths.private.definitions.Wallet)}
                                >
                                    {/* <FaWallet className="wallet-icon" /> */}
                                    <span className="wallet-price">
                                        25,000
                                    </span>

                                    <span className="wallet-currency">
                                        تومان
                                    </span>
                                </button>
                            )}


                        </div>
                    </div>

                    <div className="col-lg d-none d-lg-flex justify-content-center">
                        <div
                            className="text-secondary small text-truncate"
                            dir="ltr"
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                maxWidth: "100%",
                            }}
                        >
                        </div>
                    </div>

                    <div className="col-auto ms-auto">
                        <div className="d-flex align-items-center gap-2">

                            <button
                                type="button"
                                className="header-btn invite-btn"
                                onClick={() =>
                                    navigate(
                                        "/control-panel/72/definitions/inviteFriend"
                                    )
                                }
                            >
                                <FaUserFriends />
                                <span>
                                    دعوت از دوستان
                                </span>
                            </button>

                            <SupportTrainingModal>
                                <button className="header-btn support-btn">
                                    <FaHeadset />
                                    <span>پشتیبانی و آموزش</span>
                                </button>
                            </SupportTrainingModal>

                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;