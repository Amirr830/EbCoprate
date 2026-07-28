import React from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { Route, Routes, useNavigate } from "react-router-dom";
import paths from '../../../app/paths.json'
import UserGroup from "./userGroup";
import Users from "./users";
import { FaUser, FaMapPin } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { CheckAccess } from "../../../app/checkAccess";
import { FaRoute } from "react-icons/fa";
import { FaRegFaceGrinStars } from "react-icons/fa6";
import { FaCommentDots } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { FaCar, FaStar } from "react-icons/fa";
import { SiOnlyoffice } from "react-icons/si";
import { FaTags } from "react-icons/fa6";
import { BsFillStoplightsFill } from "react-icons/bs";
import Storages from "../../../app/storages";
import { GiCycle } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi2";
import { LiaLayerGroupSolid } from "react-icons/lia";

function Definitions() {
  const navigate = useNavigate();
  return (
    <>

      <div className="row g-2 h-100 overflow-auto hideScroll">

        <label>
          تعریف خودرو و انتصاب راننده
        </label>
        <div className="col-12 row g-2">

          {CheckAccess(34) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.persons)
                }}>
                <BsPersonLinesFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">رانندگان</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(33) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.cars)
                }}>
                <BsTaxiFrontFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">خودرو ها</h5>
              </button>

            </div>
            : <></>}
        </div>




        <label className="mt-5">
          مبانی سیستم
        </label>
        <div className="col-12 row g-2">

          {CheckAccess(39) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.stations)
                }}>
                <FaMapPin size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">ایستگاه ها</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(39) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.stationsV2)
                }}>
                <FaMapPin size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">2 ایستگاه ها</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(35) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.lines)
                }}>
                <FaRoute size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">خطوط</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(38) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.subscribers)
                }}>
                <FaRegFaceGrinStars size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">مشتریان ویژه</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(36) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.carTypes)
                }}>
                <FaCar size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">انواع خودرو</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(36) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.carClass)
                }}>
                <BiCategoryAlt size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">دسته بندی خودرو</h5>
              </button>

            </div>
            : <></>}
          {CheckAccess(37) ?
            <div className="col-12 col-md-6 col-lg-3 d-none" >

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.complaints)
                }}>
                <FaCommentDots size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">انواع شکایات</h5>
              </button>

            </div>
            : <></>}

          {CheckAccess(28) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.frequentDests)
                }}>
                <FaTags size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">مقصد های پرتکرار</h5>
              </button>

            </div>
            : <></>}

          {CheckAccess(66) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.duplicateAddress)
                }}>
                <FaTags size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">آدرس های مشابه</h5>
              </button>

            </div>
            : <></>}


          {CheckAccess(26) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.physicalActions)
                }}>
                <BsFillStoplightsFill size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">عملیات میدانی</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(24) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.surveyOptions)
                }}>
                <FaStar size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گزینه های نظرسنجی</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(25) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.defMsg)
                }}>
                <FaStar size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">پیام های پیشفرض</h5>
              </button>
            </div>
            : <></>}

          {CheckAccess(58) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.shifts)
                }}>
                <GiCycle size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">شیفت ها</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(59) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.shiftGroups)
                }}>
                <HiUserGroup size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گروه رانندگان</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(63) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.shiftPattern)
                }}>
                <LiaLayerGroupSolid size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">الگوی شیفت</h5>
              </button>
            </div>
            : <></>}
        </div>



        <label className="mt-5">
          تعریف کاربران و سطح دسترسی های سامانه
        </label>
        <div className="col-12 row g-2">
          {CheckAccess(31) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.users)
                }}>
                <FaUser size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">کاربران</h5>
              </button>
            </div>

            : <></>}
          {CheckAccess(32) ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.userGroup)
                }}>
                <FaUserGroup size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">گروه کاربران</h5>
              </button>
            </div>
            : <></>}
          {CheckAccess(29) && Storages.getUserInfo().manageCompanyAccess ?
            <div className="col-12 col-md-6 col-lg-3">

              <button className="btn btn-outline-dark d-flex align-items-center w-100 py-3"
                onClick={(e) => {
                  navigate(paths.private.definitions.companies)
                }}>
                <SiOnlyoffice size={45} className="w-auto text-primary" />
                <h5 className="col iranSansBold text-end pe-3">شرکت ها</h5>
              </button>
            </div>
            : <></>}
        </div>


        <div className="col-12" style={{ height: '20rem' }}>
        </div>

      </div>
    </>
  );
}

export default Definitions;
