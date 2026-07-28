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

import Dropdown from 'react-bootstrap/Dropdown';
import AnswerModal from './../answerModal';
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import { BsFillLockFill } from 'react-icons/bs'
import toast from "../../components/toast";
import BillTripPrint from "../../components/BillTripPrint";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import NumberReader from "../../helper/numberReader";
import ProgressBar from "../../components/ProgressBar";

export default function TripHistory(props) {

    var [params, setParams] = useState({})
    var [isLoading, setLoading] = useState(true)
    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            if (name == 'tel' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'mobile' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))

        } catch (err) {
            console.log(err)
        }
    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    const handleClose = () => {
        setShow(false)
        props?.onClose()
    }

    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        setShow(true)
        getLast20Trip()
    };
    var [last20trip, setLast20Trip] = useState([])

    var getLast20Trip = () => {
        setLoading(true)
        AxiosPrivate.get(endpoints.pointIOLast20Trip, { params: { stCode: props?.stCode, lineCode: props?.lineCode, carClass: props?.carClass } })
            .then((res) => {
                setLast20Trip(res.data)
                console.log(res.data)
            }).finally(() => {
                setLoading(false)
            })
    }


    const newFirstChild = React.cloneElement(
        props.children?.length > 1
            ? props.children[0]
            : props.children,
        { onClick: handleShow });


    var cancelTrip = (item) => {
        AnswerModal.show("آیا از لغو این سفر اطمینان دارید؟", () => {
            cancelTripReq(item, false)
        }, null)
    }
    var cancelTripAndSendNext = (item) => {
        AnswerModal.show("برای اولین راننده  بعدی در صف ارسال شود؟",
            () => {
                cancelTripReq(item, true)
            }, null)
    }
    var cancelTripReq = (item, autoSendNextTurn) => {
        console.log('ffffffffff', item)
        AxiosPrivate.delete(endpoints.pointIOTrip, {
            data: {
                tripCode: item?.tripCode,
                autoSendNextTurn: autoSendNextTurn
            }
        })
            .then((res) => {
                if (res?.data?.status == 1) {
                    toast.Success(res.data.message)
                    handleClose();
                    setTripPrint()
                } else {
                    toast.Error(res.data.message)
                }
                getLast20Trip()
            })
    }
    var [tripPrint, setTripPrint] = useState(undefined)
    return (<>
        {newFirstChild}
        <Modal show={show} onHide={handleClose} className="modal-xl" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 " >
                    <div className="d-flex flex-column w-100" dir="rtl">
                        {
                            isLoading
                                ?
                                <ProgressBar />
                                :
                                <table className="table  table-striped table-hover rounded m-0 p-0">
                                    <thead >
                                        <tr >
                                            <td className="py-1 iranSansBold small" width="10%">
                                                کد خودرو
                                            </td>
                                            <td className="py-1" width="6%">
                                                نام مسافر
                                            </td>
                                            <td className="py-1" width="6%">
                                                همراه
                                            </td>
                                            <td className="py-1" width="6%">
                                                وضعیت
                                            </td>
                                            <td className="py-1" width="8%">
                                                ساعت اعزام
                                            </td>
                                            <td className="py-1" width="8%">
                                                پلاک
                                            </td>
                                            <td className="py-1" width="30%">
                                                مقصد
                                            </td>
                                            <td className="py-1" width="13%">
                                                کرایه اضافه
                                            </td>
                                            <td className="py-1" width="13%">
                                                مبلغ
                                            </td>

                                            <td className="py-1 iranSansBold small" width="5%">
                                                کد سفر
                                            </td>
                                            <td className="py-1" width="5%">

                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            last20trip.map((item, index) => {

                                                return <tr key={index} onDoubleClick={() => {
                                                    cancelTrip(item)

                                                }}>
                                                    <td className="py-1 d-flex" >
                                                        <HiMiniSpeakerWave className=" text-hover mx-2 aPointer" onClick={() => {
                                                            NumberReader(item?.drv3Code)
                                                        }} />
                                                        <h4 className="iranSansBold">{item?.drv3Code}</h4>
                                                    </td>
                                                    <td className="py-1" >
                                                        {item.custName}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.mobile}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.statusStr}
                                                    </td>
                                                    <td className="py-1" title={item.strOutDate}>
                                                        {item.strOutTime}
                                                    </td>
                                                    <td className="py-1" >
                                                        {item.plaque}
                                                    </td>
                                                    <td className="py-1">
                                                        {item.dest}
                                                    </td>
                                                    <td className="py-1 iranSansBold text-danger" >
                                                        {item?.extraFareStr}
                                                    </td>
                                                    <td className="py-1 iranSansBold text-danger" >
                                                        {item.priceStr}
                                                    </td>
                                                    <td className="py-1" >
                                                        {item.tripCode}
                                                    </td>
                                                    <td className="py-1">
                                                        <Dropdown className='' >
                                                            <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={(e) => {
                                                                    // showDropdown()
                                                                    setTripPrint(item.tripCode)
                                                                }} >چاپ مجدد</Dropdown.Item>
                                                                <Dropdown.Item onClick={(e) => {
                                                                    // showDropdown()
                                                                    cancelTrip(item)
                                                                }} >لغو سفر </Dropdown.Item>
                                                                <Dropdown.Item onClick={(e) => {
                                                                    // showDropdown()
                                                                    cancelTripAndSendNext(item)
                                                                }} >لغو و انتساب به خودرو بعد </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>

                                                    </td>
                                                </tr>

                                            })
                                        }
                                    </tbody>
                                </table>
                        }
                        {/* <div className="spinner-border  " role="status">
                            <span className="sr-only"></span>
                        </div> */}

                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>

        <BillTripPrint
            printTripCode={tripPrint}
            setPrintTripCode={setTripPrint}
            printEnable={true} />
    </>)
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex' style={{ width: '2rem', height: '2rem' }}>
            <SlOptions
                className=''
                style={{ height: '100%' }} />
        </div>

    </a>
));