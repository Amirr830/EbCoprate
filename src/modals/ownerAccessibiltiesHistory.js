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
import { IoAdd, IoCheckbox, IoClose, IoEnter, IoExit, IoRemove } from "react-icons/io5";
import { yyyymmddhhmm } from "helper/dateHelper";

export default function OwnerAccessibilitiesHistory(props) {

    var [accessibility, setAccessibility] = useState([])
    const getAccessibilityHistory = (accessibilityCode, ownerCode) => {

        // var loader = loaderModal.load()
        AxiosPrivate.post(endpoints.accessibilityHistory, { ownerCode: ownerCode, accessibilityCode: accessibilityCode }
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
        if (show) {
            console.log("ssssssssssssssssss", props?.accessibilityCode, props?.ownerCode)
            getAccessibilityHistory(props?.accessibilityCode, props?.ownerCode)
        }
    }, [show])

    const handleClose = () => {
        setShow(false)
    }

    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        setShow(true)
        getAccessibilityHistory(props?.accessibilityCode, props?.ownerCode)

    };

    const newFirstChild = React.cloneElement(
        props.children?.length > 1
            ? props.children[0]
            : props.children,
        { onClick: handleShow });





    return (<>
        {newFirstChild}
        <Modal show={show} onHide={handleClose} size="md" dir="rtl" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header" style={{ background: "#ECEFF1" }}>
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 " >
                    <div className="d-flex flex-column w-100">
                        {
                            accessibility?.map((item, index) => {
                                return <div key={index} className="d-flex my-1 " style={{ background: item?.isEnable == 1 ? "rgba(255, 0, 0, 0.23)" : "rgba(0, 207, 79, 0.25)" }}>

                                    <h3 className="me-auto text-center   w-100">
                                        {item?.isEnable == 1 ? <IoRemove className="text-danger" /> : <IoAdd className="text-success" />}
                                        {yyyymmddhhmm(item?.saveTime)}
                                    </h3>




                                </div>
                            })}

                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal >
    </>)
}
