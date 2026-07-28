import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddPersonBody from '../components/addPerson'
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";
import axios from "axios";
import Storages from "../app/storages";
import { FcSearch } from "react-icons/fc"
import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
import CheckBox from "../components/customeTag/checkBox";
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import _ from 'lodash'
import pin from "../assets/drawable/pin.png";
import DivBlock from "../components/customeTag/divBlock";
import { EditPolygon } from "../components/draw/editPolygon";
import AddPolygon from "../components/draw/addPolygon";
import Toast from "../components/toast";
import { FaArrowLeft } from "react-icons/fa"
import toast from "../components/toast";
import { MapSettingsContext } from "../contexts/initialMapSettings";
import SearchAddress from "../routes/private/actions/entrance/searchAddress";

export default function StationMultiSelector(props) {
    var [options, setOptions] = useState([])
    var [selectedSt, setSelectSt] = useState([])
    var [orginalStList, setOrginalStList] = useState([])


    useEffect(() => {
        getStations()
    }, [])

    useEffect(() => {
        setSelectSt(props?.selectedSt)
        setOrginalStList(props?.selectedSt)
    }, [props?.selectedSt])


    var getStations = () => {
        AxiosPrivate.get(endpoints.stations)
            .then((res) => {
                setOptions([
                    ...res?.data?.map(line => ({
                        stCode: line.stCode,
                        label: line.stCode + '-' + line.stName
                    }))
                ]
                )
            })
    }




    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        setShow(true)
        console.log(props?.station)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });

    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            size="sm"
            onHide={() => {
                setSelectSt(orginalStList)
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header  p-0 " dir="rtl">
                <div className="card overflow-auto a-scroll" style={{ height: '80vh' }} >
                    <div className="">

                        {options.map((item, index) => {
                            return <div className="py-1" key={index}>
                                <CheckBox title={item?.label}
                                    name={item?.stCode}
                                    checked={selectedSt?.find((v) => v == item?.stCode)}
                                    onChange={(e) => {
                                        if (e?.target?.checked) {
                                            if (selectedSt)
                                                setSelectSt([...selectedSt, item?.stCode])
                                            else
                                                setSelectSt([item?.stCode])

                                        } else {
                                            var newList = selectedSt?.filter(f => f != item?.stCode)
                                            setSelectSt(newList)
                                        }

                                    }}
                                />
                            </div>
                        })}
                    </div>

                </div>
                <div className="position-sticky bottom-0  w-100 p-2" >
                    <button className=" btn btn-success w-100 "
                        onClick={() => {
                            setShow(false)
                            props?.onStList(selectedSt)
                        }}>تایید</button>

                </div>

            </Modal.Body>
        </Modal>
    </>)
}


