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
import Input from "../components/customeTag/input";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { setComma ,extractNumber} from "../helper/numberHelper";
import toast from '../components/toast'

export default function AddPayment2Driver(props) {

    var [params, setParams] = useState({})
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

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    const handleClose = () => {
        props.onClose();
    }
    const getDriverBalance = (driverCode) => {
        AxiosPrivate.get(endpoints.driverBalance
            , { params: { driverCode: driverCode } }
        ).then(res => {
            setParams({ ...params, ...res?.data })
        })
    }
    const addP2D = () => {
        AxiosPrivate.post(endpoints.payment2Driver
            , { ...params, amount: extractNumber(params?.amount) }
        ).then(res => {
            toast.Success(res?.data?.msg)
            handleClose()
        })
    }

    useEffect(() => {
        setParams(props.show)
    }, [props.show])

    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <h1 className="ps-2 opacity-75 ms-auto me-auto" >پرداخت به راننده</h1>
                    <CgClose className="text-danger aPointer m-0  p-0" size={25} onClick={handleClose} />
                </div>
                <hr />
                <div className="justify-content-center align-items-center  d-flex flex-column w-100 " >
                    <div className="d-flex flex-column w-100" dir="rtl">
                        <form>
                            <div className="col-12 g-2 row ">
                                <div className="col-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >شماره فیش <label className="text-danger">*</label></label>
                                    </div>
                                    <Input type="text"
                                        className="form-control"
                                        placeholder="شماره فیش"
                                        name="docNo"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.docNo || ''}
                                    />
                                </div>
                                <div className="col-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >تاریخ واریز <label className="text-danger">*</label></label>
                                    </div>
                                    <DatePicker
                                        inputClass='form-control'
                                        containerStyle={{
                                            width: "100%"
                                        }}
                                        calendar={persian}
                                        locale={persian_fa}
                                        placeholder="تاریخ واریز"
                                        onKeyDown={handleEnter}
                                        onChange={(date) => {
                                            console.log(date)
                                            if (date)
                                                setParams({
                                                    ...params,
                                                    transactionDate: new Date(date.unix * 1000)
                                                })
                                        }}
                                        value={params?.transactionDate || ''}
                                        calendarPosition="bottom-left"
                                    />
                                </div>
                                <div className="col-6  " >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد راننده <label className="text-danger">*</label></label>
                                    </div>
                                    <Input type="number"
                                        className="form-control"
                                        placeholder="کد راننده"
                                        name="driverCode"
                                        onKeyDown={handleEnter}
                                        onBlur={(e) => {
                                            getDriverBalance(e.target.value)
                                        }}
                                        onFocus={() => {
                                            setParams(
                                                {
                                                    ...params,
                                                    carCode: null,
                                                    plaqueStr: null,
                                                    driverName: null,
                                                    balance: null
                                                }
                                            )
                                        }}
                                        onChange={handleOnChange}
                                        value={params?.driverCode || ''}
                                    />
                                </div>
                                <div className="col-6 " >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >مبلغ <label className="text-danger">*</label></label>
                                    </div>
                                    <Input
                                        thousandSeparator
                                        type="text"
                                        className="form-control"
                                        placeholder="مبلغ"
                                        name="amount"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.amount || ''}
                                    />
                                </div>
                                <div className="col-12 ">
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >مشخصات</label>
                                    </div>
                                    <div className="card px-2 py-1 noSelect " style={{ background: '#' }} disabled>
                                        <span className="d-flex">
                                            <label className="text-dark opacity-50 col-4 small  p-0 m-0 ">نام : </label>
                                            <label className="text-dark p-0 m-0 ">{params?.driverName} </label>
                                        </span>
                                        <span className="d-flex">
                                            <label className="text-dark opacity-50 col-4 small  p-0 m-0 ">کد خودرو : </label>
                                            <label className="text-dark p-0 m-0 ">{params?.carCode} </label>
                                        </span>
                                        <span className="d-flex">
                                            <label className="text-dark opacity-50 col-4 small  p-0 m-0 ">پلاک : </label>
                                            <label className="text-dark p-0 m-0 ">{params?.plaqueStr} </label>
                                        </span>
                                        <span className="d-flex mt-2">
                                            <label className="text-dark opacity-50 col-4 small  p-0 m-0 ">مانده حساب : </label>
                                            {params?.balance ?
                                                <span className={params?.balance <= 0 ? "text-success d-flex" : "text-danger d-flex"}>
                                                    <h4 className="iranSansBold  p-0 m-0 ">{setComma(Math.abs(params?.balance))}
                                                    </h4>

                                                    <p className="small px-2 iranSansBold">{params?.balance <= 0 ? 'ریال بستانکار' : 'ریال بدهکار'}</p>

                                                </span>
                                                : <></>}
                                        </span>

                                    </div>
                                </div>

                                <div className="col-12 " >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >توضیحات</label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="توضیحات"
                                        name="desc"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.desc || ''}
                                    />
                                </div>
                            </div>
                        </form>
                        <button className="btn btn-success mt-3 col" onClick={() => {
                            addP2D()
                        }}>
                            ثبت
                        </button>
                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>
    </>)
}
