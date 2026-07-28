import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddPersonBody from '../addPerson'
import 'react-image-crop/dist/ReactCrop.css'
import PersonCard from "../personCard";
import loaderModal from "../../modals/loaderModal";
import axios from "axios";
import Storages from "../../app/storages";
import { FcSearch } from "react-icons/fc"
import AddPersonModal from "../../modals/addPersonModal";
import SearchPersonModal from "../../modals/searchPersonModal";
import acContext from './addCarContext'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { CgClose } from 'react-icons/cg'
import toast from "../toast";

export default function AddOwner(props) {

    var context = useContext(acContext)
    var [showSearchList, setShowSearchList] = useState(false)
    var [showSearchPerson, setShowSearchPerson] = useState(false)
    var [state, setState] = useState()

    const handleClose = () => {
        props.onClose();
        setShowSearchList(false)
    }

    var firstFocus = useRef()
    useEffect(() => {
        if (props.show)
            firstFocus.current.focus();
    }, [props.show])


    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            setState(prevState => ({
                ...prevState,
                [name]: value,
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

    return (<>
        <Modal show={props.show} onHide={handleClose} centered style={{ background: 'rgba(0, 0, 0, 0.400)' }}  >

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  row " dir="rtl">
                    <form>
                        <div className="row ">


                            <div className="col-4 p-1" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >شخص</h5>
                                </div>
                                <p
                                    className="form-control text-end m-0"
                                    placeholder=""
                                    name="natCode"
                                    ref={firstFocus}
                                    onKeyDown={handleEnter}
                                    onChange={handleOnChange}
                                    value={state?.person?.natCode}
                                    onClick={() => {
                                        setShowSearchPerson(true)
                                    }}
                                >
                                    {state?.person ?
                                        state?.person?.firstName + ' ' + state?.person?.lastName
                                        : 'انتخاب کنید'}
                                </p>
                                <p className='p-0 m-0 text-success pe-2' style={{ fontSize: '15px' }}>
                                    {state?.person
                                        ? '  کد ملی : ' + state?.person?.natCode
                                        : '.'}
                                </p>
                            </div>
                            
                            <div className=" p-1  col-4"  >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >ارتباط</h5>
                                </div>
                                <select
                                    // disabled={context?.acState?.lineCode && context?.acState?.lineCode != -1 ? false : true}
                                    className="form-control text-center"
                                    onChange={handleOnChange}
                                    value={state?.personType ? state?.personType : undefined}
                                    name="personType">
                                    <option
                                    >
                                        انتخاب کنید
                                    </option>
                                    <option
                                        value={1}
                                    >
                                        مالک
                                    </option>
                                    <option
                                        value={3}
                                    >
                                        کمکی
                                    </option>
                                    <option
                                        value={2}
                                    >
                                        بهره بردار
                                    </option>
                                </select>
                            </div>

                            <div className=" p-1  col-4" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >از تاریخ</h5>
                                </div>
                                <DatePicker
                                    inputClass='form-control'
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    calendar={persian}
                                    locale={persian_fa}
                                    onChange={(date) => {
                                        if (date)
                                            setState(prevState => ({ ...prevState, fromDate: new Date(date.unix * 1000) }))
                                    }}
                                    value={state?.toDate}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />

                            </div>

                        </div>
                    </form>
                    <button
                        className='btn btn-success w-100 my-1'
                        onClick={() => {
                            var owner = {
                                smartCode: state?.person?.smartCode,
                                firstName: state?.person?.firstName,
                                lastName: state?.person?.lastName,
                                mobile: state?.person?.mobile,
                                natCode: state?.person?.natCode,
                                fromDate: state?.fromDate,
                                toDate: state?.toDate,
                                type: state?.personType
                            }
                            if(!owner.smartCode)
                            {
                                return toast.Error('شخص را انتخاب کنید')
                            }
                            if(!owner.type)
                            {
                                return toast.Error('نوع ارتباط را انتخاب کنید')
                            }
                            if(!owner.fromDate)
                            {
                                return toast.Error('زمان شروع را انتخاب کنید')
                            }
                            props.onAdd(owner)
                        }}>
                        افزودن
                    </button>
                </div>

            </Modal.Body>

        </Modal>

        <SearchPersonModal
            onSelect={(person) => {
                setShowSearchPerson(false)
                setState(prevState => ({ ...prevState, person: person }))
            }}
            show={showSearchPerson}
            onClose={() => {
                setShowSearchPerson(false)
            }}
        />
    </>)
}
