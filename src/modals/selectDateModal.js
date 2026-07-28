import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddCarBody from '../components/addCar'
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";
import axios from "axios";
import Storages from "../app/storages";
import { FcSearch } from "react-icons/fc"
import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";

import DatePicker, { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function SelectDateModal(props) {

    // var endpoints = useEndpoints()
    const handleClose = () => {
        props.onClose();
    }

    var [date, setDate] = useState()
    return (<>
        <Modal show={props.show} size='sm' onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />
                </div>
                <Calendar
                    value={date}
                    calendar={persian}
                    locale={persian_fa}
                    onChange={setDate}
                >


                </Calendar>

            </Modal.Body>


        </Modal>
    </>)
}
