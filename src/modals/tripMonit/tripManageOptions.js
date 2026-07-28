import React, { useContext, useEffect, useRef, useState } from "react";
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
import CheckDriverModal from "./CheckDriverModal";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import TripMonitContext from "../../contexts/tripMonitContext";
import { yyyymmdd } from "../../helper/dateHelper";
import { FaInfoCircle } from "react-icons/fa";
import paths from '../../app/paths.json'
import TripDetails from './../../routes/private/reports/tripDetails/tdModal';
import TripEditOrigin from "./tripEditOrigin";

export default function TripManageOptions(props) {

    const handleClose = () => {
        props.onClose();
    }

    var onSetFreeTrip = () => {

        AxiosPrivate.post(endpoints.tripFree, { tripCode: props.data.tripCode })
            .then((res) => {
                toast.Success(res.data.msg)
                props.onClose();
            })
    }
    var onCallDirect = () => {
        AxiosPrivate.get(endpoints.directCallTo, { params: { tripCode: props.data.tripCode } })
            .then((res) => {
                toast.Success(res.data.msg)
                props.onClose();
            })
    }


    var onSetCancelTripByVoip = () => {
        AxiosPrivate.delete(endpoints.tripCancelVoip, {
            data: { tripCode: props?.data?.tripCode }
        }).then((res) => {
            toast.Success(res.data.msg)
            props.onClose();
        })

    }

    var onSetCancelTrip = () => {
        answerModal.show("آیا این فرم لغو شود"
            , () => {
                AxiosPrivate.delete(endpoints.tripCancel, {
                    data: { tripCode: props.data.tripCode }
                }).then((res) => {
                    if (res?.data?.returnToTurn == 1) {
                        answerModal.show('آیا راننده به اولویت بازگردد؟', () => {
                            AxiosPrivate.put(endpoints.return2turn, { tripCode: props?.data?.tripCode })
                                .then((res) => {
                                    toast.Success(res.data.msg)
                                    props.onClose();

                                }).finally(() => {
                                    tmContext?.sync()
                                })
                        })
                    }
                    toast.Success(res.data.msg)
                    props.onClose();
                }).finally(() => {
                    tmContext?.sync()
                })
            }, () => {
                if (props?.data?.rowType == 2)
                    AxiosPrivate.post(endpoints.tripCancel, {
                        tripCode: props.data.tripCode
                    }).then((res) => {
                        toast.Success(res.data.msg)
                        props.onClose();
                    }).finally(() => {
                        tmContext?.sync()
                    })
            })
    }



    var [showSearchCar, setShowSearchCar] = useState(undefined)

    var [show, setShow] = useState(true)

    var [editTrip, setEditTrip] = useState(undefined)
    var onEditTrip = (params) => {
        setShow(true)
        setEditTrip(undefined)
        console.log(params)
        AxiosPrivate.put(endpoints.tripEdit, params).then((res) => {
            toast.Success(res.data.msg)
            props.refreshPage();
            props.onClose();
        })
    }
    var tmContext = useContext(TripMonitContext);


    var onCopyTrip = () => {
        answerModal.show("آیا این فرم رونوشت شود", () => {
            AxiosPrivate.get(endpoints.tripCopy, {
                params: { tripCode: props.data.tripCode }
            }).then((res) => {
                toast.Success(res.data.msg)
                handleClose()
                props.refreshPage()

            }).finally(() => {
                tmContext?.sync()
                tmContext?.search()

            })
        })
    }
    var setUncancelTrip = (tripCode) => {
        answerModal.show("آیا این فرم به حالت فعال تبدیل و مجدد به راننده ارجاع شود؟", () => {
            AxiosPrivate.put(endpoints.uncancelTrip, { tripCode }).then((res) => {
                toast.Success(res.data.msg)
                handleClose()
                props.refreshPage()
            }).finally(() => {
                tmContext?.sync()
                tmContext?.search()
            })
        })
    }

    useEffect(() => {
        console.log(props?.data)
    }, [props?.data])

    return (<>
        <Modal show={props?.data && showSearchCar == undefined} size="sm"
            onHide={() => {
                handleClose()
            }}
            centered
            style={{ background: ' rgba(0, 0, 0, 0.400)' }} >

            <Modal.Body className="card-header">
                <div className="justify-content-end d-flex">
                    <div>

                        <a
                            href={paths.private.reports.tripDetails + `?tripCode=${props?.data?.tripCode}`}
                            target="_blank"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            rel="noopener noreferrer"
                        >
                            <TripDetails tripCode={props?.data?.tripCode}>
                                <FaInfoCircle className='m-0 p-0 aPointer text-hover' size={20} />
                            </TripDetails>
                        </a>
                    </div>
                    <label className="text-center w-100 iranSansBold ">
                        {props?.data?.custName}
                    </label>
                    <IoCloseSharp className="aPointer text-danger position-absolute " size={25}
                        onClick={handleClose} />


                </div>
                <div className="justify-content-end d-flex">
                    <label className="text-center small w-100 ">
                        {props?.data?.originAddr}
                    </label>

                </div>
                <hr className="p-0 m-0" />
                <div className="justify-content-end d-flex">
                    <label className="text-center small w-100 ">
                        {props?.data?.d1Address}
                    </label>

                </div>

                <div className="justify-content-end d-flex">
                    <label className="text-center iranSansBold text-info w-100 ">
                        کد سفر : {props?.data?.tripCode}



                    </label>

                </div>
                <div className="justify-content-center align-items-center  d-flex row w-100 col-12 p-0 m-0 g-2" dir="rtl">
                    {
                        (props?.data?.status == 0 && props?.data?.rowType != 2) ?
                            <>
                                <button className="btn btn-outline-dark col-12"
                                    onClick={() => {
                                        setShowSearchCar(props?.data)
                                    }}>
                                    <label className="iranSansBold small">انتساب راننده</label>
                                </button>

                                {
                                    props?.data?.waitingAccept != 1 ?
                                        <button className="btn btn-outline-dark col-12"
                                            onClick={onSetFreeTrip}>
                                            <label className="iranSansBold small">آزاد سازی</label>
                                        </button>
                                        : <></>
                                }
                            </>
                            : <></>
                    }

                    <button className="btn btn-outline-dark "
                        onClick={onCopyTrip}>
                        <label className="iranSansBold small">رونوشت</label>
                    </button>


                    <button className="btn btn-outline-dark"
                        onClick={onCallDirect}>
                        <label className="iranSansBold small " >تماس با مشترک</label>
                    </button>

                    {props?.data?.rowType != 2
                        ?
                        <button className="btn btn-outline-dark"
                            onClick={() => {
                                setEditTrip(props?.data)
                            }}>
                            <label className="iranSansBold small">ویرایش فرم</label>
                        </button>
                        : <></>}

                    {props?.data?.rowType != 2
                        ?
                        <TripEditOrigin
                            tripCode={props?.data?.tripCode} >
                            <button className="btn btn-outline-dark">
                                <label className="iranSansBold small">ویرایش مبدا</label>
                            </button>
                        </TripEditOrigin>
                        : <></>}


                    {props?.data?.status == 6 ?
                        <button className="btn btn-outline-dark"
                            onClick={e => {
                                setUncancelTrip(props?.data?.tripCode)
                            }}>
                            <label className="iranSansBold small">برگشت سفر به راننده</label>
                        </button> : <></>}
                    {
                        (props?.data?.status != 6 && props?.data?.rowType != 2) ?
                            <button className="btn btn-outline-dark"
                                onClick={() => {
                                    onSetCancelTripByVoip()
                                }}>
                                <label className="iranSansBold small">کنسل از ویپ</label>
                            </button>
                            : <></>}

                    <div className="card">

                        <label className=" text-center p-0 m-0 py-1 iranSansBold  text-success">
                            {yyyymmdd(props?.data?.callDate)}
                        </label>
                        <hr className="p-0 m-0" />
                        <div className="d-flex  col-12 p-0 m-0 ">
                            <div className="col-4">
                                <div className="d-flex row ">
                                    <label className="opacity-50 text-center ">
                                        تماس
                                    </label>
                                    <label className="text-center iranSansBold">
                                        {props?.data?.callTime}
                                    </label>
                                </div>
                            </div>

                            <div className="vr" />
                            <div className="col-4">
                                <div className="d-flex row ">
                                    <label className="opacity-50 text-center ">
                                        اعزام
                                    </label>
                                    <label className="text-center iranSansBold">
                                        {props?.data?.sendTime}
                                    </label>
                                </div>
                            </div>
                            <div className="vr" />
                            <div className="w-100">
                                <div className="d-flex row">
                                    <label className="opacity-50 text-center ">
                                        اتمام
                                    </label>
                                    <label className="text-center iranSansBold">
                                        {props?.data?.endTime}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex small">
                        {props?.data?.tags == "" ? <></> : props?.data?.tags.split(',').map((item, index) => {
                            return <div className='col-1 text-end px-2 noSelect bg-warning text-dark card ms-2 w-auto' key={index}
                                style={{ height: '1.5rem' }}><label className=' w-100 text-center'> {item}</label>
                            </div>
                        })}
                    </div>
                    <div className="card border border-dark mt-2" dir="ltr ">
                        <AudioPlayer
                            src={props?.data?.opVoiceUrl}
                            onPlay={e => console.log("onPlay")}
                            showJumpControls={true}
                            customAdditionalControls={[]}
                            customVolumeControls={[]}
                        // other props here
                        />
                    </div>

                    {
                        props?.data?.status != 6 ?

                            <button className="btn btn-outline-danger "
                                onClick={() => {
                                    onSetCancelTrip()
                                }}>
                                <label className="iranSansBold small">لغو سفر</label>
                            </button>
                            : <></>
                    }
                </div>
            </Modal.Body>

        </Modal>

        <CheckDriverModal
            refreshPage={() => {
                props?.refreshPage()
            }}
            data={showSearchCar}
            onClose={() => { setShowSearchCar(undefined) }}
        />


        <TripEditModal
            data={editTrip}
            onClose={() => {
                setShow(true)
                setEditTrip(undefined)
            }}
            refreshPage={() => { props?.refreshPage() }}
            onEdit={onEditTrip} />

    </>)
}
