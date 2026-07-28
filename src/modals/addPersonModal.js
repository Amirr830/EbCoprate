import React, { useRef, useState } from "react";
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

export default function AddPersonModal(props) {

    // var endpoints = useEndpoints()
    const handleClose = () => {
        props.onClose();
    }

    const savePerson = (userInfo) => {
        var loader = loaderModal.load()
        AxiosPrivate.post(endpoints.driver
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
                        <AddPersonBody
                            person={props.person}
                            onSubmit={savePerson}
                        />
                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>
    </>)
}
