import React, { useEffect, useRef, useState } from "react";
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
import OwnerAccessibilitiesHistory from "./ownerAccessibiltiesHistory";

export default function OwnerAccessibility(props) {

    // var endpoints = useEndpoints()
    const handleClose = () => {
        props.onClose();
    }

    var [accessibility, setAccessibility] = useState([])
    const getAccessibility = (ownerCode) => {

        // var loader = loaderModal.load()
        AxiosPrivate.post(endpoints.accessibility, { ownerCode: ownerCode }
            // , smartCode
        ).then(res => {
            console.log(res.data)
            // props.onSave()
            setAccessibility(res?.data)
        }).finally(() => {
            // loaderModal.close(loader)
        })
    }

    useEffect(() => {
        if (props.show)
            getAccessibility(props?.ownerCode)
    }, [props.show])



    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 " >
                    <div className="d-flex flex-column w-100">
                        {
                            accessibility?.map((item, index) => {
                                return <div key={index} className="d-flex my-1">

                                    <CheckBox checked={item?.isEnable}
                                        title={item?.title}
                                        className="col "
                                    />

                                    <OwnerAccessibilitiesHistory accessibilityCode={item?.aCode} ownerCode={props?.ownerCode} item={item}>

                                        <button className="btn btn-warning">تاریخچه</button>
                                    </OwnerAccessibilitiesHistory>

                                </div>
                            })}

                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>
    </>)
}
