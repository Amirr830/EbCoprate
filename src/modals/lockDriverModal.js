import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";

import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { addDate, withoutTZ } from "../helper/dateHelper";
import toast from "../components/toast";
import { AxiosPrivate } from "../app/axiosPrivate";

export default function LockDriverModal(props) {
    useEffect(() => {
        setParams(initParams)
    }, [props.show])

    // var endpoints = useEndpoints()
    const handleClose = () => {
        props.onClose();
    }

    var initParams = {
        fromTime: new Date(),
        toTime: addDate(new Date(), 31536000000)
    }
    var [params, setParams] = useState({})

    var handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    var lockPress = () => {
        var loader = loaderModal.load()
        AxiosPrivate.post(endpoints.lock,
            {
                fromTime: withoutTZ(params?.fromTime),
                toTime: withoutTZ(params?.toTime),
                desc: params?.desc,
                smartCode: props?.person?.smartCode
            }
        ).then(res => {
            toast.Success(res?.data?.msg)
            props.onClose()
        }).finally(() => {
            loaderModal.close(loader)
        })

    }
    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            setParams(prevState => ({ ...prevState, [name]: value }))
        } catch (err) {
            console.log(err)
        }
    }
    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header" >
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />
                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 " dir="rtl" >
                    <div className="d-flex row g-2 w-100">
                        <h4 className="text-center ">
                            شما تصمیم به قفل کردن {props?.person?.firstName + ' ' + props?.person?.lastName} را دارید!!!
                        </h4>

                        <div className="col-12 col-sm-6 " >
                            <div className="d-flex flex-row align-items-center">
                                <label className="ps-2" >قفل شود از </label>
                            </div>

                            <DatePicker
                                inputClass='form-control'
                                containerStyle={{
                                    width: "100%"
                                }}
                                format="YYYY/MM/DD HH:mm:ss"
                                plugins={[

                                    <TimePicker position="bottom" />
                                ]}
                                calendar={persian}
                                locale={persian_fa}
                                onKeyDown={handleEnter}
                                onChange={(date) => {

                                    if (date)
                                        setParams(prevState => ({ ...prevState, fromTime: new Date(date.unix * 1000) }))


                                }}
                                value={params?.fromTime || ''}
                                calendarPosition="bottom-left"
                            />


                        </div>
                        <div className="col-12 col-sm-6 " >
                            <div className="d-flex flex-row align-items-center">
                                <label className="ps-2" >تا</label>
                                <label className="w-100 text-hover aPointer text-start opacity-50"
                                    onClick={(e) => {
                                        setParams(prevState => ({ ...prevState, toTime: addDate(new Date(), 3600000) }))
                                    }}>
                                    یک ساعت بعد
                                </label>
                            </div>

                            <DatePicker
                                inputClass='form-control'
                                containerStyle={{
                                    width: "100%"
                                }}
                                format="YYYY/MM/DD HH:mm:ss"
                                plugins={[
                                    <TimePicker position="bottom" />
                                ]}
                                calendar={persian}
                                locale={persian_fa}
                                onKeyDown={handleEnter}
                                onChange={(date) => {
                                    console.log(date)
                                    if (date)
                                        // new Date(date.unix * 1000)
                                        setParams(prevState => ({ ...prevState, toTime: new Date(date.unix * 1000) }))
                                    // context.apDispatch({
                                    //     ...context?.apState,
                                    //     birthDate: new Date(date.unix * 1000)
                                    // })

                                }}
                                value={params?.toTime || ''}

                                // value={context?.apState?.birthDate || ''}
                                calendarPosition="bottom-left"
                            />



                        </div>

                        <div className="col-12 " >
                            <div className="d-flex flex-row align-items-center">
                                <label className="ps-2" >شرح قفل</label>
                            </div>
                            <textarea type="text"
                                className="form-control"
                                placeholder="شرح قفل"
                                name="desc"
                                onKeyDown={handleEnter}
                                onChange={handleOnChange}
                                value={params?.desc || ''}
                            />
                        </div>
                        <button className='btn btn-success mt-5  h5 iranSansBold w-100' onClick={() => {
                            lockPress()
                        }}>قفل شود</button>

                    </div>
                </div>
            </Modal.Body>
        </Modal>



    </>)
}
