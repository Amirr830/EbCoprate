import React from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import { CheckAccess } from "../../../app/checkAccess";
import paths from '../../../app/paths.json'
import { FaCar } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { MdOutlineSms } from "react-icons/md";
import { MdOutlineTripOrigin } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";

function Settings() {
  const navigate = useNavigate();

  return (
    <>
      <div className="row g-2 h-100 overflow-auto hideScroll">
        <label>
          برنامه های موبایلی
        </label>
        <div className="row g-2 col-12">
          {CheckAccess(52) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.passenger)
                }}>
                <FaPerson size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">مسافر</h5>
              </button>
            </div>
            : <></>}


          {CheckAccess(51) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.driver)
                }}>
                <FaCar size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">راننده</h5>
              </button>
            </div>
            : <></>}


          {CheckAccess(53) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.operator)
                }}>
                <BiSupport size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">اپراتور</h5>
              </button>
            </div>
            : <></>}
        </div>
        <label className="mt-3">
          سامانه
        </label>
        <div className="row g-2 col-12">
          {CheckAccess(54) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.sms)
                }}>
                <MdOutlineSms size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">پیامک</h5>
              </button>
            </div>
            : <></>}



          {CheckAccess(55) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.tripManage)
                }}>
                <MdOutlineTripOrigin size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">سرویس دهی</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(56) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.tariff)
                }}>
                <MdAttachMoney size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">نرخ نامه</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(57) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.settings.controlPanel)
                }}>
                <MdAttachMoney size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">میزکار</h5>
              </button>
            </div>
            : <></>}

          <div className="col-12" style={{ height: '20rem' }}>

          </div>

        </div>


      </div>
    </>
  );
}

export default Settings;
