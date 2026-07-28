import React, { useContext, useEffect, useRef, useState } from "react";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import paths from '../app/paths.json'
import CheckBox from "./customeTag/checkBox";
import CardLabel from "./customeTag/cardLabel";
import InputLabel from "./customeTag/inputLabel";
import Select from 'react-select';
import { AxiosPrivate } from "../app/axiosPrivate";
import endpoints from "../app/endpoints";
import toast from "./toast";
import answerModal from "../modals/answerModal";
import Storages from "../app/storages";
import { Toast } from "bootstrap";
import { MapSettingsContext } from "../contexts/initialMapSettings";
import { IoMdMap } from "react-icons/io";

export default function MapTypeSelector() {
  const { changeMapSettings } = useContext(MapSettingsContext);

  var [mapType, setMapType] = useState(Storages.getDefaultMap())


  var changeMapType = (value) => {
    Storages.setDefaultMap(value)
    changeMapSettings(value)
    setMapType(value)
  }

  return (
    <>
      <button className="btn btn-danger" onClick={() => {
        console.log(mapType)
        if (mapType == 'OSM') {
          changeMapType("MASHHAD")
        } else {
          changeMapType("OSM")
        }
      }}>
        <IoMdMap />
      </button>

    </>
  );
}
