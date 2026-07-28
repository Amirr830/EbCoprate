import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "contexts/dashboardContext";

import endpoints from 'app/endpoints';
import Input from 'components/customeTag/input';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { AxiosPrivate } from 'app/axiosPrivate';

import LinesDropDown from 'components/dropdowns/linesDropDown';
import ProgressBar from 'components/ProgressBar';


export default function DriverTripCount() {
    var context = useContext(dashboardContext)
    var divScrollRef = useRef()

    var [data, setData] = useState([]);

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
        fromTime: new Date(new Date().setHours(0, 0, 0, 0)),
        toTime: new Date()
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
        if (isLoad && !isLoadLastRecord) {
            getData(false)
        }
    }, [isLoad])
    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

    var getData = (reset) => {
        if (reset) {
            setData([])
            setLoading(true)
        }
        AxiosPrivate.get(endpoints.reportDriverTripCount,
            {
                params: {
                    offset: reset ? 0 : data.length,
                    ...params
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

    var [loadingExport, setLoadingExport] = useState(false)
    var getDriverTripCountExport = () => {
        setLoadingExport(true)
        AxiosPrivate.get(endpoints.reportDriverTripCount,
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

    return (
        <div className=' h-100 d-flex flex-column'>

            <div className='row g-2 pb-3 sticky-top   ' style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-10 g-2  '>



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
                    <div className='col-6 col-md-3'>
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

                    <div className='col-6 col-md-3'>
                        <LinesDropDown
                            name="lineCode"
                            onChange={readChange}
                            value={params?.lineCode}
                        />
                    </div>
                    <div className='col-6 col-md-3'>
                        <Input type="number"
                            className="form-control"
                            placeholder="تعداد از"
                            name="fromTripCount"
                            value={params?.fromTripCount}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-3'>
                        <Input type="number"
                            className="form-control"
                            placeholder="تعداد تا"
                            name="toTripCount"
                            value={params?.toTripCount}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>


                </form>

                <div className='col-12 col-md-2'>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            getData(true)
                        }} >جستجو</button>
                    {
                        loadingExport ?
                            <button className='btn btn-outline-success disabled col-12 mt-2'>
                                <ProgressBar />
                            </button> :
                            <button className='col-12 btn btn-success mt-2'
                                onClick={() => {
                                    getDriverTripCountExport()
                                }} >خروجی Excel</button>
                    }

                </div>
            </div>

            <div className='position-sticky h-100 bottom-0 overflow-auto a-scroll' ref={divScrollRef}>
                <TableView data={data} />
            </div>
            {(isLoad && !isLoadLastRecord) ?
                <div className='justify-content-center d-flex py-5' >
                    <div className="spinner-border" role="status" />
                </div> : <></>
            }

        </div >
    )
}



function TableView({ data }) {
    return <table className='col-12 table table-striped table-bordered' style={{ minWidth: '50rem' }}>
        <thead className='thead-dark sticky-top'>
            <tr>
                <th width="2%">
                    ردیف
                </th>
                <th width="8%">
                    کد راننده
                </th>
                <th width="20%">
                    نام راننده
                </th>
                <th width="10%">
                    پلاک
                </th>
                <th width="10%">
                    نوع راننده
                </th>
                <th width="10%">
                    کد ملی
                </th>
                <th width="10%">
                    شماره همراه
                </th>

         
                <th width="10%">
                    <div className="d-flex w-auto  justify-content-center  align-items-center">
                        <p className='m-0 p-0'>لغو شده</p>
                        <p className='text-danger m-0 p-0 me-auto'> {data[0]?.totalCancelCount}</p>
                    </div>
                </th>
                <th width="15%">
                    <div className="d-flex w-auto  justify-content-center  align-items-center">
                        <p className='m-0 p-0'> کل سفرها</p>
                        <p className='text-danger m-0 p-0 me-auto'> {data[0]?.totalCount}</p>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => {
                return <tr>


                    <td>
                        {item?.rowNumber}
                    </td>

                    <td>
                        {item?.driverCode}
                    </td>
                    <td>
                        {item?.driverName}
                    </td>
                    <td>
                        {item?.plaque}
                    </td>
                    <td>
                        {item?.driverType}
                    </td>
                    <td>
                        {item?.natCode}
                    </td>
                    <td>
                        {item?.mobile}
                    </td>
                    <td>
                        {item?.cancelTripCount}
                    </td>
                    <td>
                        {item?.tripCount}
                    </td>

                </tr>
            })}

        </tbody>
    </table >


}
