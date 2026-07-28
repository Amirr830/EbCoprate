import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'

import { IoCloseSharp } from "react-icons/io5";
import StationArea from "./stationArea";

export default function TripEditModal(props) {

    const handleClose = () => {
        props.onClose();
    }
    var [params, setParams] = useState(undefined)

    useEffect(() => {
        if (props?.data) {
            console.log(props?.data)
            setParams(props?.data)
        }
    }, [props?.data])

    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name

        setParams({
            ...params,
            [name]: value
        })
    }
    const handleEnter = (event) => {
        if (event.key.toLowerCase() == "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };
    var [showStationArea, setShowStationArea] = useState(undefined)

    return (<>
        <Modal show={props?.data} onHide={handleClose}
            size="sm"
            centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header" dir="rtl">
                <div className="d-flex  justify-content-start">
                    <IoCloseSharp className="aPointer text-danger" size={25}
                        onClick={handleClose} />

                </div>
                <form>

                    <div className="row g-2" >
                        <label className='col-4 '>آدرس مبدا</label>
                        <div className='col-8 '>
                            <input type="text"
                                className="form-control"
                                placeholder="آدرس مبدا"
                                name="originAddr"
                                value={params?.originAddr}
                                onChange={readChange}
                                onKeyDown={handleEnter} />
                        </div>

                        <label className='col-4'>ایستگاه مبدا</label>
                        <div className='col-8 '>
                            <input type="number"
                                className="form-control"
                                placeholder="کد ایستگاه"
                                name="originSt"
                                value={params?.originSt}
                                onChange={readChange}
                                onKeyDown={(event) => {
                                    if (event.key.toLowerCase() == " ") {

                                        setShowStationArea(params?.originSt)
                                        event.preventDefault();
                                    }
                                    handleEnter()
                                }}
                            />
                        </div>
                        <label className='col-4 '>آدرس مقصد</label>
                        <div className='col-8 '>
                            <input type="text"
                                className="form-control"
                                placeholder="آدرس مقصد"
                                name="d1Address"
                                value={params?.d1Address}
                                onChange={readChange}
                                onKeyDown={handleEnter} />
                        </div>

                        <label className='col-4'>ایستگاه مقصد</label>
                        <div className='col-8 '>
                            <input type="number"
                                className="form-control"
                                placeholder="کد ایستگاه"
                                name="d1StCode"
                                value={params?.d1StCode}
                                onChange={readChange}
                                onKeyDown={(event) => {
                                    if (event.key.toLowerCase() == " ") {
                                        setShowStationArea(params?.d1StCode)
                                        event.preventDefault();
                                    }
                                    handleEnter()
                                }} />
                        </div>

                        <label className='col-4'>توضیحات</label>

                        <div className='col-8 '>
                            <input type="text"
                                className="form-control"
                                placeholder="توضیحات"
                                name="dynamicDesc"
                                value={params?.dynamicDesc}
                                onChange={readChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <label className='col-4'>نام مشتری</label>

                        <div className='col-8 '>
                            <input type="text"
                                className="form-control"
                                placeholder="نام مشتری"
                                name="custName"
                                value={params?.custName}
                                onChange={readChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <label className='col-4'>شماره تماس</label>

                        <div className='col-8 '>
                            <input type="text"
                                className="form-control"
                                placeholder="شماره تماس"
                                name="custTel"
                                value={params?.custTel}
                                onChange={readChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <label className='col-4'>همراه</label>
                        <div className='col-8 '>
                            <input type="text"
                                className="form-control"
                                placeholder="شماره همراه"
                                name="custMobile"
                                value={params?.custMobile}
                                onChange={readChange}
                                onKeyDown={(event) => {
                                    if (event.key.toLowerCase() == "enter") {
                                        props.onEdit(params)
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>

                    </div>
                </form>
                <div className="row g-2 mt-2">
                    <div className="col">
                        <button className="btn btn-success  w-100" onClick={() => {
                            props?.onEdit(params)
                        }}>ویرایش</button>
                    </div>

                    <div className="col">
                        <button className="btn btn-danger  w-100" onClick={handleClose}>لغو</button>
                    </div>


                </div>

            </Modal.Body>
        </Modal>
        <StationArea
            stCode={showStationArea}
            onClose={() => {
                setShowStationArea(undefined)
            }} />
    </>)

}
