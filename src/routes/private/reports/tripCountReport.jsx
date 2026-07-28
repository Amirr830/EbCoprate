import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";

import endpoints from '../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../components/toast';
import Input from '../../../components/customeTag/input';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { dateTimeStr, hhmm, withoutTZ, yyyymmdd } from '../../../helper/dateHelper';
import { AxiosPrivate } from '../../../app/axiosPrivate';
import { IoIosCall } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCircle, FaInfoCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { Card } from 'react-bootstrap';
import { AxiosPublic } from '../../../app/axiosPublic';
import { blob2File } from '../../../helper/blob2File';
import ProgressBar from '../../../components/ProgressBar';
import TripInfo from '../../../modals/TripInfo';
import gold from '../../../assets/drawable/gold.png'
import silver from '../../../assets/drawable/silver.png'
import bronze from '../../../assets/drawable/bronze.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setComma } from '../../../helper/numberHelper';

export default function TripCountReport() {

    var [reports, setReports] = useState([]);

    var [isLoad, setLoading] = useState(true)
    var [params, setParams] = useState({

        fromTime: new Date(),
        toTime: new Date()
    })


    useEffect(() => {
        getTripCount()
    }, [])
    var getTripCount = () => {
        setLoading(true)
        setReports([]);
        AxiosPrivate.get(endpoints.reportTripCount,
            {
                params: {
                    offset: 0,
                    ...params
                }
            }).then((res) => {
                setReports(res.data)
            }).finally(() => {
                setLoading(false)
            })
    }
    var [loadingExport, setLoadingExport] = useState(false)
    var getTripCountExport = () => {
        setLoadingExport(true)
        AxiosPrivate.get(endpoints.reportTripCount,
            {
                params: {
                    offset: -1,

                    ...params
                }, responseType: 'blob'
            }).then((res) => {
                // ایجاد URL از داده‌های blob دریافت شده
                const url = window.URL.createObjectURL(new Blob([res.data]));
                // ایجاد لینک دانلود
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.xlsx'); // نام فایل دانلودی
                document.body.appendChild(link);
                link.click();
                link.remove();
                // لغو Object URL برای آزادسازی حافظه
                window.URL.revokeObjectURL(url);
            }).finally(() => {
                setLoadingExport(false)
            })
    }


    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name

        setParams({
            ...params,
            [name]: value
        })
    }
    const handleEnter = (event) => {
        if (event.key.toLowerCase() == "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };



    return (
        <div className='h-100 d-flex flex-column'>
            <div className='row g-2 pb-3' id="2" style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-10 g-2  '>


                    <div className='col-6 col-md-4'>
                        <Input type="number"
                            className=" form-control"
                            placeholder="از کد راننده"
                            name="fromDriverCode"
                            value={params?.fromDriverCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4'>
                        <Input type="number"
                            className=" form-control"
                            placeholder="تا کد راننده"
                            name="toDriverCode"
                            value={params?.toDriverCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4'>
                        <Input type="number"
                            className=" form-control"
                            placeholder="از ایستگاه"
                            name="fromStCode"
                            value={params?.fromStCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>

                    <div className='col-6 col-md-4'>
                        <Input type="number"
                            className=" form-control"
                            placeholder="تا ایستگاه"
                            name="toStCode"
                            value={params?.toStCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4'>


                        <DatePicker
                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            className="rmdp-mobile"

                            format="YYYY/MM/DD"

                            calendar={persian}
                            locale={persian_fa}
                            onKeyDown={handleEnter}

                            onChange={(date) => {

                                if (date)
                                    date = new Date(date.unix * 1000)
                                else
                                    date = undefined
                                setParams(prevState => ({
                                    ...prevState,
                                    fromTime: date
                                }))


                            }}
                            placeholder='از تاریخ'
                            value={params?.fromTime || ''}
                            calendarPosition="bottom-left"
                        />

                    </div>
                    <div className='col-6 col-md-4'>
                        <DatePicker
                            className="rmdp-mobile"

                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            format="YYYY/MM/DD"

                            calendar={persian}
                            locale={persian_fa}
                            onKeyDown={handleEnter}
                            onChange={(date) => {

                                if (date)
                                    date = new Date(date.unix * 1000)
                                else
                                    date = undefined
                                setParams(prevState => ({
                                    ...prevState,
                                    toTime: date
                                }))

                            }}
                            placeholder='تا تاریخ'
                            value={params?.toTime || ''}
                            calendarPosition="bottom-left"
                        />

                    </div>
                </form>

                <div className='col-12 col-md-2'>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            getTripCount()
                        }} >جستجو</button>

                    {
                        loadingExport ?
                            <button className='btn btn-outline-success disabled col-12 mt-2'>
                                <ProgressBar />
                            </button> :
                            <button className='col-12 btn btn-success mt-2'
                                onClick={() => {
                                    getTripCountExport()
                                }} >خروجی Excel</button>
                    }

                </div>
            </div>
            <div className=' position-sticky h-100 bottom-0   overflow-auto a-scroll'>
                <TableView data={reports} />
            </div>
            {(isLoad) ?
                <div className='justify-content-center d-flex py-5' >
                    <div className="spinner-border" role="status" />
                </div> : <></>
            }


        </div >
    )
}

function TableView({ data }) {
    return <table className='col-12 table table-striped table-bordered'>
        <thead className='thead-dark'>
            <tr>
                <th width="30%">
                    تاریخ
                </th>
                <th width="10%">
                    کل
                </th>
                <th width="10%">
                    اعزام شده
                </th>
                <th width="10%">
                    لغو شده
                </th>
                <th width="10%">
                    تماسی
                </th>
                <th width="10%">
                    وب اپلیکیشن
                </th>
                <th width="10%">
                    اپلیکیشن
                </th>
                <th width="20%">
                    جمع مبالغ سفر
                </th>

            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => {
                return <tr>
                    <td>
                        {item?.saveDateStr}
                    </td>
                    <td>
                        {item?.totalCount}
                    </td>
                    <td>
                        {item?.successCount}
                    </td>
                    <td>
                        {item?.cancelCount}
                    </td>
                    <td >
                        <div className='d-flex'>
                            <span className='text-danger col-5 text-center' >{item?.fromCallCancel}</span>
                            <span className='col-1 text-center'>|</span>
                            <span className='text-success col-6 text-center'>{item?.fromCall}</span>
                        </div>

                    </td>
                    <td >
                        <div className='d-flex'>
                            <span className='text-danger col-5 text-center' >{item?.fromWebAppCancel}</span>
                            <span className='col-1 text-center'>|</span>
                            <span className='text-success col-6 text-center'>{item?.fromWebApp}</span>
                        </div>

                    </td>
                    <td >
                        <div className='d-flex'>
                            <span className='text-danger col-5 text-center' >{item?.fromNativeAppCancel}</span>
                            <span className='col-1 text-center'>|</span>
                            <span className='text-success col-6 text-center'>{item?.fromNativeApp}</span>
                        </div>
                    </td>

                    <td>
                        {setComma(item?.allPrice)}
                    </td>
                </tr>
            })}

        </tbody>
    </table >


}
