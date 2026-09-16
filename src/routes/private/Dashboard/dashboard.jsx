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
import "./Css/Dashboard.css";
import Map from "./Map";

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="container-fluid p-0 dashboard-page">
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop d-md-none"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="dashboard-layout desktop-top-space">
        <main className="dashboard-main hideScroll">
          <div className="dashboard-content">
            <div className="dashboard-inner container-fluid">
              <div className="row g-2 dashboard-panels">
                <div className="col-12 col-md-5 col-lg-4 dashboard-col">
                  <div className="dashboard-card dashboard-card-request">
                    <RequestForm
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </div>
                </div>

<div className="col-12 col-md-3 col-lg-3 dashboard-col">
  <div className="dashboard-card dashboard-card-current">
    <CurrentForm />
  </div>
</div>

                <div className="col-12 col-md-4 col-lg-5 dashboard-col">
                  <div className="dashboard-card dashboard-card-map">
                    <Map />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;