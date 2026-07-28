import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import { IoCloseSharp } from "react-icons/io5";
import endpoints from "../../app/endpoints";
import { AxiosPrivate } from "../../app/axiosPrivate";
import Turn from "../../components/Turn";
import { IoMdCloseCircle } from "react-icons/io";

import { RiErrorWarningFill } from "react-icons/ri";
import loaderModal from "../loaderModal";
import Input from "../../components/customeTag/input";
import _ from 'lodash'
import { FaSearch } from "react-icons/fa";
import toast from "../../components/toast";

export default function CheckDriverModal(props) {

    const handleClose = () => {
        setErrorList(undefined)
        setDriverInfo(undefined)
        setDriverCode(undefined)
        props.onClose();


    }
    var driverCodeInput = useRef()
    var [driverCode, setDriverCode] = useState()
    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name
        setErrorList(undefined)
        setDriverCode(value)
    }

    var [errorList, setErrorList] = useState(undefined);
    var [driverInfo, setDriverInfo] = useState(undefined);
    var [allowSetDriver, setAllowSetDriver] = useState(false);

    var tripAssign = (drCode) => {
        console.log(drCode)
        if (!drCode) {
            toast.Error('کد راننده وارد نشده است')
            return
        }
        console.log('ssssssssss',allowSetDriver,errorList)

        if (allowSetDriver) {
            return
        }
        var loader = loaderModal.show()
        AxiosPrivate.get(endpoints.tripAssign,
            {
                params: {
                    tripCode: props?.data?.tripCode,
                    driverCode: drCode,
                }
            }).then((res) => {
                loaderModal?.close(loader)
                handleClose()
                props?.refreshPage()


            })
    }
    var [loadCheckDriver, setLoadCheckDriver] = useState(false);

    var driverCheck = (drCode) => {
        setLoadCheckDriver(true)
        setErrorList(undefined)
        setDriverInfo(undefined)
        setAllowSetDriver(false)

        AxiosPrivate.get(endpoints.driverCheck,
            {
                params: {
                    tripCode: props?.data?.tripCode,
                    driverCode: drCode
                }
            }).then((res) => {

                setErrorList(res?.data?.errors)
                setDriverInfo(res?.data?.driverInfo)

                var s = res?.data?.errors.find((item) => item?.requireFix == 1)
                //بررسی میکنه که دکمه انتساب رو نمایش بده یا نه
                if (s)
                    setAllowSetDriver(true)
                else
                    setAllowSetDriver(false)

            }).finally(() => {
                setLoadCheckDriver(false)
            })
    }


    useEffect(() => {
        if (props?.data != undefined) {
            setErrorList(undefined)
            setDriverCode(undefined)
            setDriverInfo(undefined)
            getDriverStation(props?.data?.originSt)
        }
    }, [props?.data])

    var getDriverStation = (stCode) => {
        AxiosPrivate.get(endpoints.stationTurn,
            {
                params: {
                    stCode: stCode
                }
            }).then((res) => {
                if (res?.data?.list.length > 0) {
                    setTurns(res?.data?.list[0].turns)
                    setDriverCode(res?.data?.list[0].turns?.split(",")[0])
                } else
                    setTurns('')
            })
    }

    var [turn, setTurns] = useState('')

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            tripAssign(driverCode)
        }
    };


    // تابعی که می‌خواهید پس از تکمیل تایپ اجرا شود
    const doSomethingAfterUserHasStoppedTyping = (inputValue) => {
        console.log(`کاربر تایپ کردن را تمام کرد: ${inputValue}`);
        driverCheck(driverCode)
        // searchAddress(inputValue)
        // اینجا کد مورد نظر خود را قرار دهید
    };

    // استفاده از debounce برای تاخیر در اجرای تابع
    const debouncedDoSomething = _.debounce(doSomethingAfterUserHasStoppedTyping, 300);

    useEffect(() => {
        if (driverCode) {
            debouncedDoSomething(driverCode);
        }
        // لغو debounce در صورت unmount شدن کامپوننت
        return () => {
            debouncedDoSomething.cancel();
        };
    }, [driverCode]); // فقط زمانی اجرا می‌شود که مقدار value تغییر کند



    return (<>
        <Modal show={props?.data != undefined} size="sm"
            onHide={() => {
                handleClose()
            }}
            centered
            style={{ background: ' rgba(0, 0, 0, 0.400)' }} >

            <Modal.Body className="card-header" dir="rtl">
                {/* دکمه بستن  */}
                <div className="justify-content-start d-flex">
                    <IoCloseSharp className="aPointer text-danger  " size={25}
                        onClick={handleClose} />
                </div>

                <div className="justify-content-center align-items-center  d-flex row w-100 col-12 p-0 m-0 g-2" dir="rtl">
                    {/* لیست رانندگان حاضر در ایستگاه */}
                    <div className='w-100 row overflow-hidden h-100 g-2  '>
                        {
                            turn == '' ? <></> :
                                turn?.split(",")?.map((item, index) => {
                                    return <div key={index} className='col-3 mb-1 w-auto position-relative'
                                        onClick={() => {
                                            setDriverCode(item)
                                        }}>

                                        <Turn item={item} index={index} />

                                    </div>

                                })
                        }
                    </div>

                    {/* مقدار ورودی کد راننده */}
                    <div className='col-12 position-relative'>
                        <input type="number"
                            className="form-control"
                            placeholder="کد راننده"
                            name="driverCode"
                            autoComplete="off"
                            autoFocus
                            value={driverCode}
                            ref={driverCodeInput}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />

                        <FaSearch className="position-absolute start-0 top-50 translate-middle-y ms-3 aPointer text-hover"
                            onClick={() => {
                                driverCheck(driverCode, 0)
                            }} />

                    </div>

                    {loadCheckDriver ?
                        <div className="spinner-border " role="status">
                            <span className="sr-only"></span>
                        </div>
                        :
                        <>

                            {/* مشخصات راننده */}
                            {
                                driverInfo ?
                                    <div className="row mt-1 noSelect">
                                        <div className="d-flex m-0 p-0 col-12 ">
                                            <label className="small text-end p-0 m-0 iranSansBold ">{driverInfo?.carType}</label>
                                            <label className="small text-end p-0 m-0 me-auto opacity-75 ">{driverInfo?.plaque}</label>
                                        </div>
                                        <label className="small text-end p-0 m-0 opacity-75 "> {driverInfo?.drvName}</label>

                                    </div>
                                    :
                                    <></>
                            }
                            <div className="my-1">
                            </div>
                            {/* لیست خطاهای انتساب */}
                            {
                                errorList?.map((item, index) => {
                                    return <div className="card  my-1 noSelect"
                                        style={{ backgroundColor: (item.requireFix == 0 ? "#FBC02D" : "#E53935") }}
                                        key={index}>

                                        {item.requireFix == 1 ?
                                            <label className="text-end p-2 iranSansBold small text-white ">
                                                <IoMdCloseCircle
                                                    className="ms-2"
                                                    size={25}
                                                />

                                                {item.msg}

                                            </label>
                                            : <label className="text-end p-2 iranSansBold small text">
                                                <RiErrorWarningFill
                                                    className="ms-2"
                                                    size={25}

                                                />
                                                {item.msg}

                                            </label>
                                        }
                                    </div>
                                })
                            }
                            <div className="my-1">
                            </div>

                            {(!allowSetDriver && errorList) ?
                                <div className="col m-0 p-0">
                                    <button className="btn btn-success  col-12"
                                        // autoFocus={errorList != undefined}
                                        onClick={() => { tripAssign(driverCode) }}>
                                        <label className="iranSansBold small">انتساب</label>
                                    </button>
                                </div>
                                : <></>}
                        </>
                    }

                </div>

            </Modal.Body>

        </Modal>
    </>)
}
