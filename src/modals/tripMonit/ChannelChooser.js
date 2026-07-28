import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalFooter } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "../loaderModal";
import { IoCloseSharp } from "react-icons/io5";

import { FcSearch } from "react-icons/fc"
import AddPersonModal from "../addPersonModal";
import endpoints from "../../app/endpoints";
import { AxiosPrivate } from "../../app/axiosPrivate";
import answerModal from "../answerModal";
import toast from "../../components/toast";
import TripEditModal from "./TripEditModal";
import SearchCar from "../searchCar";
import Turn from "../../components/Turn";
import { IoMdCloseCircle } from "react-icons/io";

import { RiErrorWarningFill } from "react-icons/ri";

export default function ChannelChooser(props) {

    const handleClose = () => {
        props.onClose();

    }

    var [channelList, setChannelList] = useState([])
    var getChannelList = () => {
        AxiosPrivate.get(endpoints.channel)
            .then((res) => {
                setChannelList(res?.data)
            })
    }

    useEffect(() => {
        if (props?.show) {
            getChannelList()
        }
    }, [props?.show])

    return (<>
        <Modal show={props?.show} size="md"
            centered
            onHide={handleClose}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }} >
            <Modal.Body className="card-header" dir="rtl">
                <div className="row g-2">
                    {
                        channelList.map((item, index) => {
                            return <div key={index}
                                className="card col-12 p-1 card-hover aPointer "
                                tabIndex={1}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        props.onChose(item)
                                        handleClose()
                                    }
                                }}
                                onClick={() => {
                                    props.onChose(item)
                                    handleClose()
                                }}>

                                <div className="row px-2 align-items-center py-1  ">
                                    <h5 className="col-6 iranSansBold p-0 px-2 m-0">{item.chName}</h5>
                                    <div className="row col-6 align-items-center ">
                                        <label className="col p-0 m-0 text-center">{item.fromSt}</label>
                                        <label className="col p-0 m-0 text-center">{item.toSt}</label>
                                        <label className="col p-0 m-0 text-center">{item.fromSt2}</label>
                                        <label className="col p-0 m-0 text-center">{item.toSt2}</label>

                                    </div>
                                </div>
                            </div>
                        })

                    }
                </div>

            </Modal.Body>

        </Modal>
    </>)
}
