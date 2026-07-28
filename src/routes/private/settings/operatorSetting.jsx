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

export default function OperatorSetting() {
  const navigate = useNavigate();


  var [setting, setSetting] = useState()

  useEffect(() => {
    getOperatorSetting()
  }, [])

  var getOperatorSetting = () => {
    AxiosPrivate.get(endpoints.settingOperator).then((res) => {
      setSetting(res?.data)
    })
  }

  var updateOperatorSetting = () => {
    answerModal.show("آیا از به روزرسانی تنظیمات اطمینان دارید؟", () => {
      AxiosPrivate.put(endpoints.settingOperator, setting).then((res) => {
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
                        name="opAppLastVersion"
                        onChange={readChange}
                        value={setting?.opAppLastVersion}
                      />
                    </div>

                    <div className="col-6   ">
                      <InputLabel
                        placeholder="اجبار تا"
                        type="number"
                        onChange={readChange}
                        name="opAppLastActiveVersion"
                        value={setting?.opAppLastActiveVersion}

                      />
                    </div>

                  </div>

                  <div className="m-0 p-0">
                    <InputLabel
                      placeholder="لینک دانلود"
                      type="text"
                      onChange={readChange}
                      name="opAppDownloadLink"
                      value={setting?.opAppDownloadLink}
                    />
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
                name="canEditOriginStWithCode"
                checked={setting?.canEditOriginStWithCode == 1}
                title="تغییر ایستگاه های مبدا دارای ایستگاه"
              />





            </div>
          </div>
          <hr className=" mt-3" />

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
              updateOperatorSetting()
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



