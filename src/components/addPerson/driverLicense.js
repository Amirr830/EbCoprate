import React, { useContext, useState, useEffect } from 'react'
import apContext from './addPersonContext'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function DriverLicense() {
    var context = useContext(apContext)

    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name

            context.apDispatch({
                ...context?.apState,
                [name]: value
            })
        } catch (err) {
            console.log(err)
        }
    }
    const handleOnCheck = (e) => {
        try {
            var value = e.target.checked
            var name = e.target.name

            context.apDispatch({
                ...context?.apState,
                [name]: value,
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






    return (

        <>
            <div className='flex '>
                <div>
                    <form>
                        <div className=" row  g-2">
                            <div className=" col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره گواهینامه</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره گواهینامه"
                                    name="dlNum"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.dlNum || ''}
                                />
                            </div>




                            <div className=" col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >تاریخ صدور</label>
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
                                            context.apDispatch({
                                                ...context?.apState,
                                                dlIssueDate: new Date(date.unix * 1000)
                                            })
                                    }}
                                    value={context?.apState?.dlIssueDate || ''}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />
                            </div>
                            <div className="col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >مدت اعتبار (سال)</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="مدت اعتبار"
                                    name="dlDuration"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.dlDuration || ''}
                                />



                            </div>
                            <div className="col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >محل صدور</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="محل صدور"
                                    name="dlPlace"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.dlPlace || ''}
                                />
                            </div>
                            <div className="col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >محدودیت رانندگی</label>
                                </div>
                                <div className='form-control p-0 m-0 ps-3 pe-3 pt-2 pb-2 d-flex flex-row' >
                                    <label className="form-check-label   col-6 pe-3">
                                        <input className="form-check-input  ms-2 me-2" type="checkbox" name="hearing" checked={context?.apState?.hearing} onChange={handleOnCheck} />
                                        با سمعک
                                    </label>
                                    <label className="form-check-label  col-6 pe-3 ">
                                        <input className="form-check-input  ms-2 me-2" type="checkbox" name="glasses" checked={context?.apState?.glasses} onChange={handleOnCheck} />
                                        با عینک
                                    </label>
                                </div>
                            </div>








                        </div>
                    </form>

                </div>
                <div className='flex '>
                    <button
                        className='btn btn-primary m-1'
                        onClick={() => {
                            context.apDispatch({ ...context?.apState, activeStep: context?.apState?.activeStep + 1 })
                        }}>
                        مرحله بعد
                    </button>
                    <button
                        className='btn btn-warning m-1'
                        onClick={() => {
                            context.apDispatch({ ...context?.apState, activeStep: context?.apState?.activeStep - 1 })
                        }}>
                        قبلی
                    </button>
                </div>

            </div>
        </>
    )
}














