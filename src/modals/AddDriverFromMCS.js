import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'

import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
import _ from 'lodash'

import toast from "../components/toast";

import Input from '../components/customeTag/input'

export default function AddDriverFromMCS(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.station)

    useEffect(() => {
        natCodeRef?.current?.focus();

        if (show) {
            // if (props?.station?.stCode) {
            // setLockField(true)
            // } else {
            // setLockField(false)
            // stationCheck()
            // }

        } else {
            props?.onClose()
        }
    }, [show])
    useEffect(() => {
        natCodeRef?.current?.focus();
        if (props?.show) {
            handleShow()
        }

    }, [props?.show])

    const addFromMCS = () => {
        if (!params?.natCode) {
            toast.Error("کد ملی را وارد نمایید")
            return
        }

        if (params?.natCode?.length < 10) {
            toast.Error("کد ملی را وارد نمایید")
            return
        }

        AxiosPrivate.post(endpoints.driverMCS,params)
            .then(res => {
                toast.Success(res.data.msg)
                setShow(false)
                props?.onClose()
            })
    }


    var submit = useRef()
    var natCodeRef = useRef()


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


    const handleShow = (e) => {
        setShow(true)
    };

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
            size={"md"}
            onHide={() => {
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 card p-3 " dir="rtl">

                <div className="row py-2">
                    <div className='col-4 text-center iranSansBold small '>
                        شماره ملی راننده :
                    </div>
                    <div className='col-8'>
                        <Input
                            type="number"
                            maxLength={10}
                            onKeyDown={(event) => {
                                if (event.key.toLowerCase() === "enter") {
                                    submit.current.focus();
                                }
                            }}
                            innerRef={natCodeRef}
                            className="form-control text-center"
                            placeholder="شماره ملی"
                            name="natCode"
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="col-4 mt-3 ">
                        <button className="btn btn-danger w-100" onClick={(e) => {
                            setShow(false)
                        }} >بستن</button>
                    </div>
                    <div className="col-8 mt-3 ">
                        <button className="btn btn-success w-100" ref={submit}
                            onClick={(e) => {
                                addFromMCS()
                            }}>افزودن</button>
                    </div>

                </div>
            </Modal.Body>

        </Modal>
    </>)
}
