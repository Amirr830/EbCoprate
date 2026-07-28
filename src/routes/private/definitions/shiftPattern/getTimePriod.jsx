import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import toast from "components/toast";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
export default function GetTimePriod(props) {

    var saveAction = () => {
        if (!params?.fromDate) {
            toast.Error("بازه زمانی را مشخص فرمایید")
            return
        }
        if (!params?.toDate) {
            toast.Error("بازه زمانی را مشخص فرمایید")
            return
        }



        setShow(false)
        props?.onAccept(params)

    }
    var [show, setShow] = useState(false)







    const handleShow = (e) => {
        setShow(true)
        setParams(undefined)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });



    var [params, setParams] = useState(undefined)


    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="md"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 " dir="rtl">


                <div>
                    <div className="row g-2" >
                        <h3>آیا از باز تولید شیفت ها بر اساس الگوی وارد شده اطمینان دارید؟</h3>
                        <p>دقت شود تمام شیفت های قبلی بایگانی و شیفت های جدید بر اساس الگوی وارد شده باز تولید میگردد لذا تاریخ شروع مبنای روز اول میباشد</p>
                        <div className="col-6">
                            <label>شروع از : </label>

                            <DatePicker
                                inputClass='form-control'
                                containerStyle={{
                                    width: "100%"
                                }}
                                className="rmdp-mobile"
                                format="YYYY/MM/DD"
                                calendar={persian}
                                locale={persian_fa}
                                onChange={(date) => {

                                    if (date)
                                        date = new Date(date.unix * 1000)
                                    else
                                        date = undefined
                                    setParams(prevState => ({
                                        ...prevState,
                                        fromDate: date
                                    }))
                                }}
                                placeholder='از تاریخ'
                                value={params?.fromDate || ''}
                                calendarPosition="bottom-left"
                            />

                        </div>
                        <div className="col-6">
                            <label>خاتمه تا : </label>

                            <DatePicker
                                inputClass='form-control'
                                containerStyle={{
                                    width: "100%"
                                }}
                                className="rmdp-mobile"
                                format="YYYY/MM/DD"
                                calendar={persian}
                                locale={persian_fa}
                                onChange={(date) => {

                                    if (date)
                                        date = new Date(date.unix * 1000)
                                    else
                                        date = undefined
                                    setParams(prevState => ({
                                        ...prevState,
                                        toDate: date
                                    }))
                                }}
                                placeholder='تا تاریخ'
                                value={params?.toDate || ''}
                                calendarPosition="bottom-left"
                            />
                        </div>

                        <div className="row g-2 p-0 m-0 pt-3 mt-2 ">

                            <div className="col-9">
                                <button className="btn btn-primary w-100"

                                    onClick={() => {
                                        saveAction()
                                    }}>
                                    بله
                                </button>
                            </div>

                            <div className="col-3">
                                <button className="btn btn-danger w-100"
                                    onClick={() => {
                                        setShow(false)
                                    }}>
                                    خیر
                                </button>
                            </div>
                        </div>

                    </div>
                </div>



            </Modal.Body>

        </Modal>
    </>)
}

