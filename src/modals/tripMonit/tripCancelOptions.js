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
export default function TripCancelOptions(props) {

    const handleClose = () => {
        props.onClose();
    }

    var tmContext = useContext(TripMonitContext)
    var onCallDirect = () => {
        answerModal.show("با این مشترک تماس گرفته شود؟", () => {
            AxiosPrivate.get(endpoints.directCallTo, { params: { tripCode: props.data.tripCode } })
                .then((res) => {
                    toast.Success(res.data.msg)
                    props.onClose();
                })
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


    return (<>
        <Modal show={props?.data && showSearchCar == undefined} size="sm"
            onHide={() => {
                handleClose()
            }}
            centered
            style={{ background: ' rgba(0, 0, 0, 0.400)' }} >

            <Modal.Body className="card-header">


                <div className="justify-content-end d-flex ">
                    <IoCloseSharp className="aPointer text-danger" size={25}
                        onClick={handleClose} />
                </div>
                <div className="justify-content-end d-flex">
                    <label className="text-center w-100 iranSansBold  ">
                        {'آیا سفر آقای/خانم ' + props?.data?.custName + " به مبدا " + props?.data?.originAddr + " لغو شود؟"}
                    </label>
                </div>

                <div className="justify-content-center align-items-center  d-flex row w-100 col-12 p-0 m-0 g-2" dir="rtl">


                    <button className="btn btn-outline-dark"
                        onClick={onCallDirect}>
                        <label className="iranSansBold small " >تماس با مشترک</label>
                    </button>
                    <div dir="ltr">
                        <AudioPlayer
                            src={props?.data?.opVoiceUrl}
                            onPlay={e => console.log("onPlay")}
                            showJumpControls={true}
                            customAdditionalControls={[]}
                            customVolumeControls={[]}
                        // other props here
                        />
                    </div>

                    <div className="my-2">
                        <hr />
                    </div>

                    <button className="btn btn-outline-danger "
                        onClick={() => {
                            onSetCancelTrip()
                        }}>
                        <label className="iranSansBold small">لغو سفر</label>
                    </button>

                </div>
            </Modal.Body>

        </Modal>

        <CheckDriverModal
            data={showSearchCar}
            onClose={() => { setShowSearchCar(undefined) }}
        />


        <TripEditModal
            data={editTrip}
            onClose={() => {
                setShow(true)
                setEditTrip(undefined)
            }}
            refreshPage={() => { props.refreshPage() }}
            onEdit={onEditTrip} />
    </>)
}
