import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import 'react-image-crop/dist/ReactCrop.css'

import { PiPhoneCallDuotone } from "react-icons/pi"
import { CgClose } from 'react-icons/cg'
import endpoints from "app/endpoints";

import { addDate, yyyymmdd, timeStr } from "helper/dateHelper";
import LockDriverModal from "./lockDriverModal";
import UnlockDriverModal from "./unlockDriverModal";
import { AxiosPrivate } from "app/axiosPrivate";

export default function LockStatusModal(props) {

    useEffect(() => {
        if (props.show) {
            setParams(initParams)
            getLockList()
        }
    }, [props.show])

    // var endpoints = useEndpoints()
    const handleClose = () => {
        props.onClose();
    }

    var initParams = {
        fromTime: new Date(),
        toTime: addDate(new Date(), 31536000000)
    }
    var [params, setParams] = useState()
    var [loading, setLoading] = useState(true)


    var getLockList = () => {
        setLoading(true)
        AxiosPrivate.get(endpoints.lock,
            {
                params: {
                    smartCode: props?.person?.smartCode,
                    driverCode: props?.driverCode
                }
            }).then((res) => {
                setLockList(res.data)
            }).finally(() => {
                setLoading(false)
            })
    }

    var [lockList, setLockList] = useState([])

    var [showLockDriver, setShowLockDriver] = useState(false)
    var [showUnLockDriver, setShowUnLockDriver] = useState(false)
    var [selectedLock, setSelectedLock] = useState(undefined)
    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header" >
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />
                </div>
                <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 " dir="rtl" >
                    <div className="d-flex row g-2 w-100 mt-2">
                        <div className="card p-2">

                            <p className="m-0 p-0 iranSansBold">
                                نام : {props?.person?.firstName}   {props?.person?.lastName}

                            </p>
                            <p className="m-0 p-0 iranSansBold">
                                کد هوشمند : {props?.person?.smartCode}
                            </p>
                            <p className="m-0 p-0 iranSansBold">
                                شماره تماس :   {props?.person?.mobile}
                                <button className="btn btn-success mx-3 p-0 m-0">
                                    <a className=" w-100 p-2 m-0" href={"tel:" + props?.person?.mobile}>
                                        <PiPhoneCallDuotone size="30" className="text-light " />
                                    </a>
                                </button>

                            </p>
                        </div>
                        <button className='btn btn-success my-2 h5 iranSansBold w-100' onClick={() => {
                            setShowLockDriver(true)
                        }}>افزودن قفل جدید</button>
                        {lockList.map((item, index) => {
                            return <div className="d-flex row m-0 p-0 my-2" key={index}>

                                <div className=" p-0 m-0  p-2 card  " style={{ background: 'rgba(255, 0, 128, 0.200)' }}>
                                    <div className="row m-0 p-0 " >
                                        <p className="col-1  m-0 ">از</p>
                                        <p className="col-5  m-0 text-center iranSansBold" >{timeStr(item.fromTime)} - {yyyymmdd(item.fromTime)} </p>

                                        <p className="col-1  m-0">تا</p>
                                        <p className="col-5  m-0 text-center iranSansBold" > {timeStr(item.toTime)} - {yyyymmdd(item.toTime)}</p>
                                    </div>
                                    <hr className="m-0 my-2" />
                                    <p className="p-0 m-0 iranSansBold">به علت {item.lockDesc} توسط {item.opLocker} قفل گردید</p>
                                    {
                                        item.isArchive == 1 ?
                                            <div className=" p-0 m-0  p-2 card mt-3" style={{ background: 'rgba(0, 255, 128, 0.400)' }}>

                                                <p className="p-0 m-0">
                                                    توسط {item?.opUnlocker} به شرح {item?.unlockDesc} باز شد
                                                </p>
                                            </div>
                                            : <button className="btn btn-primary col-3 mt-3"
                                                onClick={() => {
                                                    setShowUnLockDriver(true)
                                                    setSelectedLock(item)
                                                }}> ویرایش</button>
                                    }


                                </div>



                            </div>


                        })}

                    </div>
                </div>
            </Modal.Body>
        </Modal>


        <LockDriverModal
            show={showLockDriver}
            person={props?.person}
            onClose={() => {
                getLockList()
                setShowLockDriver(false)
            }} />

        <UnlockDriverModal
            show={showUnLockDriver && selectedLock != undefined}
            data={selectedLock}
            onClose={() => {
                getLockList()
                setShowUnLockDriver(false)
                setSelectedLock(undefined)
            }}
        />

    </>)
}
