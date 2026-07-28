import React, { useContext, useEffect } from 'react'

import apContext from './addPersonContext'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function PersonalInfo() {
    var doe = [{ deId: 1, deName: "زیر دیپلم" }, { deId: 2, deName: "دیپلم" }, { deId: 3, deName: "لیسانس" }, { deId: 4, deName: "فوق لیسانس" }, { deId: 5, deName: "دکتری" }]
    var context = useContext(apContext)
    // if (!state?.birthDate) {
    //     setState(prevState => { return { ...prevState, birthDate: new Date() } })
    // }
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
            if (name == 'education')
                value = JSON.parse(value)

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


    var getDegraee = () => {
        // axios.get(endpoints.educationDegree,
        //     {
        //         params: {}
        //     }).then((res) => {
        //         console.log(res.data)
        //         setDOE(res.data.result)
        //     }).catch((e) => {
        //         errorHandler(e)
        //     })
    }

    useEffect(() => {
        getDegraee()
    }, [])




    return (

        <>
            <div className='flex '>
                <div>
                    <form>
                        <div className="col-12 g-2 row ">
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >نام</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="نام"
                                    name="firstName"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.firstName || ''}
                                />
                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >نام خانوادگی</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="نام خانوادگی"
                                    name="lastName"
                                    onKeyDown={handleEnter}
                                    onChange={handleOnChange}
                                    value={context?.apState?.lastName || ''}
                                />
                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >نام پدر</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="نام پدر"
                                    name="fatherName"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.fatherName || ''}
                                />
                            </div>
                            <div className="col-12 col-sm-6 " >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >تاریخ تولد</label>
                                </div>
                                <DatePicker
                                    inputClass='form-control'
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    calendar={persian}
                                    locale={persian_fa}
                                    onKeyDown={handleEnter}
                                    onChange={(date) => {
                                        console.log(date)
                                        if (date)

                                            context.apDispatch({
                                                ...context?.apState,
                                                birthDate: new Date(date.unix * 1000)
                                            })

                                    }}
                                    value={context?.apState?.birthDate || ''}
                                    calendarPosition="bottom-left"
                                />


                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره شناسنامه</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="شماره شناسنامه"
                                    value={context?.apState?.birthCert || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="birthCert" />
                            </div>

                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره ملی</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="شماره ملی"
                                    value={context?.apState?.natCode || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="natCode" />
                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >محل تولد</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="محل تولد"
                                    value={context?.apState?.birthPlace || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="birthPlace" />
                            </div>

                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >مدرک تحصیلی</label>
                                </div>
                                <select
                                    className="form-select"
                                    onChange={handleOnChange}
                                    defaultValue={context?.apState?.education}
                                    name="education">
                                    {doe.map((item, index) => {
                                        return <option
                                            value={item.deId}
                                            key={index}>
                                            {item.deName}
                                        </option>
                                    })}
                                </select>

                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >تلفن همراه</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="تلفن همراه"
                                    maxLength="11"
                                    value={context?.apState?.mobile || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="mobile" />
                            </div>

                            <div className="col-12 col-sm-6 " >
                                <div className="d-flex flex-row align-items-cente r">
                                    <label className="ps-2" >تلفن ثابت</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="تلفن ثابت"
                                    value={context?.apState?.tel || ''}
                                    maxLength="11"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="tel" />
                            </div>



                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >جنسیت</label>
                                </div>
                                <div className='form-control p-0 m-0 ps-3 pe-3 pt-2 pb-2 d-flex flex-row' >
                                    <label className="form-check-label   col-6 pe-3">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="gender" checked={context?.apState?.gender == 0} value={0} onChange={handleOnChange} />
                                        زن
                                    </label>
                                    <label className="form-check-label  col-6 pe-3 ">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="gender" checked={context?.apState?.gender == 1} value={1} onChange={handleOnChange} />
                                        مرد
                                    </label>
                                </div>



                            </div>

                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >وضعیت تاهل</label>
                                </div>
                                <div className='form-control p-0 m-0 ps-3 pe-3 pt-2 pb-2 d-flex flex-row' >
                                    <label className="form-check-label   col-6 pe-3">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="married" checked={context?.apState?.married == 0} value={0} onChange={handleOnChange} />
                                        مجرد
                                    </label>
                                    <label className="form-check-label  col-6 pe-3 ">
                                        <input className="form-check-input  ms-2 me-2" type="radio" name="married" checked={context?.apState?.married == 1} value={1} onChange={handleOnChange} />
                                        متاهل
                                    </label>
                                </div>
                            </div>
                            <div className="col-12  " >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >آدرس : </label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="آدرس"
                                    value={context?.apState?.addr || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="addr" />
                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-cente r">
                                    <label className="ps-2" >کد پستی : </label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="کد پستی"
                                    value={context?.apState?.zipCode || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="zipCode" />
                            </div>
                            <div className="col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-cente r">
                                    <label className="ps-2" >برچسب : </label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="برچسب"
                                    value={context?.apState?.RFID || ''}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="RFID" />
                            </div>
                        </div>
                    </form>

                </div>
                <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                        context.apDispatch({ ...context?.apState, activeStep: context?.apState?.activeStep + 1 })
                    }}>
                    مرحله بعد
                </button>

            </div>
        </>
    )
}