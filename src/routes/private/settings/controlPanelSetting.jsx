import React, { useContext, useEffect, useRef, useState } from "react";
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
import Storages from "../../../app/storages";
import { Toast } from "bootstrap";
import { MapSettingsContext } from "../../../contexts/initialMapSettings";

export default function ControlPanelSetting() {
  const navigate = useNavigate();
  const { changeMapSettings } = useContext(MapSettingsContext);

  var updateTripManageSetting = () => {
    Storages.setDefaultMap(setting?.mapType)
    changeMapSettings(setting?.mapType)
    toast.Success("موفق")

  }


  var [setting, setSetting] = useState({
    mapType: Storages.getDefaultMap()
  })

  var mapTypes = [{
    label: 'نقشه شهرداری',
    value: 'MASHHAD'
  }, {
    label: 'نقشه OSM',
    value: 'OSM'
  }]

  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

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

            <_Select
              placeholder="نوع نقشه"
              title="نوع نقشه"
              name="mapType"
              onChange={readChange}
              options={mapTypes}
              value={setting?.mapType} />
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
