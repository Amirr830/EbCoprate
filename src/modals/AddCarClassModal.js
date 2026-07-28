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
import CheckBox from "../components/customeTag/checkBox";
import _ from 'lodash'

import toast from "../components/toast";


export default function AddCarClassModal(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.station)

    useEffect(() => {
        if (show) {
            // if (props?.station?.stCode) {
            // setLockField(true)
            // } else {
            // setLockField(false)
            // stationCheck()

            // }
        }
    }, [show])

    const updateSt = () => {
        if (!params?.stCode) {
            toast.Error("کد ایستگاه را وارد نمایید")
            return
        }
        if (!params?.stName) {
            toast.Error("نام ایستگاه را وارد نمایید")
            return
        }
        if (!params?.lat) {
            toast.Error("موقعیت ایستگاه را مشخص کنید")
            return
        }
        if (!params?.lng) {
            toast.Error("موقعیت ایستگاه را مشخص کنید")
            return
        }

        AxiosPrivate.put(endpoints.stations, params)
            .then(res => {
                console.log(res.data)
                toast.Success(res.data.msg)
                setShow(false)
                props?.onClose()
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

    function handleOnCheck(e) {
        try {
            var value = e.target.checked;
            var name = e.target.name;

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }));
            console.log(value, name);

        } catch (err) {
            console.log(err);
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

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });

    var item = {}


    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            onHide={() => {
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 card p-3 " dir="rtl">
               
                    <div className="d-flex flex-row">
                        <div>
                            <h3 className="iranSansBold p-0 m-0 " >{props?.carClass?.className}</h3>
                            <p className=" p-0 m-0 " >{props?.carClass?.classDesc}</p>
                        </div>

                        <div className="form-check form-switch h2 me-auto">
                            <input className="form-check-input "
                                type="checkbox"
                                checked={props?.carClass?.isActive == 1}
                                role="switch" />
                        </div>

                    </div>
                    <hr />
                    <CheckBox
                        className="my-2"
                        title="بار اضافه"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.moreLoadOption == 1}
                        name="displayForDriver" />
                    <CheckBox
                        title="نفر اضافه"
                        className="my-2"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.morePeopleOption == 1}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="در اختیار"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.disposalOption == 1}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="کولر"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.coolerOption == 1}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="بازگشت به مبدا"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.backToOriginOption == 1}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="توضیحات"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.descOption == 1}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="حداکثر تعداد مقصد"
                        onChange={handleOnCheck}
                        checked={false}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="توقف "
                        onChange={handleOnCheck}
                        checked={props?.carClass?.stopOption == 1}
                        name="displayForDriver" />
                    <hr />
                    <CheckBox
                        className="my-2"
                        title="قابلیت رزرو"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.reserveOption == 1}
                        name="displayForDriver" />

                    <CheckBox
                        className="my-2"
                        title="فقط رزرو"
                        onChange={handleOnCheck}
                        checked={props?.carClass?.justReserve == 1}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="فاصله بین دقایق رزرو"
                        onChange={handleOnCheck}
                        checked={false}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="رزرو از"
                        onChange={handleOnCheck}
                        checked={false}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="رزرو تا"
                        onChange={handleOnCheck}
                        checked={false}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="اخرین زمان رزرو"
                        onChange={handleOnCheck}
                        checked={false}
                        name="displayForDriver" />
                    <CheckBox
                        className="my-2"
                        title="حداکثر تعداد همراه"
                        onChange={handleOnCheck}
                        checked={false}
                        name="displayForDriver" />

            </Modal.Body>

        </Modal>
    </>)
}
