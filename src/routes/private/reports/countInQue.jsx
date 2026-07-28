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
import { FaCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { Card, ProgressBar } from 'react-bootstrap';
import StationsDropDown from 'components/dropdowns/stationsDropDown';
import StationTurns from '../../../modals/StationTurns';


export default function CountInQue() {
    var context = useContext(dashboardContext)

    var [data, setData] = useState([]);
    var [loadingExport, setLoadingExport] = useState(false);

    useEffect(() => {
        var infiniteScroll = context.divScrollRef.current
        if (infiniteScroll) {
            infiniteScroll.addEventListener("scroll", onScroll);
            // Clean-up
            return () => {
                infiniteScroll.removeEventListener("scroll", onScroll);
            };
        }
    }, [])

    var [isLoad, setLoading] = useState(true)
    var [params, setParams] = useState({})

    const onScroll = () => {
        if (context.divScrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = context.divScrollRef.current;
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
        if (isLoad && !isLoadLastRecord) {
            getData()
        }
    }, [isLoad])
    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

    var getData = () => {
        setData([])
        setLoading(true)
        AxiosPrivate.get(endpoints.reportStCountInQue,
            {
                params: {
                    ...params
                }
            }).then((res) => {
                setData(res.data)
            }).finally(() => {
                setLoading(false)
            })
    }

    var getTripHistoryExport = () => {
        setLoadingExport(true)
        AxiosPrivate.get(endpoints.reportStCountInQue,
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
            <div className='row g-2 pb-3 sticky-top  ' style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-8 g-2  '>
                    <StationsDropDown
                        name="stCode"
                        value={params?.stCode}

                        onChange={readChange}
                    />

                </form>

                <div className='col-12 col-md-2'>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            getData()
                        }} >جستجو</button>
                </div>
                <div className='col-12 col-md-2'>
                    {
                        loadingExport ?
                            <button className='btn btn-outline-success disabled col-12 mt-2'>
                                <ProgressBar />
                            </button> :
                            <button className='col-12 btn btn-success mt-2'
                                onClick={() => {
                                    getTripHistoryExport()
                                }} >خروجی Excel</button>
                    }
                </div>
            </div>
            <div className=' position-sticky h-100 bottom-0   overflow-auto a-scroll'>

                <TableView data={data} />

            </div>
            {(isLoad) ?
                <ProgressBar />
                : <></>
            }

        </div >
    )
}

function TableView({ data }) {
    return <table className='col-12 table table-striped table-bordered table-hover' >
        <thead className='thead-dark position-sticky top-0'>
            <tr>
                <th width="25%">
                    نام خط
                </th>
                <th width="25%">
                    نام ایستگاه
                </th>
                <th width="25%">
                    تعداد راننده
                </th>
                <th width="25%">
                    آخرین ورود راننده
                </th>

            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => {
                return <StationTurns stCode={item?.stCode}>
                    <tr className={item?.queCount == 0 ? 'table-danger aPointer' : 'table-success aPointer '}>
                        <td>
                            {item?.lineName}
                        </td>
                        <td>
                            {item?.stName}
                        </td>
                        <td>
                            {item?.queCount}
                        </td>
                        <td>
                            {item?.lastEnterInLine}
                        </td>
                    </tr>
                </StationTurns>
            })}
        </tbody>
    </table >


}
