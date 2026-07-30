import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckAccess } from "../../../app/checkAccess";
import Storages from "../../../app/storages";
import { dateTimeStr, dateStr } from "../../../helper/dateHelper";
import { TbReport, TbActivityHeartbeat } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { LuInfo } from "react-icons/lu";
import { GoAlertFill } from "react-icons/go";
import packageJson from "../../../../package.json";
import paths from "../../../app/paths.json";
import Clock from "../../../components/Clock";
import Header from "./Header";
import RequestForm from "./RequestForm";
import CurrentForm from "./CurrentRequest";
import Info from "./Info";
import SideBar from "./SideBar";
import './Css/Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div
            className="container-fluid p-0"
            style={{
                minHeight: "100vh",
                background: "#f5f6fa",
                direction: "rtl"
            }}
        >
            {isSidebarOpen && (
                <div
                    className="sidebar-backdrop d-md-none"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="row g-0">
                <div
                    className={`col-12 col-md-3 col-lg-3 col-xl-2 p-2 custom-sidebar ${isSidebarOpen ? "open-mobile" : ""
                        }`}
                >
                    <SideBar />
                </div>

                <div className="col-12 col-md-9 col-lg-9 col-xl-10">
                    <div className="w-100 hideScroll" style={{
                        height: "100vh",
                        overflowY: "auto"
                    }}>

                        <div className="d-none d-md-block mb-3">
                            <Header />
                        </div>

                        <div className="row g-3">

                            <div className="col-12 col-lg-4">
                                <RequestForm
                                    toggleSidebar={toggleSidebar}
                                    isSidebarOpen={isSidebarOpen}
                                />
                            </div>

                            <div className="col-12 col-lg-4 d-none d-md-block">
                                <CurrentForm />
                            </div>

                            <div className="col-12 col-lg-4 d-none d-md-block">
                                <Info />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;