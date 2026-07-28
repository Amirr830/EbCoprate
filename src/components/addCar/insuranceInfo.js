import React, { useContext, useState, useEffect, useRef } from 'react'
import acContext from './addCarContext'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

import SearchPersonModal from '../../modals/searchPersonModal'
import loaderModal from '../../modals/loaderModal';
export default function InsuranceInfo() {
    var context = useContext(acContext)
    var [state, setState] = useState(context?.acState?.baseInfo)

    var [showSearchPerson, setShowSearchPerson] = useState(false)
    var [showSearchPersonFor, setShowSearchPersonFor] = useState('')
    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
      
            context?.acDispatch({
                ...context.acState,
                [name]: value
            })

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


    var insurNumRef = useRef()
    useEffect(() => {
        console.log(context?.acState?.baseInfo)
        insurNumRef.current.focus();
    }, [])

    return (
        <>
            <div className='flex '>
                <div>
                    <form>
                        <div className="col-12 d-flex row ">
                            <div className=" p-1  col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >کد یکتای بیمه شخص ثالث</h5>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="کد یکتای بیمه نامه"
                                    name="insuranceNum"
                                    onChange={handleOnChange}
                                    ref={insurNumRef}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.insuranceNum}
                                />
                            </div>

                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >تاریخ انقضای بیمه</h5>
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
                                            context?.acDispatch({ ...context.acState, insuranceDate: new Date(date.unix * 1000) })
                                    }}
                                    value={context?.acState?.insuranceDate}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />
                            </div>

                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >تاریخ انقضای معاینه فنی</h5>
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
                                            context?.acDispatch({ ...context.acState, technicalDate: new Date(date.unix * 1000) })

                                    }}
                                    value={context?.acState?.technicalDate}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />

                            </div>

                        </div>
                    </form>

                </div>
                <div className='flex '>
                    <button
                        className='btn btn-primary m-1'
                        onClick={() => {

                            context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep + 1 })
                        }}>
                        مرحله بعد
                    </button>
                    <button
                        className='btn btn-warning m-1'
                        onClick={() => {

                            context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep - 1 })
                        }}>
                        مرحله قبلی

                    </button>
                </div>

            </div>
            <SearchPersonModal
                onResult={(e) => {
                    setShowSearchPerson(false)
                    setState((prevState) => {
                        return { ...prevState, [showSearchPersonFor]: e }
                    })
                }}
                show={showSearchPerson}
                onClose={() => {
                    setShowSearchPerson(false)
                }}
            />
        </>
    )
}














