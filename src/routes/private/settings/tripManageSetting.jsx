import React, { useEffect, useRef, useState } from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import paths from '../../../app/paths.json'
import CheckBox from "../../../components/customeTag/checkBox";
import CardLabel from "../../../components/customeTag/cardLabel";
import InputLabel from "../../../components/customeTag/inputLabel";
import Select from 'react-select';
import { AxiosPrivate } from "../../../app/axiosPrivate";
import endpoints from "../../../app/endpoints";
import toast from "../../../components/toast";
import answerModal from "../../../modals/answerModal";

export default function TripManageSetting() {
  const navigate = useNavigate();
  var updateTripManageSetting = () => {

  }

  var [setting, setSetting] = useState()



  useEffect(() => {
    getTripManageSetting()
  }, [])

  var getTripManageSetting = () => {
    AxiosPrivate.get(endpoints.settingTripManage).then((res) => {
      setSetting(res?.data)
    })
  }

  var updateTripManageSetting = () => {
    answerModal.show("آیا از به روزرسانی تنظیمات اطمینان دارید؟", () => {
      AxiosPrivate.put(endpoints.settingTripManage, setting).then((res) => {
        toast.Success(res?.data?.msg)
      })
    }, () => {

    })

  }


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
      <div className="position-relative m-0 p-0">
        <div className="row  m-0 p-0">

          <div className="row flex-column g-2">

            <Input
              placeholder="درصد"
              type="number"
              title="درصد شرایط جوی قرمز"
              name="redStatusPercent"
              onChange={readChange}
              value={setting?.redStatusPercent} />

            <Input
              placeholder="درصد"
              type="number"
              title="درصد شرایط جوی نارنجی"
              name="orangeStatusPercent"
              onChange={readChange}
              value={setting?.orangeStatusPercent} />

            <Input
              placeholder="درصد"
              type="number"
              title="درصد رد کردن سفر های اولویت جهت عدم نمایش مقصد"
              name="notAcceptPercentPunish"
              onChange={readChange}
              value={setting?.notAcceptPercentPunish} />

            <Input
              placeholder="روز قبل"
              type="number"
              title="مبنای محاسبه رد کردن سفر های اولویت جهت عدم نمایش مقصد"
              name="notAcceptPastDays"
              onChange={readChange}
              value={setting?.notAcceptPastDays} />

            <CheckBox
              className="col-12 col-md-6 col-lg-4"
              onChange={handleCheck}
              name="autoFreeTripEnable"
              checked={setting?.autoFreeTripEnable == 1}
              title="سفر آزاد خودکار"
            />
            <CheckBox
              className="col-12 col-md-6 col-lg-4"
              onChange={handleCheck}
              name="autoExit"
              checked={setting?.autoExit == 1}
              title="خروج خودکار"
            />

            <CheckBox
              className="col-12 col-md-6 col-lg-4"
              onChange={handleCheck}
              name="driverCanAutoAcceptEnable"
              checked={setting?.driverCanAutoAcceptEnable == 1}
              title="فعال بودن دریافت خودکار"
            />


            <CheckBox
              className="col-12 col-md-6 col-lg-4"
              onChange={handleCheck}
              name="forceDriverAutoAccept"
              checked={setting?.forceDriverAutoAccept == 1}
              title="دریافت خودکار اجباری"
            />

            <Input
              placeholder="از ساعت"
              type="number"
              name="startForceAutoAccept"
              onChange={readChange}
              value={setting?.startForceAutoAccept} />
            <Input
              placeholder="تا ساعت"
              type="number"
              name="endForceAutoAccept"
              onChange={readChange}
              value={setting?.endForceAutoAccept} />


          </div>

          <hr className=" mt-3" />

          <pre />
          <pre />
          <pre />
          <pre />
          <pre />
          <pre />
        </div>
        <div className=" position-fixed bottom-0 start-0 end-0  container">
          <button className="btn btn-success col-12 m-0  mb-5"
            onClick={() => {
              updateTripManageSetting()
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
