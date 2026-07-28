import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddPersonBody from '../../components/addPerson'
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "../loaderModal";
import axios from "axios";
import Storages from "../../app/storages";
import { FcSearch } from "react-icons/fc"
import { CgClose } from 'react-icons/cg'
import endpoints from "../../app/endpoints";
import { AxiosPrivate } from "../../app/axiosPrivate";
import { CheckAccess } from "../../app/checkAccess";
import { GoDash } from "react-icons/go";
import { AxiosPublic } from "../../app/axiosPublic";

export default function PhysicalOperations(props) {

    var [phAct, setPhAct] = useState([])
    var [loading, setLoading] = useState(true)

    var getPhysicalAction = () => {
        setLoading(true)
        AxiosPrivate.get(endpoints.physicalAction, { params: { stCode: 0 } })
            .then((res) => {
                setPhAct(res?.data)
            })
            .finally(() => {
                setLoading(false)
            })
    }


    const handleClose = () => {
        setShow(false)
    }

    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        setShow(true)
        getPhysicalAction()
    };


    const newFirstChild = React.cloneElement(
        props.children?.length > 1
            ? props.children[0]
            : props.children,
        { onClick: handleShow });



    return (<>
        {newFirstChild}
        <Modal show={show} onHide={handleClose} className="modal-sm" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 " >


                    <div className="d-flex flex-column w-100" dir="rtl">

                        {
                            loading
                                ?
                                <div className="spinner-border  " role="status">
                                    <span className="sr-only"></span>
                                </div>
                                :
                                phAct.length == 0 ?
                                    <label className="text-center w-100">
                                        لیست دستورات خالی است
                                    </label>
                                    :
                                    phAct?.map((item, index) => {
                                        return <h3 className="card text-center card-hover aPointer" onClick={() => {
                                            axios.get(item.actionUrl)
                                            setShow(false)
                                        }}>
                                            {item.title}
                                        </h3>
                                    })
                        }


                    </div>
                    <hr />
                </div>
            </Modal.Body>
        </Modal>
    </>)
}
