import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";

import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
import CheckBox from "../components/customeTag/checkBox";
import _ from 'lodash'

import toast from "../components/toast";
import CompanyDropDown from "components/dropdowns/companyDropDown";

export default function AddLine(props) {
    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.data)
    var [changeLock, setChangeLock] = useState(false)
    var [msg, setMsg] = useState(undefined)

    useEffect(() => {
        if (show) {
            if (props?.data?.lineCode) {
                setChangeLock(true)
            } else {
                lineCheck()
                setChangeLock(false)
            }
        }
    }, [show])

    var [sendLock, setSendLock] = useState(false)
    var lineCheck = (run) => {
        AxiosPrivate.get(endpoints.lineCheck, { params: { lineCode: params?.lineCode } })
            .then((res) => {
                setMsg(res?.data?.msg)

                if (res?.data?.status == 1) {
                    setParams(prevState => ({ ...prevState, lineCode: res?.data?.lineCode }))
                    setSendLock(false)
                } else {
                    toast.Error(res?.data?.msg)
                    setSendLock(true)
                }
            })
    }


    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))

        } catch (err) {
            console.log(err)
        }
    }

    const handleOnCheck = (e) => {
        try {
            var value = e.target.checked
            var name = e.target.name

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))
            console.log(value, name)

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

    const handleShow = (e) => {
        setShow(true)
        console.log(props?.station)
    };

    var onCheckChangeType = (e) => {
        var checked = e.target.checked
        var name = e.target.name
        setParams({
            ...params,
            [name]: checked ? 1 : 0
        })
    }

    var updateLine = (data) => {
        if (!data?.lineCode) {
            toast.Error("کد خط را وارد نمایید")
            return
        }
        if (!data?.lineName) {
            toast.Error("نام خط را وارد نمایید")
            return
        }
        if (!data?.lineType) {
            toast.Error("نوع خط را انتخاب نمایید")
            return
        }
        if (data?.lineType == -1) {
            toast.Error("نوع خط را انتخاب نمایید")
            return
        }
        if (!data?.companyCode) {
            toast.Error("شرکت را انتخاب نمایید")
            return
        }
        if (data?.companyCode == -1) {
            toast.Error("شرکت را انتخاب نمایید")
            return
        }
        var loader = loaderModal.load()
        AxiosPrivate.put(endpoints.line, data)
            .then((res) => {
                if (res?.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                    // getLines(loader)
                    setShow(false)
                    loaderModal.close(loader)
                    props?.afterClose()

                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });

    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="md"
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 " dir="rtl">

                <div className="row p-4">
                    <form className='row col-12 g-2 '>
                        <p className="text-danger iranSansBold text-center p-0 m-0">{msg}</p>

                        <div className='col-3 '>
                            <label>کد خط <label className="text-danger">*</label></label>
                            <input type="number"
                                className="form-control"
                                placeholder="کد خط"
                                name="lineCode"
                                disabled={changeLock}
                                value={params?.lineCode}
                                onBlur={() => {
                                    lineCheck()
                                }}
                                onChange={handleOnChange}
                                onKeyDown={handleEnter}
                            />

                        </div>
                        <div className='col-3'>
                            <label>پیش کد خط</label>

                            <input type="number"
                                className="form-control"
                                value={params?.preCodeDriver}
                                placeholder="پیش کد خط"
                                name="preCodeDriver"
                                onChange={handleOnChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <div className='col-6'>
                            <label>نام خط<label className="text-danger">*</label></label>

                            <input type="text"
                                className="form-control"
                                placeholder="نام خط"
                                value={params?.lineName}
                                name="lineName"
                                onChange={handleOnChange}
                                onKeyDown={handleEnter}
                            />
                        </div>

                        <div className='col-6'>
                            <label>نوع خط <label className="text-danger">*</label></label>
                            <select
                                className="form-control text-center  px-2"
                                onChange={(e) => {
                                    // var item = lineTypes.find(s => s.typeId == e.target.value)
                                    setParams(prevState => ({
                                        ...prevState,
                                        lineType: e.target.value

                                    }))
                                }}

                                value={params?.lineType ? params.lineType : null}
                                defaultValue={null}
                                name="lineType">
                                <option
                                    value={-1}
                                    className="text-end">
                                    انتخاب نشده
                                </option>
                                {props?.lineTypes?.map((item, index) => {
                                    return (<option
                                        value={item?.typeId}
                                        key={index}
                                        className="text-end"
                                    >
                                        {item?.typeId} - {item?.typeName}
                                    </option>)
                                })}
                            </select>


                        </div>

                        <div className='col-6'>
                            <label>کد شرکت<label className="text-danger">*</label></label>
                            <CompanyDropDown
                                onChange={handleOnChange}
                                value={params?.companyCode}
                                name="companyCode"
                            />


                        </div>

                        <div className='col-6'>
                            <label>مازاد کرایه</label>

                            <input type="number"
                                className="form-control"
                                placeholder="مازاد کرایه"
                                value={params?.extraFare}
                                name="extraFare"
                                onChange={handleOnChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <div className="col-12"></div>

                        <div className='col-6'>
                            <CheckBox title="اپ راننده فعال باشد"
                                name="activeDriverLogin"
                                checked={params?.activeDriverLogin == 1}
                                onChange={onCheckChangeType} />

                        </div>
                        <div className='col-6'>
                            <CheckBox title="سفر دربستی فعال باشد"
                                name="closeTripEnable"
                                checked={params?.closeTripEnable == 1}

                                onChange={onCheckChangeType} />

                        </div>
                        <div className='col-6'>
                            <CheckBox title="ثبت ایستگاه فعال باشد"
                                name="workInStationEnable"
                                checked={params?.workInStationEnable == 1}
                                onChange={onCheckChangeType} />

                        </div>
                        <div className='col-6 '>
                            <CheckBox title="سفر تلفنی فعال باشد"
                                name="telServiceEnable"
                                checked={params?.telServiceEnable}
                                onChange={onCheckChangeType} />

                        </div>
                        <div className='col-6'>
                            <CheckBox title="تاکسیمتر اشتراکی فعال باشد"
                                name="shareTripEnable"
                                checked={params?.shareTripEnable}
                                onChange={onCheckChangeType} />
                        </div>
                    </form>

                    <div className=" col-12 row g-2 p-0 m-0 mt-3">
                        <div className="col">
                            <button className="btn btn-success w-100 "
                                disabled={sendLock}
                                onClick={(e) => {
                                    updateLine(params)
                                }}>
                                ثبت
                            </button>
                        </div>
                        <div className="col">
                            <button className="btn btn-danger  w-100" onClick={(e) => setShow(false)}>
                                لغو
                            </button>
                        </div>

                    </div>

                </div>
            </Modal.Body>


        </Modal>
    </>)
}
