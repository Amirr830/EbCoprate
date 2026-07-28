import React from "react";
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
import Info from "./Info"

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      className="w-100 h-100 overflow-auto hideScroll p-0 p-md-3"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f5f6fa",
        margin: 0,
        direction: "rtl"
      }}
    >

      <div className="d-none d-md-block">
        <Header />
      </div>

      <div className="row g-3 m-0">
        <div className="col-12 col-md-4 col-lg-4 p-1 p-md-2">
          <RequestForm />
        </div>

        <div className="col-12 col-md-4 col-lg-4 d-none d-md-block">
          <CurrentForm />
        </div>

        <div className="col-12 col-md-4 col-lg-4 d-none d-md-block">
          <Info />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;