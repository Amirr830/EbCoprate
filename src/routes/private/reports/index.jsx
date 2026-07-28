import React from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { Route, Routes, useNavigate } from "react-router-dom";
import { CheckAccess } from "../../../app/checkAccess";
import { FaTimeline } from "react-icons/fa6";

import paths from '../../../app/paths.json'
import ReportTaximeter from "./reportTaximeter";
function Reports(props) {
  const navigate = useNavigate();

  return (
    <>

      <div className="h-100 overflow-auto hideScroll">
        <div className="row g-2">
          <label></label>
          <div className="row g-2">

            {CheckAccess(11) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.reports.taximeter)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">تاکسمیتر</h5>
                </button>
              </div>
              : <></>}

            {CheckAccess(12) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.reports.driverLocation)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">موقعیت خودرو ها</h5>
                </button>
              </div>
              : <></>}


            {CheckAccess(21) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.reports.driverTimeLine)
                  }}>
                  <FaTimeline size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3 d-flex">
                    خط زمانی راننده
                  </h5>
                </button>
              </div>
              : <></>}






            {CheckAccess(16) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.reports.verify)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3 d-flex ">
                    گزارش کدهای ورود
                  </h5>
                </button>
              </div>
              : <></>}
          </div>

          <label className="mt-5"></label>
          {CheckAccess(17) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.countInQue)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">رانندگان حاضر در صف</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(20) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.queIO)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">ورود به صف</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(13) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.driverTripCount)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">تعداد سفرهای راننده</h5>
              </button>
            </div>
            : <></>}


          {CheckAccess(15) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.tripHistory)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گزارش سفر ها</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(19) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.totalTripMonth)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">مجموع سفرها رفته به تفکیک ماه</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(18) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.tripChartHourly)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">نمودار ساعتی اعزام</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(22) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.tripChartDaily)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">نمودار روزانه اعزام</h5>
              </button>
            </div>
            : <></>}

          {CheckAccess(23) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.tripChartMonthly)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">نمودار ماهانه اعزام</h5>
              </button>
            </div>
            : <></>}

          {CheckAccess(24) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.rfidChart)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">نمودار کارت های RFID</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(24) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.rfid)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گزارش کارت های RFID</h5>
              </button>
            </div>
            : <></>}

          {CheckAccess(27) ?
            <div className="col-12 col-md-6 col-lg-3">
              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.census)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گزارش حضور غیاب رانندگان</h5>
              </button>
            </div>
            : <></>}

          {CheckAccess(29) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.reports.shifts)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گزارش شیفت ها</h5>
              </button>
            </div>
            : <></>}


          <label className="mt-5"></label>
          <div className="row g-2">
            {CheckAccess(15) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.reports.tripHistory)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">گزارش سفر ها</h5>
                </button>
              </div>
              : <></>}
            {CheckAccess(65) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.reports.tripCountReport)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">گزارش  کلی سفر ها</h5>
                </button>
              </div>
              : <></>}
            {CheckAccess(22) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    // navigate(paths.private.reports.driverLocation)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">گزارش تماس ها</h5>
                </button>
              </div>
              : <></>}

            {CheckAccess(23) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    // navigate(paths.private.reports.driverLocation)
                    window.open("https://admin:erfani@n@mashhad133s.efspco.ir/api/status", "_blank")
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">وضعیت سرور</h5>
                </button>
              </div>
              : <></>}




          </div>

          <div className="col-12" style={{ height: '20rem' }}>
          </div>

        </div>

      </div>
    </>

  );
}

export default Reports;
