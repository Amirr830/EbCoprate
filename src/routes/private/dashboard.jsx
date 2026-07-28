import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckAccess } from "../../app/checkAccess";
import Storages from "../../app/storages";
import { dateTimeStr, dateStr } from "../../helper/dateHelper";
import { TbReport } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { TbActivityHeartbeat } from "react-icons/tb";
import { LuInfo } from "react-icons/lu";
import { GoAlertFill } from "react-icons/go";
import packageJson from './../../../package.json'
import paths from '../../app/paths.json'
import Clock from "../../components/Clock";
function Dashboard(props) {
  const navigate = useNavigate();

  return (
    <div className=" h-100 overflow-auto hideScroll">
      <div className="row g-2 p-0 m-0">


        <div className="col-12  ">
          <div className="card"  >
            <div className="row g-2 p-3"
            >
              <div className="col-12  col-md-3 col-lg-2  d-flex d-none d-md-block  justify-content-center" >
                <Clock />
              </div>
              <div className="col-12 col-md-9 col-lg-10 position-relative px-2">

                <h4 className="text-dark iranSansBold" >
                  امروز {dateStr(new Date())}
                </h4>

                <p className="text-dark  p-0 m-0 iranSansBold opacity-75 " >
                  کاربر : {Storages?.getUserInfo()?.firstName} {Storages?.getUserInfo()?.lastName}
                </p>
                <p className="text-dark p-0 m-0 iranSansBold opacity-50 " >
                  نسخه : {packageJson.version}
                </p>
                <div className="card p-2 bottom-0 end-0 start-0 mt-3"
                  style={{ background: '#F8BBD0' }} >
                  <div className="d-flex  ">
                    <GoAlertFill className="text-danger mx-2" size={20} />
                    <span className="text-dark">
                      <strong> اخرین ورود شما {dateTimeStr(Storages?.getUserInfo()?.lastLoggin)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row col-12 g-2">
          {CheckAccess(41) ?
            <div className="col-12 col-md-6 col-lg-3" onClick={(e) => {
              navigate(paths.private.actions.dashboard)
            }}>
              <button className="btn btn-primary w-100 py-3">
                <div className="card-body row d-flex align-items-center">
                  <TbActivityHeartbeat size={45} className="w-auto" />
                  <h4 className="col iranSansBold">عملیات</h4>
                </div>
              </button>
            </div>
            : <></>}
          <div className="row col-12 col-lg-9 g-2 m-0">
            {CheckAccess(47) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.actions.tripsMonit)
              }}>
                <button className="btn btn-outline-primary w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <TbActivityHeartbeat size={45} className="w-auto" />
                    <h4 className="col iranSansBold">پایش سفرها</h4>
                  </div>
                </button>
              </div>
              : <></>}
            {CheckAccess(40) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.actions.reserve)
              }}>
                <button className="btn btn-outline-primary w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <TbActivityHeartbeat size={45} className="w-auto" />
                    <h4 className="col iranSansBold">رزرو</h4>
                  </div>
                </button>
              </div>
              : CheckAccess(43) ?
                <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                  navigate(paths.private.actions.entrance)
                }}>
                  <button className="btn btn-outline-primary w-100 py-3">
                    <div className="card-body row d-flex align-items-center">
                      <TbActivityHeartbeat size={45} className="w-auto" />
                      <h4 className="col iranSansBold">مبادی ورودی</h4>
                    </div>
                  </button>
                </div>
                : <></>}
            {CheckAccess(42) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.actions.news)
              }}>
                <button className="btn btn-outline-primary w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <TbActivityHeartbeat size={45} className="w-auto" />
                    <h4 className="col iranSansBold">تابلو اعلانات</h4>
                  </div>
                </button>
              </div>
              : <></>}


          </div>
        </div>

        <div className="row col-12 g-2">
          {CheckAccess(10) ?
            <div className="col-12 col-md-6 col-lg-3" onClick={(e) => {
              navigate(paths.private.reports.dashboard)
            }}>
              <button className="btn btn-success w-100 py-3">
                <div className="card-body row d-flex align-items-center">
                  <TbReport size={45} className="w-auto" />
                  <h4 className="col iranSansBold">گزارشات</h4>
                </div>
              </button>
            </div>
            : <></>}

          <div className="row col-12 col-lg-9 g-2 m-0">
            {CheckAccess(12) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.reports.driverLocation)
              }}>
                <button className="btn  btn-outline-success w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <TbReport size={45} className="w-auto" />
                    <h4 className="col iranSansBold">نقشه</h4>
                  </div>
                </button>
              </div>
              : <></>}
            {CheckAccess(15) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.reports.tripHistory)
              }}>
                <button className="btn  btn-outline-success w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <TbReport size={45} className="w-auto" />
                    <h4 className="col iranSansBold">گزارش سفرها</h4>
                  </div>
                </button>
              </div>
              : <></>}
          </div>
        </div>

        <div className="row col-12 g-2">

          {CheckAccess(50) ?
            <div className="col-12 col-md-6 col-lg-3" onClick={(e) => {
              navigate(paths.private.settings.dashboard)
            }}>
              <button className="btn btn-dark w-100 py-3">
                <div className="card-body row d-flex align-items-center">
                  <VscSettings size={45} className="w-auto" />
                  <h4 className="col iranSansBold">تنظیمات</h4>
                </div>
              </button>
            </div>
            : <></>}
          <div className="row col-12 col-lg-9 g-2 m-0">
            {CheckAccess(56) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.settings.tariff)
              }}>
                <button className="btn btn-outline-dark w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <VscSettings size={45} className="w-auto" />
                    <h4 className="col iranSansBold">نرخ نامه</h4>
                  </div>
                </button>
              </div>
              : <></>}
            {CheckAccess(51) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.settings.driver)
              }}>
                <button className="btn btn-outline-dark w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <VscSettings size={45} className="w-auto" />
                    <h4 className="col iranSansBold">تنظیمات راننده</h4>
                  </div>
                </button>
              </div>
              : <></>}
          </div>


        </div>

        <div className="row col-12 g-2">
          {CheckAccess(30) ?
            <div className="col-12 col-md-6 col-lg-3" onClick={(e) => {
              navigate(paths.private.definitions.dashboard)
            }}>
              <button className="btn btn-danger w-100 py-3">
                <div className="card-body row d-flex align-items-center">
                  <LuInfo size={45} className="w-auto" />
                  <h4 className="col iranSansBold">تعاریف</h4>
                </div>
              </button>
            </div>
            : <></>}
          <div className="row col-12 col-lg-9 g-2 m-0">

            {CheckAccess(34) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.definitions.persons)
              }}>
                <button className="btn btn-outline-danger w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <LuInfo size={45} className="w-auto" />
                    <h4 className="col iranSansBold">رانندگان</h4>
                  </div>
                </button>
              </div>
              : <></>}
            {CheckAccess(33) ?
              <div className="col-12 col-md-6 col-lg-4" onClick={(e) => {
                navigate(paths.private.definitions.cars)
              }}>
                <button className="btn btn-outline-danger w-100 py-3">
                  <div className="card-body row d-flex align-items-center">
                    <LuInfo size={45} className="w-auto" />
                    <h4 className="col iranSansBold">خودرو ها</h4>
                  </div>
                </button>
              </div>
              : <></>}

          </div>

        </div>


      </div>
    </div >
  );
}

export default Dashboard;
