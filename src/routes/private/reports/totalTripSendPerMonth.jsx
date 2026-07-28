import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";
import { TbArrowsSort } from "react-icons/tb";
import ProgressBar from '../../../components/ProgressBar';

import endpoints from '../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../components/toast';
import Input from '../../../components/customeTag/input';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { dateTimeStr, hhmm, withoutTZ, yyyy, yyyymmdd } from '../../../helper/dateHelper';
import { AxiosPrivate } from '../../../app/axiosPrivate';
import { IoIosCall } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { Card } from 'react-bootstrap';
import { fa2En } from '../../../helper/numberHelper';
import LinesDropDown from 'components/dropdowns/linesDropDown';


export default function TotalTripSendPerMonth() {
    var context = useContext(dashboardContext)
    var [loadingExport, setLoadingExport] = useState(false)

    var [data, setData] = useState([]);
    var [sortDirection, setSortDirection] = useState(false);
    var [sortColumn, setSortColumn] = useState(0);
    var divScrollRef = useRef()

    useEffect(() => {
        var infiniteScroll = divScrollRef.current
        if (infiniteScroll) {
            infiniteScroll.addEventListener("scroll", onScroll);
            // Clean-up
            return () => {
                infiniteScroll.removeEventListener("scroll", onScroll);
            };
        }
    }, [])

    var [isLoad, setLoading] = useState(true)
    var [params, setParams] = useState({
        year: yyyy(new Date())
    })

    const onScroll = () => {
        if (divScrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = divScrollRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (isNearBottom) {
                // if (listCount > docs.length) {
                console.log("Reached bottom");
                // DO SOMETHING HERE
                setLoading(true)
                // }

            }
        }
    };


    useEffect(() => {
        getData(true)
    }, [sortColumn, sortDirection])

    useEffect(() => {
        if (isLoad && !isLoadLastRecord) {
            getData(false)
        }
    }, [isLoad])
    var [isLoadLastRecord, setLoadLastRecord] = useState(false);


    var getData = (reset) => {
        AxiosPrivate.get(endpoints.pointIOTotalTripMonth,
            {
                params: {
                    offset: reset ? 0 : data.length,
                    ...params,
                    sortColumn,
                    sortDirection: sortDirection ? 'ASC' : 'DESC'

                }
            }).then((res) => {
                setLoadLastRecord((res.data.length == 0 ? true : false))

                if (reset) {
                    setData(res.data)
                } else {
                    setData([...data, ...res.data])
                }

            }).finally(() => {
                setLoading(false)
            })
    }
    var getExcelExport = () => {
        setLoadingExport(true)

        AxiosPrivate.get(endpoints.pointIOTotalTripMonth,
            {
                params: {
                    offset: -1,
                    ...params,
                    sortColumn,
                    sortDirection: sortDirection ? 'ASC' : 'DESC'
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

                <form className='row col-12 col-md-8 g-2  '>

                    <div className='col-6 col-md-3'>
                        <LinesDropDown
                            value={params?.lineCode}
                            name="lineCode"
                            onChange={readChange}
                        />
                    </div>

                    <div className='col-6 col-md-3'>
                        <Input type="number"
                            className="form-control"
                            placeholder="از کد"
                            name="fromCode"
                            value={params?.fromCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-3'>
                        <Input type="number"
                            className="form-control"
                            placeholder="تا کد"
                            name="toCode"
                            value={params?.toCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>


                    <div className='col-6 col-md-3'>
                        <DatePicker
                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            onlyYearPicker
                            className="rmdp-mobile"
                            format="YYYY"
                            calendar={persian}

                            locale={persian_fa}
                            onKeyDown={handleEnter}
                            onChange={(date) => {
                                setParams(prevState => ({
                                    ...prevState,
                                    year: fa2En(date.year)
                                }))
                            }}
                            placeholder='تاریخ'
                            calendarPosition="bottom-left"
                        />
                    </div>

                </form>

                <div className='col-6 col-md-2'>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            getData(true)
                        }} >جستجو</button>
                </div>
                <div className='col-6 col-md-2'>
                    {

                        loadingExport ?
                            <button className='btn btn-outline-success disabled col-12 mt-2'>
                                <ProgressBar />
                            </button> :
                            <button className='col-12 btn btn-success mt-2'
                                onClick={() => {
                                    getExcelExport()
                                }} >خروجی Excel</button>
                    }
                </div>

            </div>

            <div className='position-sticky h-100 bottom-0   overflow-auto a-scroll' ref={divScrollRef}>
                <TableView data={data} onHeaderColumnClick={(column) => {
                    setSortDirection(!sortDirection)
                    setSortColumn(column)

                }} />
            </div>

            {(isLoad && !isLoadLastRecord) ?
                <div className='justify-content-center d-flex py-5' >
                    <div className="spinner-border" role="status" />
                </div> : <></>
            }


        </div >
    )
}

function TableView({ data, onHeaderColumnClick }) {

    var [selectColumn, setSColumn] = useState(0)
    var setSelectColumn = (column) => {
        onHeaderColumnClick(column)
        setSColumn(column)
    }
    return <table className='col-12 table table-striped table-bordered'>
        <thead className='thead-dark position-sticky  top-0' >
            <tr>
                <th width="15%">
                    نام خط
                </th>

                <th width="5%" onClick={() => { setSelectColumn(0) }}>
                    کد راننده
                    {(selectColumn == 0) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="8%">
                    پلاک
                </th>
                <th width="4%" onClick={() => { setSelectColumn(1) }}>
                    فروردین
                    {(selectColumn == 1) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(2) }}>
                    اردیبهشت
                    {(selectColumn == 2) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(3) }}>
                    خرداد
                    {(selectColumn == 3) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(4) }}>
                    تیر
                    {(selectColumn == 4) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(5) }}>
                    مرداد
                    {(selectColumn == 5) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(6) }}>
                    شهریور
                    {(selectColumn == 6) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(7) }}>
                    مهر
                    {(selectColumn == 7) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(8) }}>
                    آبان
                    {(selectColumn == 8) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(9) }}>
                    آذر
                    {(selectColumn == 9) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(10) }}>
                    دی
                    {(selectColumn == 10) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(11) }}>
                    بهمن
                    {(selectColumn == 11) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}
                </th>
                <th width="4%" onClick={() => { setSelectColumn(12) }}>
                    اسفند
                    {(selectColumn == 12) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}

                </th>
                <th width="4%" onClick={() => { setSelectColumn(13) }}>
                    کل
                    {(selectColumn == 13) ? <TbArrowsSort className='me-auto text-danger' size={15} /> : <></>}

                </th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => {
                return <tr>
                    <td>
                        {item?.lineName}
                    </td>

                    <td>
                        {item?.driverCode}
                    </td>
                    <td>
                        {item?.plaque}
                    </td>

                    <td>
                        {item?.sumMonth1}
                    </td>
                    <td>
                        {item?.sumMonth2}
                    </td>
                    <td>
                        {item?.sumMonth3}
                    </td>
                    <td>
                        {item?.sumMonth4}
                    </td>
                    <td>
                        {item?.sumMonth5}
                    </td>
                    <td>
                        {item?.sumMonth6}
                    </td>
                    <td>
                        {item?.sumMonth7}
                    </td>
                    <td>
                        {item?.sumMonth8}
                    </td>
                    <td>
                        {item?.sumMonth9}
                    </td>
                    <td>
                        {item?.sumMonth10}
                    </td>

                    <td>
                        {item?.sumMonth11}
                    </td>

                    <td>
                        {item?.sumMonth12}
                    </td>
                    <td>
                        {item?.sumAllMonth}
                    </td>





                </tr>
            })}

        </tbody>
    </table >


}
