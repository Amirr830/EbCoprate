import React, { useEffect,  useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";

import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {  withoutTZ } from "../helper/dateHelper";
import toast from "../components/toast";
import { AxiosPrivate } from "../app/axiosPrivate";

export default function UnlockDriverModal(props) {


    useEffect(() => {
        if (props.show)
            setParams(initParams)
    }, [props.show])

    const handleClose = () => {
        props.onClose();
    }

    var initParams = {
        fromTime: props?.data?.fromTime,
        toTime: props?.data?.toTime,
        lockDesc: props?.data?.lockDesc,
        unlockDesc: props?.data?.unlockDesc
    }
    var [params, setParams] = useState()

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };
    var savePress = () => {

        var loader = loaderModal.load()
        AxiosPrivate.put(endpoints.lock,
            {
                lockCode: props?.data?.lockCode,
                toTime: withoutTZ(params?.toTime),
                desc: params?.unlockDesc,
                archive: params?.archive ? 1 : 0
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
            console.log(e.target.checked)
            setParams(prevState => ({ ...prevState, [name]: value }))
        } catch (err) {
            console.log(err)
        }
    }
    const handleOnCheck = (e) => {
        try {

            var value = e.target.checked
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
                        <div className="col-12 col-sm-6 " >
                            <div className="d-flex flex-row align-items-center">
                                <label className="ps-2" >قفل شده از </label>
                            </div>

                            <DatePicker
                                disabled
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
                                        setParams(prevState => ({ ...prevState, fromTime: new Date(date.unix * 1000) }))


                                }}
                                value={params?.fromTime || ''}
                                calendarPosition="bottom-left"
                            />


                        </div>
                        <div className="col-12 col-sm-6 " >
                            <div className="d-flex flex-row align-items-center">
                                <label className="ps-2" >تا</label>
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
                                disabled
                                className="form-control"
                                placeholder="شرح قفل"
                                name="lockDesc"
                                onKeyDown={handleEnter}
                                value={params?.lockDesc || ''}
                            />
                        </div>
                        <div className="col-12 " >
                            <div className="d-flex flex-row align-items-center">
                                <label className="ps-2" >شرح باز شدن</label>
                            </div>
                            <textarea type="text"
                                className="form-control"
                                placeholder="شرح باز شدن "
                                name="unlockDesc"
                                onChange={handleOnChange}
                                onKeyDown={handleEnter}
                                value={params?.unlockDesc || ''}
                            />
                        </div>
                        <div >
                            <input className="form-check-input" type="checkbox" name="archive" onChange={handleOnCheck} />
                            <label className="mx-2" >
                                بایگانی شود
                            </label>
                        </div>
                        <button className='btn btn-success m-1 mt-3' onClick={() => {
                            savePress()
                        }}>ثبت شود</button>

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>)
}
