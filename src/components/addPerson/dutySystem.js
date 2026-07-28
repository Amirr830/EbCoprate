import React, { useContext } from 'react'

import apContext from './addPersonContext'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function DutySystem() {
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

                            <div className="col-12 " >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >وضعیت</label>
                                </div>
                                <div className='form-control p-0 m-0 ps-3 pe-3 pt-2 pb-2 row g-2' >
                                    <label className="form-check-label   col-4 pe-3 noSelect aPointer">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="dutyStatus" checked={context?.apState?.dutyStatus == 1} value={1} onChange={handleOnChange} />
                                        معاف
                                    </label>
                                    <label className="form-check-label  col-4 pe-3 noSelect aPointer">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="dutyStatus" checked={context?.apState?.dutyStatus == 2} value={2} onChange={handleOnChange} />
                                        اتمام خدمت
                                    </label>
                                    <label className="form-check-label  col-4 pe-3 noSelect aPointer">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="dutyStatus" checked={context?.apState?.dutyStatus == 3} value={3} onChange={handleOnChange} />
                                        مشمول
                                    </label>

                                </div>



                            </div>
                            <div className=" col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره کارت </label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره کارت"
                                    name="dutyCardNum"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.dutyCardNum  || ''}
                                />
                            </div>




                            <div className=" col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >تاریخ خاتمه</label>
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
                                                dutyEndDate: new Date(date.unix * 1000)
                                            })
                                    }}
                                    value={context?.apState?.dutyEndDate  || ''}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />
                            </div>


                            <div className="col-8" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >وضعیت ایثارگری</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="وضعیت ایثارگری"
                                    name="dutyIsaar"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.dutyIsaar  || ''}
                                />
                            </div>
                            <div className="col-4" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >درصد جانبازی</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="درصد جانبازی"
                                    name="dutyIsaarPercent"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.dutyIsaarPercent  || ''    }
                                />
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














