import React, { useContext, useState, useEffect, useRef } from 'react'
import CompanyDropDown from 'components/dropdowns/companyDropDown'
import acContext from './addCarContext'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function CarInfo(props) {

    var context = useContext(acContext)

    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            if (name == 'phone' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'mobile' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'p2' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'p3' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'pIran' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'vinNum' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            if (name == 'chassisNum' && value.length > e.target.maxLength) {
                value = value.slice(0, e.target.maxLength)
            }
            console.log('AAAAAAAAA', context.acState)

            context.acDispatch({
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

    var plate2N = useRef()
    useEffect(() => {
        plate2N?.current?.focus()
    }, [])



    return (
        <>
            <div className='flex '>
                <div>
                    <form>
                        <div className="col-12 d-flex row ">
                            <div className="  p-1  col-12 " >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >شماره پلاک</h5>
                                </div>
                                <div className='d-flex row m-0 p-0' style={{ direction: 'ltr' }}>

                                    <div className='col-3 p-0 pe-1  m-0'>

                                        <input type="number"
                                            style={{ fontSize: '2rem' }}
                                            className="form-control text-center p-0"
                                            placeholder="- -"
                                            ref={plate2N}
                                            maxLength={2}
                                            value={context?.acState?.p2}
                                            onChange={handleOnChange}
                                            onKeyDown={handleEnter}
                                            name="p2" />
                                    </div>

                                    <div className='col-2 p-0 pe-1 ps-1 m-0'>

                                        <select
                                            style={{ fontSize: '2rem' }}
                                            className="form-control text-center p-0 "
                                            onChange={handleOnChange}
                                            value={context?.acState?.ph ? context?.acState?.ph : ''}
                                            defaultValue={''}
                                            name="ph">
                                            <option value={''}>-</option >
                                            <option value={'ب'}>ب</option >
                                            <option value={'ت'}>ت</option >
                                            <option value={'ج'}>ج</option >
                                            <option value={'س'}>س</option >
                                            <option value={'م'}>م</option >
                                            <option value={'ن'}>ن</option >
                                            <option value={'ه'}>ه‍</option >
                                            <option value={'ی'}>ی</option >
                                            <option value={'ص'}>ص</option >
                                            <option value={'ط'}>ط</option >
                                            <option value={'ق'}>ق</option >
                                            <option value={'ل'}>ل</option >
                                            <option value={'د'}>د</option >
                                            <option value={'و'}>و</option >
                                            <option value={'ژ'}>ژ</option >
                                        </select>

                                    </div>
                                    <div className='col-4 p-0 ps-1 m-0'>
                                        <input type="number"
                                            style={{ fontSize: '2rem' }}
                                            className="form-control text-center p-0"
                                            placeholder="- - -"
                                            maxLength={3}
                                            value={context?.acState?.p3}
                                            onChange={handleOnChange}
                                            onKeyDown={handleEnter}
                                            name="p3" />
                                    </div>
                                    <div className='col-3 p-0 ps-1 m-0'>
                                        <input type="number"
                                            className="form-control text-center p-0"
                                            placeholder="ایران"
                                            style={{ fontSize: '2rem' }}
                                            value={context?.acState?.pIran}
                                            onChange={handleOnChange}
                                            maxLength={2}
                                            onKeyDown={handleEnter}
                                            name="pIran" />
                                    </div>
                                </div>
                            </div>

                            <div className="  p-1  col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره شاسی</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره شاسی"
                                    name="chassisNum"
                                    maxLength={17}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.chassisNum}
                                />
                            </div>

                            <div className="  p-1  col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شناسه خودرو(vin)</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شناسه خودرو(vin)"
                                    maxLength={17}
                                    name="vinNum"
                                    onKeyDown={handleEnter}
                                    onChange={handleOnChange}
                                    value={context?.acState?.vinNum}
                                />
                            </div>

                            <div className=" p-1  col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره موتور</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره موتور"
                                    name="engineNum"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.engineNum}
                                />
                            </div>

                            <div className=" p-1 col-12 col-sm-3 " >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >سال ساخت</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="سال ساخت"
                                    name="buildYear"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.buildYear}
                                />



                            </div>

                            <div className=" p-1  col-12 col-sm-3" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >رنگ</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="رنگ"
                                    value={context?.acState?.color}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="color" />
                            </div>


                            <div className=" p-1  col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >برند خودرو</label>
                                </div>
                                <select
                                    className="form-control text-center"
                                    onChange={handleOnChange}
                                    value={context?.acState?.carType ? context?.acState?.carType : -1}
                                    defaultValue={-1}
                                    name="carType">
                                    <option
                                        value={-1}>
                                        انتخاب نشده
                                    </option>
                                    {props.carTypes.map((item, index) => {

                                        return (<option
                                            value={item?.tCode}
                                            key={index}
                                        >
                                            {item?.tName}
                                        </option>)

                                    })}
                                </select>

                            </div>

                            <div className=" p-1  col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >نوع سوخت</label>
                                </div>
                                <select
                                    className="form-control text-center"
                                    onChange={handleOnChange}
                                    value={context?.acState?.oilType ? context?.acState?.oilType : -1}
                                    defaultValue={-1}
                                    name="oilType">
                                    <option
                                        value={-1}>
                                        انتخاب نشده
                                    </option>
                                    <option
                                        value={1}>
                                        بنزینی
                                    </option>
                                    <option
                                        value={2}>
                                        دوگانه CNG
                                    </option>
                                    <option
                                        value={3}>
                                        دوگانه LPG
                                    </option>
                                    <option
                                        value={4}>
                                        دیزلی
                                    </option>
                                    <option
                                        value={5}>
                                        برقی
                                    </option>
                                    <option
                                        value={6}>
                                        هیبرید
                                    </option>

                                </select>

                            </div>

                            <div className=" p-1  col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >کلاس خودرو</label>
                                </div>
                                <select
                                    className="form-control text-center"
                                    onChange={handleOnChange}
                                    value={context?.acState?.classCode ? context?.acState?.classCode : -1}
                                    defaultValue={-1}
                                    name="classCode">
                                    <option
                                        value={-1}>
                                        انتخاب نشده
                                    </option>
                                    {props?.carClasses?.map((item, index) => {

                                        return (<option
                                            value={item?.classId}
                                            key={index}
                                        >
                                            {item?.className}
                                        </option>)

                                    })}
                                </select>

                            </div>


                            <div className="p-1 col-12 col-sm-6 d-none" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >تلفن همراه</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="تلفن همراه"
                                    maxLength="11"
                                    value={context?.acState?.carPhone}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="carPhone" />
                            </div>

                            <div className="p-1 col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شناسه دستگاه</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شناسه دستگاه"
                                    maxLength="16"
                                    value={context?.acState?.deviceId}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="deviceId" />
                            </div>
                            <div className="p-1 col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >کد شرکت</label>
                                </div>
                                <CompanyDropDown
                                    value={context?.acState?.companyCode}
                                    onChange={handleOnChange}
                                    name="companyCode"
                                />


                            </div>

                            <div className="p-1 col-12 col-sm-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره پروانه بهره بردار</label>
                                </div>
                                <input type="number"
                                    className="form-control"
                                    placeholder="شماره پروانه بهره بردار"
                                    value={context?.acState?.operatorLisenceNum}
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    name="operatorLisenceNum" />
                            </div>

                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >تاریخ اعتبار پروانه</label>
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
                                            context?.acDispatch({ ...context.acState, operatorLisenceDate: new Date(date.unix * 1000) })
                                    }}
                                    value={context?.acState?.operatorLisenceDate}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />

                            </div>
                        </div>
                    </form>

                </div>
                <button
                    className='btn btn-primary m-1'
                    onClick={() => {
                        context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep + 1 })
                    }}>
                    مرحله بعد
                </button>

            </div>
        </>
    )
}