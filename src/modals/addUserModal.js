import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddPersonBody from '../components/addPerson'
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";
import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
import { CheckAccess } from "../app/checkAccess";
import CompanyDropDown from "components/dropdowns/companyDropDown";
import LinesDropDown from "components/dropdowns/linesDropDown";
import StationsDropDown from "components/dropdowns/stationsDropDown";
import toast from "../components/toast";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

export default function AddUserModal(props) {

    var [params, setParams] = useState({})
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
        props.onClose();
    }

    const saveUser = (userInfo) => {
        if (!userInfo?.companyCode) {
            toast.Error("شرکت را انتخاب کنید")
            return
        }
        if (!userInfo?.firstName) {
            toast.Error("نام را وارد کنید")

            return
        }

        if (!userInfo?.username) {
            toast.Error("نام کاربری را وارد کنید")

            return
        }
        if (!userInfo?.password) {
            toast.Error("کلمه عبور را وارد کنید")

            return
        }

        // var loader = loaderModal.load()
        console.log(endpoints.users, userInfo)
        AxiosPrivate.post(endpoints.users
            , userInfo
        ).then(res => {
            props.onSave()
        }).finally(() => {
            // loaderModal.close(loader)
        })
    }

    var [editable, setEditable] = useState(false)
    useEffect(() => {
        console.log(props.user)
        setParams(props?.user)
        setEditable(props?.user?.uid != undefined)
    }, [props.user])

    var [showPassword, setShowPassword] = useState(false)
    var [showPassSip, setShowPassSip] = useState(false)
    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 " >
                    <div className="d-flex flex-column w-100" dir="rtl">


                        <form>
                            <div className="col-12 g-2 row ">
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد کاربر</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="کد کاربر"
                                        name="uid"
                                        disabled={editable}
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.uid || ''}
                                    />
                                </div>

                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد شرکت <label className="text-danger">*</label></label>
                                    </div>

                                    <CompanyDropDown
                                        disabled={!CheckAccess(29)}
                                        onChange={handleOnChange}
                                        value={params?.companyCode}
                                        name="companyCode"

                                    />


                                </div>
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد خط</label>
                                    </div>

                                    <LinesDropDown
                                        onChange={handleOnChange}
                                        value={params?.lineCode}
                                        name="lineCode"

                                    />

                                </div>
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد ایستگاه</label>
                                    </div>
                                    <StationsDropDown
                                        onChange={handleOnChange}
                                        value={params?.defStCode}
                                        name="defStCode"

                                    />

                                </div>


                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >نام  <label className="text-danger">*</label></label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="نام"
                                        name="firstName"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.firstName || ''}
                                    />
                                </div>
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد ملی</label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="کد ملی"
                                        name="natCode"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.natCode || ''}
                                    />
                                </div>
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >نام کاربری <label className="text-danger">*</label></label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="نام کاربری"
                                        name="username"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.username || ''}
                                    />
                                </div>
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کلمه عبور <label className="text-danger">*</label></label>
                                    </div>
                                    <div className=" d-flex flex-row-reverse align-items-center">

                                        <input type={showPassword ? "text" : "password"}

                                            onChange={handleOnChange}
                                            value={params?.password || ''}
                                            onFocus={(e) => {
                                                e.target.select()
                                            }}
                                            // ref={password}
                                            className="form-control"
                                            name="password"
                                            placeholder="کلمه عبور"
                                        />
                                        <div className="position-absolute ms-3" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ?
                                                <AiOutlineEye className="text-dark" />
                                                :
                                                <AiOutlineEyeInvisible className="text-dark" />
                                            }
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >شماره همراه</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="شماره همراه"
                                        name="mobile"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        maxLength={11}
                                        value={params?.mobile || ''}
                                    />
                                </div>


                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >IP آدرس مجاز</label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="IP آدرس مجاز"
                                        name="ipFilter"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.ipFilter || ''}
                                    />
                                </div>
                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >معرف</label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="کد معرف"
                                        name="relation"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.relation || ''}
                                    />
                                </div>

                                <div className="col-12 col-sm-6" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >نام کاربری SIP</label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="SIP Username"
                                        name="userSip"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.userSip || ''}
                                    />
                                </div>
                                <div className="col-12 " >

                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کلمه عبور SIP</label>
                                    </div>
                                    <div className=" d-flex flex-row-reverse align-items-center">

                                        <input type={showPassSip ? "text" : "password"}

                                            onChange={handleOnChange}
                                            value={params?.passSip || ''}
                                            onFocus={(e) => {
                                                e.target.select()
                                            }}
                                            // ref={password}
                                            className="form-control"
                                            name="passSip"
                                            placeholder="کلمه عبور"
                                        />
                                        <div className="position-absolute ms-3" onClick={() => setShowPassSip(!showPassSip)}>
                                            {showPassSip ?
                                                <AiOutlineEye className="text-dark" />
                                                :
                                                <AiOutlineEyeInvisible className="text-dark" />
                                            }
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 " >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >آدرس</label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="آدرس"
                                        name="address"
                                        onKeyDown={handleEnter}
                                        onChange={handleOnChange}
                                        value={params?.address || ''}
                                    />
                                </div>

                                <div className="d-flex">
                                    <div class="form-check form-switch " >

                                        <input className="form-check-input aPointer "
                                            type="checkbox"
                                            role="switch"
                                            id="twoStepVerify"
                                            checked={params?.twoStepVerify}
                                            onChange={(e) => {
                                                setParams(prevState => ({
                                                    ...prevState,
                                                    twoStepVerify: e.target.checked
                                                }))
                                            }} />
                                    </div>
                                    <label className="form-check-label noSelect me-2 aPointer" htmlFor="twoStepVerify">
                                        تایید دو مرحله ای
                                    </label>
                                </div>
                                <div className="d-flex">
                                    <div class="form-check form-switch " >
                                        <input className="form-check-input aPointer "
                                            type="checkbox"
                                            role="switch"
                                            id="isUserActive"
                                            checked={params?.isArchive}
                                            onChange={(e) => {
                                                setParams(prevState => ({
                                                    ...prevState,
                                                    isArchive: e.target.checked
                                                }))
                                            }} />
                                    </div>
                                    <label className="form-check-label noSelect me-2 aPointer" htmlFor="isUserActive" >
                                        عدم فعالیت
                                    </label>
                                </div>
                                <div className="d-flex">
                                    <div class="form-check form-switch " >
                                        <input className="form-check-input aPointer "
                                            type="checkbox"
                                            role="switch"
                                            id="enablePanel"
                                            checked={params?.enablePanel}
                                            onChange={(e) => {
                                                setParams(prevState => ({
                                                    ...prevState,
                                                    enablePanel: e.target.checked
                                                }))
                                            }} />
                                    </div>
                                    <label className="form-check-label noSelect me-2 aPointer" htmlFor="enablePanel" >
                                        پنل وب
                                    </label>
                                </div>


                            </div>
                        </form>
                        <button className="btn btn-success mt-5 col" onClick={(e) => saveUser(params)}>
                            ثبت
                        </button>




                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>
    </>)
}
