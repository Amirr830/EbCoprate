import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'

import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import { yyyymmdd } from "../helper/dateHelper";
import { AxiosPrivate } from "../app/axiosPrivate";

export default function OwnerHistoryModal(props) {

    const handleClose = () => {
        props.onClose();
    }

    var [carOwnerHistory, setCarOwnerHistory] = useState([])
    var [isLoading, setLoading] = useState(false)

    useEffect(() => {
        getHistory(props?.carCode)
    }, [props?.carCode])

    const getHistory = (carCode) => {
        setLoading(true)

        AxiosPrivate.get(endpoints.ownerHistory,
            {
                params: {
                    carCode: carCode
                }
            }).then((res) => {
                setCarOwnerHistory(res.data)
            }).finally(() => {
                setLoading(false)
            })
    }

    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />
                </div>


                {isLoading ?
                    <div className='justify-content-center d-flex py-5' >
                        <div className="spinner-border" role="status" />
                    </div>
                    :
                    <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 " dir="rtl">

                        {carOwnerHistory?.map((owner, index) => {
                            return <div className='  card px-3 my-1 w-100 ' style={{ background: owner?.toDate ? '#F8BBD0' : '' }} key={index}>

                                <div className='row card-header w-auto '>

                                    <h5 className=" text-end col-9 text-truncate iranSansBold"  >
                                        {owner?.firstName} {owner?.lastName}
                                    </h5>

                                    <h5 className=" text-center  col-3  "  >
                                        {owner?.type == 1 ? 'مالک' : ''}
                                        {owner?.type == 3 ? 'کمکی' : ''}
                                        {owner?.type == 2 ? 'بهره بردار' : ''}
                                    </h5>

                                </div>

                                <div className='row '>
                                    <div className='row col-10 p-0 m-0'>
                                        <label className="px-2  text-end "  >
                                            کد راننده : {owner?.smartCode}
                                        </label>
                                        <label className="px-2  text-end"  >
                                            کد ملی : {owner?.natCode}
                                        </label>
                                        <label className="px-2  text-end"  >
                                            همراه : {owner?.mobile}
                                        </label>
                                        <label className="px-2  text-end"  >
                                            از تاریخ : {
                                                yyyymmdd(owner?.fromDate)
                                            }
                                        </label>
                                        <label className="px-2  text-end"  >
                                            از تاریخ : {
                                                owner?.toDate ? yyyymmdd(owner?.toDate) : ''
                                            }
                                        </label>

                                    </div>


                                </div>

                            </div>
                        })}
                    </div>
                }


            </Modal.Body>


        </Modal>
    </>)

}
