import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddCar from '../components/addCar'
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";
import axios from "axios";
import Storages from "../app/storages";
import { FcSearch } from "react-icons/fc"
import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";

export default function AddCarModal(props) {

    // var endpoints = useEndpoints()
    const handleClose = () => {
        props.onClose();
    }

    const saveCar = (userInfo) => {
        // let result = [userInfo.lineCode, userInfo.driverCode, userInfo.driverCode].reduce((a, b) => a ^ b);
        var loader = loaderModal.load()
        AxiosPrivate.put(endpoints.car
            , userInfo
        ).then(res => {
            props.onSave()
        }).finally(() => {
            loaderModal.close(loader)
        })
    }

    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 " >
                    <div className="d-flex flex-column w-100">
                        <AddCar
                            car={props.car}
                            onSubmit={saveCar}
                        />
                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>
    </>)
}
