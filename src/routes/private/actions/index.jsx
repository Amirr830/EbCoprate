import React from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { Route, Routes, useNavigate } from "react-router-dom";
import { CheckAccess } from "../../../app/checkAccess";
import { TiMessages } from "react-icons/ti";
import { BiTrip } from "react-icons/bi";
import { IoNewspaper } from "react-icons/io5";
import { MdOutlineConnectingAirports } from "react-icons/md";
import { BiLogoTelegram } from "react-icons/bi";
import { FaUnlockAlt } from "react-icons/fa";

import paths from '../../../app/paths.json'
import NumberReader from "../../../helper/numberReader";

export default function Actions(props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-100 overflow-auto hideScroll">
        <div className="row g-2">

          <label className="mt-5">
            مدیریت
          </label>
          <div className="row g-2 col-12">

            {CheckAccess(47) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    
                    // NumberReader(52652)
                    navigate(paths.private.actions.tripsMonit)
                  }}>
                  <BiTrip size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">پایش سفرها</h5>
                </button>
              </div>
              : <></>}

            {CheckAccess(40) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.reserve)
                  }}>
                  <BiTrip size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">رزرو</h5>
                </button>
              </div>
              : <></>}

            {CheckAccess(42) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.news)

                  }}>
                  <IoNewspaper size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">تابلو اعلانات</h5>
                </button>
              </div>

              : <></>}
            {CheckAccess(43) ?
              <div className="col-12 col-md-6 col-lg-3">
                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.entrance)
                  }}>
                  <MdOutlineConnectingAirports size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">مبادی ورودی</h5>
                </button>
              </div>

              : <></>}
            {CheckAccess(44) ?
              <div className="col-12 col-md-6 col-lg-3">
                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.kiosk)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">کیوسک</h5>
                </button>
              </div>

              : <></>}
            {CheckAccess(60) ?
              <div className="col-12 col-md-6 col-lg-3">
                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.messanger)
                  }}>
                  <BiLogoTelegram size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">پیام رسان</h5>
                </button>
              </div>

              : <></>}
            {CheckAccess(62) ?
              <div className="col-12 col-md-6 col-lg-3">
                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.weather)
                  }}>
                  <BiLogoTelegram size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">اعلام شرایط جوی</h5>
                </button>
              </div>

              : <></>}


          </div>


          <label className="mt-5">
            رانندگان
          </label>
          <div className="row g-2 col-12">
            {CheckAccess(-1) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                  }}>
                  <FaUnlockAlt size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">قفل راننده</h5>
                </button>
              </div>
              : <></>}

            {CheckAccess(48) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.driverPayment)

                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3 d-flex ">
                    دریافت از  <label className="px-2 small">(راننده)</label>
                  </h5>
                </button>
              </div>
              : <></>}
            {CheckAccess(49) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.payment2Driver)

                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3 d-flex ">
                    پرداخت به  <label className="px-2 small">(راننده)</label>
                  </h5>
                </button>
              </div>
              : <></>}
            {CheckAccess(61) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.driverAnnounceReceipt)

                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3 d-flex ">
                    فیش های اعلامی
                  </h5>
                </button>
              </div>
              : <></>}

          </div>

          <label className="mt-5">
            سامانه
          </label>
          <div className="row g-2 col-12">
            {CheckAccess(45) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.backup)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">تهیه نسخه پشتیبان</h5>
                </button>
              </div>
              : <></>}
            {CheckAccess(46) ?
              <div className="col-12 col-md-6 col-lg-3">

                <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                  onClick={(e) => {
                    navigate(paths.private.actions.changeIP)
                  }}>
                  <BsPersonLinesFill size={45} className="w-auto text-primary" />
                  <h5 className="col iranSansBold text-end pe-3">تغییر IP</h5>
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
