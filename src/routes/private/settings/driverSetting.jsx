import React, { useEffect, useRef, useState } from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import paths from '../../../app/paths.json'
import { AxiosPrivate } from '../../../app/axiosPrivate'
import endpoints from "../../../app/endpoints";
import answerModal from "../../../modals/answerModal";
import toast from "../../../components/toast";
import CheckBox from "../../../components/customeTag/checkBox";
import CardLabel from "../../../components/customeTag/cardLabel";
import InputLabel from "../../../components/customeTag/inputLabel";
import Select from 'react-select';

export default function DriverSetting() {
  const navigate = useNavigate();

  var mapTypes = [{
    value: 'GOOGLE',
    label: 'گوگل'
  }, {
    value: 'OSM',
    label: 'Osm'
  }, {
    value: 'NESHAN',
    label: 'نشان'
  }]
  var [setting, setSetting] = useState()

  useEffect(() => {
    getDriverSetting()
  }, [])

  var getDriverSetting = () => {
    AxiosPrivate.get(endpoints.settingDriver).then((res) => {
      setSetting(res?.data)
    })
  }

  var updateDriverSetting = () => {
    answerModal.show("آیا از به روزرسانی تنظیمات اطمینان دارید؟", () => {
      AxiosPrivate.put(endpoints.settingDriver, setting).then((res) => {
        toast.Success(res?.data?.msg)
      })
    }, () => {

    })

  }

  const handleEnter = (event) => {
    if (event.key.toLowerCase() == "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };
  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    setSetting({
      ...setting,
      [name]: value
    })
  }
  var handleCheck = (e) => {
    console.log(e)
    var value = e?.target?.checked ? 1 : 0
    var name = e?.target?.name
    console.log(value, name)
    setSetting({
      ...setting,
      [name]: value
    })
  }
  return (
    <>
      <div className="position-relative m-0 p-0 h-100 d-flex flex-column ">

        <div className="row  m-0 p-0 overflow-x-hidden overflow-y-auto h-100 a-scroll">
          <div className="col-12  m-0 p-0 ">
            <div className="row m-0 p-0 ">
              <CardLabel
                className="col-12 col-md-6 col-lg-4"
                label="به روزرسانی">
                <div className="row p-0 m-0 ">
                  <div className="row gx-2 m-0 p-0  ">
                    <div className="col-6 ">
                      <InputLabel
                        placeholder="اخرین نسخه"
                        type="number"
                        name="driverAppVersion"
                        onChange={readChange}
                        value={setting?.driverAppVersion}
                      />
                    </div>

                    <div className="col-6   ">
                      <InputLabel
                        placeholder="اجبار تا"
                        type="number"
                        onChange={readChange}
                        name="lastActiveDriverAppVersion"
                        value={setting?.lastActiveDriverAppVersion}

                      />
                    </div>

                  </div>

                  <div className="m-0 p-0">
                    <InputLabel
                      placeholder="لینک دانلود"
                      type="text"
                      onChange={readChange}
                      name="driverAppUrl"
                      value={setting?.driverAppUrl}
                    />
                  </div>

                </div>
              </CardLabel>

              <CardLabel
                className="col-12 col-md-6 col-lg-4"

                label="اطلاعات کارت بانکی">
                <div className="row p-0 m-0 ">
                  <div className="row gx-2 m-0 p-0  ">
                    <div className="col-6 ">
                      <InputLabel
                        placeholder="نام بانک"
                        type="text"
                        name="cardBankName"
                        onChange={readChange}
                        value={setting?.cardBankName}
                      />
                    </div>

                    <div className="col-6   ">
                      <InputLabel
                        placeholder="نام صاحب حساب"
                        type="text"
                        name="cardOwnerName"
                        onChange={readChange}
                        value={setting?.cardOwnerName}
                      />
                    </div>

                  </div>

                  <div className="m-0 p-0">
                    <InputLabel
                      placeholder="شماره کارت"
                      type="text"
                      name="cardBankNumber"
                      onChange={readChange}
                      value={setting?.cardBankNumber}
                    />
                  </div>

                </div>
              </CardLabel>

              <CardLabel
                className="col-12 col-md-6 col-lg-4"
                label="اطلاعات حساب بانکی">
                <div className="row p-0 m-0 ">
                  <div className="row gx-2 m-0 p-0  ">
                    <div className="col-6 ">
                      <InputLabel
                        placeholder="نام بانک"
                        type="text"
                        name="accountBankName"
                        onChange={readChange}
                        value={setting?.accountBankName} />
                    </div>

                    <div className="col-6   ">
                      <InputLabel
                        placeholder="نام صاحب حساب"
                        type="text"
                        name="accountOwnerName"
                        onChange={readChange}
                        value={setting?.accountOwnerName} />
                    </div>

                  </div>

                  <div className="m-0 p-0">
                    <InputLabel
                      placeholder="شماره حساب"
                      type="text"
                      name="accountBankNumber"
                      onChange={readChange}
                      value={setting?.accountBankNumber} />
                  </div>

                </div>
              </CardLabel>
            </div>

          </div>
          <div className="row col-12  m-0 p-0 ">
            <div className="row g-2 col-12">



              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="shareTripEnable"
                checked={setting?.shareTripEnable == 1}
                title="سفر اشتراکی"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="closeTripEnable"
                checked={setting?.closeTripEnable == 1}
                title="سفر دربستی"
              />



              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="workInStation"
                checked={setting?.workInStation == 1}
                title="ثبت در ایستگاه"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="manualStRegister"
                checked={setting?.manualStRegister == 1}
                title="ثبت ایستگاه دستی"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="onlyRegisterStInAround"
                checked={setting?.onlyRegisterStInAround == 1}
                title="ثبت ایستگاه دستی فقط در محدوده"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="inPersonEnable"
                checked={setting?.inPersonEnable == 1}
                title="مسافر حضوری"
              />


              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="viewLast10StService"
                checked={setting?.viewLast10StService == 1}
                title="ده سفر آخر ایستگاه"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="viewDistInLast10Trip"
                checked={setting?.viewDistInLast10Trip == 1}
                title="نمایش آدرس سفر آخر ایستگاه"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="periodNewTripAlarm"
                checked={setting?.periodNewTripAlarm == 1}
                title="آلارم دوره ای متوجه شدن سفر"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="tripCancelable"
                checked={setting?.tripCancelable == 1}
                title="کنسل سفر توسط راننده"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="balanceInMainPage"
                checked={setting?.balanceInMainPage == 1}
                title="نمایش بدهی در صفحه نخست"
              />

              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="showTripCount"
                checked={setting?.showTripCount == 1}
                title="نمایش تعداد سفر های مسافر در راننده"
              />

              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="reviewPriceEnable"
                checked={setting?.reviewPriceEnable == 1}
                title="امکان بازبینی قیمت"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="reviewPriceLessAllow"
                checked={setting?.reviewPriceLessAllow == 1}
                title="امکان بازبینی قیمت با نرخ کمتر"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="limitServiceCharge"
                checked={setting?.limitServiceCharge == 1}
                title="کنترل موجودی حساب"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="onlinePay"
                checked={setting?.onlinePay == 1}
                title="پرداخت آنلاین"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="changeRingtoneEnable"
                checked={setting?.changeRingtoneEnable == 1}
                title="دسترسی به تغییر صداها"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="driverTripAcceptLongClick"
                checked={setting?.driverTripAcceptLongClick == 1}
                title="نگه داشتن برای قبول سفر"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="driverTripInPersonEnable"
                checked={setting?.driverTripInPersonEnable == 1}
                title="مسافر حضوری"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="driverCarRequestSOS"
                checked={setting?.driverCarRequestSOS == 1}
                title="درخواست کمک اضطراری"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="driverCanAddIBAN"
                checked={setting?.driverCanAddIBAN == 1}
                title="اضافه کردن شماره شبا"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="driverCanCard2card"
                checked={setting?.driverCanCard2card == 1}
                title="بخش کارت به کارت"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="driverCanAddReceipt"
                checked={setting?.driverCanAddReceipt == 1}
                title="افزودن فیش کارت به کارت"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="showDriverCommissionTurnOver"
                checked={setting?.showDriverCommissionTurnOver == 1}
                title="نمایش پورسانت سفر در گردش حساب"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="dontShowDriverTripPrice"
                checked={setting?.dontShowDriverTripPrice == 1}
                title="نمایش هزینه سفر قبل از دریافت"
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="showPassengerCountForDriver"
                checked={setting?.showPassengerCountForDriver == 1}
                title="نمایش تعداد سفرهای قبلی مهمان "
              />
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="currentTripShowEnable"
                checked={setting?.currentTripShowEnable == 1}
                title="بررسی سفرها توسط راننده"
              />
      
            </div>
          </div>
          <hr className=" mt-3" />
          <div className="col-12  m-0 p-0">
            <div className="row gx-3 gy-1 ">
              <CheckBox
                className="col-12 col-md-6 col-lg-4"
                onChange={handleCheck}
                name="mapTypeForce"
                checked={setting?.mapTypeForce == 1}
                title="اجبار نوع نقشه"
              />

              <_Select
                placeholder="نوع نقشه"
                title="نوع نقشه"
                name="mapType"
                onChange={readChange}
                options={mapTypes}
                value={setting?.mapType} />

              <Input2
                type="text"
                title="آدرس خدمات دهنده نقشه"
                name="osmTileSource"
                onChange={readChange}
                value={setting?.osmTileSource} />



            </div>
            <hr className=" mt-3" />
            <div className="row gx-3 gy-1 ">

              <Input2
                type="text"
                title="مسیر پرداخت آنلاین"
                name="paymentUrlDriver"
                disabled
                onChange={readChange}
                value={setting?.paymentUrlDriver} />

            </div>
            <hr className=" mt-3" />

            <div className="row gx-3 gy-1 ">
              <Input
                placeholder="تعداد"
                type="number"
                title="تعداد مجاز سفر همزمان"
                name="maxPriceNotFilled"
                onChange={readChange}
                value={setting?.maxPriceNotFilled} />

              {setting?.limitServiceCharge == 1 ?
                <Input
                  placeholder="مبلغ به ریال"
                  type="number"
                  title="کنترل موجودی حساب"
                  name="limitServiceChargePrice"
                  onChange={readChange}
                  value={setting?.limitServiceChargePrice} />
                : <></>}
              <Input
                placeholder="دقیقه"
                type="number"
                title="خروج اتومات پس از"
                name="timeForExitStation"
                onChange={readChange}
                value={setting?.timeForExitStation} />
              <Input
                placeholder="دقیقه"
                type="number"
                title="برگشت به اولویت تا"
                name="timeBackToPriority"
                onChange={readChange}
                value={setting?.timeBackToPriority} />

              <Input
                placeholder="دقیقه"
                type="number"
                title="مدت مجاز قبول سفر بعدی"
                name="timeStopSendService"
                onChange={readChange}
                value={setting?.timeStopSendService} />

              <Input
                placeholder="متر"
                type="number"
                title="شعاع سفرهای آزاد"
                name="freeSerDistance"
                onChange={readChange}
                value={setting?.freeSerDistance}
              />

              <Input
                placeholder="شماره"
                type="number"
                title="تلفن پشتیبانی"
                name="supportNumber"
                onChange={readChange}
                value={setting?.supportNumber} />



            </div>
            <hr className=" mt-3" />

            <div className="row gx-3 gy-1 ">
              <Input
                title="پیشنهاد اول"
                type="number"
                placeholder="ریال"
                name="paymentPrice1"
                onChange={readChange}
                thousandSeparator
                value={setting?.paymentPrice1} />
              <Input
                title="پیشنهاد دوم"
                type="number"
                placeholder="ریال"
                name="paymentPrice2"
                onChange={readChange}
                thousandSeparator
                value={setting?.paymentPrice2} />
              <Input
                title="پیشنهاد سوم"
                type="number"
                placeholder="ریال"
                name="paymentPrice3"
                onChange={readChange}
                thousandSeparator
                value={setting?.paymentPrice3} />

              <Input
                title="بیشترین مبلغ شارژ آنلاین"
                type="number"
                placeholder="ریال"
                name="maximumCharge"
                thousandSeparator
                onChange={readChange}
                value={setting?.maximumCharge} />
              <Input
                title="کمترین مبلغ شارژ آنلاین"
                type="number"
                placeholder="ریال"
                name="minimumCharge"
                onChange={readChange}
                thousandSeparator
                value={setting?.minimumCharge} />
            </div>
          </div>
          <pre />
          <pre />
          <pre />
          <pre />
          <pre />
          <pre />
        </div>

        <div className="start-0 end-0 container">
          <button className="btn btn-success col-12 m-0  mb-2"
            onClick={() => {
              updateDriverSetting()
            }}>تایید</button>
        </div>

      </div>

    </>
  );
}




function Input(props) {
  const addCommas = num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = num => num?.toString().replace(/[^0-9]/g, "");

  return <div className="col-12 col-md-6 col-lg-4">
    <div className='row  p-0 m-0'>
      <label className="col-7">{props.title}</label>
      <div className="col-5 position-relative">
        <input
          className="form-control text-center text-primary "
          style={{ paddingLeft: '2rem' }}
          {...props}
          placeholder=""
          type={props?.thousandSeparator || props?.type == "number" ? "text" : props?.type}
          value={props?.thousandSeparator ? addCommas(removeNonNumeric(props?.value)) :
            props?.type == "number" ? removeNonNumeric(props?.value) : props?.value}
          onChange={(e) => {
            if (props?.thousandSeparator) {
              e.target.value = removeNonNumeric(e.target.value)
            }
            props.onChange(e)
          }}
        />

        <label className="position-absolute start-0 top-0 bottom-0 mt-2 ms-3 ps-1  small opacity-25">{props.placeholder}</label>
      </div>
    </div>
  </div>
}

function Input2(props) {
  const addCommas = num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = num => num?.toString().replace(/[^0-9]/g, "");

  return <div className="col-12 col-lg-8">
    <div className='row  p-0 m-0'>
      <label className="col-4">{props.title}</label>
      <div className="col-8 position-relative">
        <input
          className="form-control text-center text-primary fredoka "
          {...props}

          placeholder=""
          type={props?.thousandSeparator || props?.type == "number" ? "text" : props?.type}
          value={props?.thousandSeparator ? addCommas(removeNonNumeric(props?.value)) :
            props?.type == "number" ? removeNonNumeric(props?.value) : props?.value}
          onChange={(e) => {
            if (props?.thousandSeparator) {
              e.target.value = removeNonNumeric(e.target.value)
            }
            props.onChange(e)
          }}
        />
      </div>
    </div>
  </div>
}

function _Select(props) {

  return <div className="col-12 col-md-6 col-lg-4">
    <div className='row  p-0 m-0'>
      <label className="col-7">{props.title}</label>
      <div className="col-5 position-relative">
        <Select
          className=" text-center text-primary "
          style={{ paddingLeft: '2rem' }}
          value={props?.options?.find(option => option.value === props.value)}
          onChange={(e) => {
            var er = {
              target: {
                name: props?.name,
                value: e.value
              }
            }
            props.onChange(er)
          }}
          options={props?.options}
          placeholder=""
        />



      </div>
    </div>
  </div>
}



