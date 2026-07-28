import React, { useContext, useState, useEffect, useRef } from 'react'
import acContext from './addCarContext'
import Select from 'react-select';

import DatePicker, { Calendar, DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

import { MdWifiProtectedSetup } from 'react-icons/md'

import { FaUndoAlt } from 'react-icons/fa'
import { BiSolidArchiveIn } from 'react-icons/bi'
import SelectDateModal from '../../modals/selectDateModal'
import { yyyymmdd } from '../../helper/dateHelper'
import { AxiosPrivate } from '../../app/axiosPrivate';
import endpoints from '../../app/endpoints';
import CarLineHistoryModal from '../../modals/CarLineHistoryModal';


export default function LineInfo(props) {
    var context = useContext(acContext)
    var [showArchiveDate, setShowArchiveDate] = useState(false)
    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name

            context.acDispatch({
                ...context?.acState,
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



    useEffect(() => {
        setOptions(props?.carLines.map(line => ({
            value: line.lineCode,
            label: line.lineName
        })))
    }, [])

    var [options, setOptions] = useState([])
    var [lastState, setLastState] = useState(context?.acState)


    var autoGenerateCarLine = () => {

        AxiosPrivate.get(endpoints.carLineAuto, {
            params: {
                lineCode: context?.acState?.lineCode,
                suggestCode: context?.acState?.driverCode,
                buildYear: context?.acState?.buildYear,
                carType: context?.acState?.carType,
                classCode: context?.acState?.classCode
            },
        }).then((res) => {
            // console.log(res.data.driverCode)
            context.acDispatch({
                ...context?.acState,
                driverCode: res.data.driverCode
            })
        })
    }
    return (
        <>
            <div className='flex '>
                <div>
                    <form>
                        <div className=" d-flex row ">

                            <div className=" p-1  col-4"  >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >شماره خط</h5>
                                </div>
                                <Select
                                    value={options?.find(option => option.value === context?.acState?.lineCode)}
                                    onChange={(e) => {
                                        context.acDispatch({
                                            ...context?.acState,
                                            lineCode: e.value
                                        })
                                    }}
                                    options={options}
                                    isDisabled={!context?.acState?.toDate && lastState?.lineCode}
                                    placeholder="انتخاب کنید..."
                                    isSearchable={true} // فعال کردن جستجو
                                />

                            </div>

                            <div className=" p-1  col-4" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >کد در خط</h5>
                                </div>
                                <div className='d-flex flex-row-reverse align-items-center'>

                                    <input type="text"
                                        disabled={!context?.acState?.toDate && lastState?.lineCode}
                                        className="form-control"
                                        placeholder="کد در خط"
                                        name="driverCode"

                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={context?.acState?.driverCode}
                                    />
                                    {!context?.acState?.toDate && lastState?.lineCode ? <></> :
                                        <MdWifiProtectedSetup
                                            className=" position-absolute ms-3 aPointer text-hover"
                                            onClick={autoGenerateCarLine} />
                                    }
                                </div>


                            </div>

                            <div className=" p-1  col-3" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >از تاریخ </h5>
                                </div>
                                <DatePicker
                                    inputClass='form-control '
                                    disabled={!context?.acState?.toDate && lastState?.lineCode}
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    calendar={persian}
                                    locale={persian_fa}
                                    onChange={(date) => {
                                        if (date)
                                            context.acDispatch({
                                                ...context?.acState,
                                                fromDate: new Date(date.unix * 1000)
                                            })

                                    }}
                                    value={context?.acState?.fromDate}
                                    placeholder='--/--/----'
                                    calendarPosition="bottom-left"
                                />
                            </div>

                            <div className=" p-1  col-1" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >.</h5>
                                </div>
                                {!context?.acState?.toDate && lastState?.lineCode ?
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={new Date()}
                                        onChange={(date) => {
                                            context?.acDispatch({
                                                ...context?.acState,
                                                fromDate: undefined,
                                                lineCode: undefined,
                                                lineName: undefined,
                                                driverCode: '',
                                                toDate: new Date(date.unix * 1000)
                                            })
                                        }}
                                        render={(value, openCalendar) => {
                                            return (
                                                <button className='btn-warning btn m-0 p-0 p-1'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openCalendar()
                                                    }}>

                                                    <BiSolidArchiveIn className="aPointer  " size={20} style={{ width: '1.25rem' }} />
                                                </button>
                                            )
                                        }}>

                                    </DatePicker>

                                    : <button className='btn-success btn m-0 p-0 p-1'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            context?.acDispatch(
                                                {
                                                    ...context?.acState,
                                                    toDate: undefined,
                                                    lineCode: lastState?.lineCode,
                                                    driverCode: lastState?.driverCode,
                                                    fromDate: lastState?.fromDate

                                                })
                                        }}>
                                        <FaUndoAlt className="text-light aPointer " style={{ width: '1.25rem' }} size={15} />
                                    </button>}
                            </div>
                            {context?.acState?.toDate ?
                                <div className='col-12 p-1 '>
                                    <h6 className='card text-center bg-warning  py-1 opacity-75 '>
                                        کد {lastState?.driverCode} در خط {lastState?.lineCode} از تاریخ {yyyymmdd(lastState?.fromDate)} تا {yyyymmdd(context?.acState?.toDate)} بایگانی شد
                                    </h6>
                                </div>
                                : <></>}


                            {
                                context?.acState?.lineCode ?
                                    <>
                                        <div className=" p-1  col-6" >
                                            <div className="d-flex flex-row align-items-center">
                                                <h5 className="ps-2" >توضیحات</h5>
                                            </div>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="توضیحات"
                                                name="description"
                                                onChange={handleOnChange}
                                                onKeyDown={handleEnter}
                                                value={context?.acState?.description}
                                            />
                                        </div>
                                        <div className=" p-1  col-6" >
                                            <div className="d-flex flex-row align-items-center">
                                                <h5 className="ps-2" >شناسه واریز</h5>
                                            </div>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="شناسه واریز"
                                                name="trackingPayment"
                                                onChange={handleOnChange}
                                                onKeyDown={handleEnter}
                                                value={context?.acState?.trackingPayment}
                                            />
                                        </div>

                                        <div className=" p-1  col-6"  >
                                            <div className="d-flex flex-row align-items-center">
                                                <h5 className="ps-2" >صف</h5>
                                            </div>
                                            <select
                                                // disabled={context?.acState?.lineCode && context?.acState?.lineCode != -1 ? false : true}
                                                className="form-control text-center"
                                                onChange={handleOnChange}
                                                value={context?.acState?.queVoip ? context?.acState?.queVoip : -1}
                                                defaultValue={-1}
                                                name="queVoip">
                                                <option
                                                    value={-1}
                                                >
                                                    انتخاب نشده
                                                </option>

                                                {props?.queues?.map((item, index) => {
                                                    return <option
                                                        value={item.queueCode}
                                                        key={index}

                                                    >
                                                        {item.queueName}
                                                    </option>

                                                })}
                                            </select>

                                        </div>

                                        <div className=" p-1  col-6" >
                                            <div className="d-flex flex-row align-items-center">
                                                <h5 className="ps-2" >داخلی وویپ</h5>
                                            </div>
                                            <input type="number"
                                                className="form-control"
                                                placeholder="داخلی وویپ"
                                                name="sipNum"
                                                onChange={handleOnChange}
                                                onKeyDown={handleEnter}
                                                value={context?.acState?.sipNum}
                                            />
                                        </div>
                                    </> :
                                    <>
                                    </>
                            }

                        </div>
                    </form>

                </div>
                <div className='flex'>
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
                    <CarLineHistoryModal carCode={context?.acState?.carCode}>

                        <button
                            className='btn btn-danger m-1'
                        >
                            تاریخچه
                        </button>
                    </CarLineHistoryModal>

                </div>

            </div >

            <SelectDateModal
                show={showArchiveDate}
                onClose={() => {
                    setShowArchiveDate(false)
                }} />



        </>
    )
}














