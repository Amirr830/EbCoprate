import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";

import endpoints from '../../../app/endpoints';

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { dateTimeStr, hhmm, withoutTZ, yyyymmdd, yyyymmddhhmm } from '../../../helper/dateHelper';
import { AxiosPrivate } from '../../../app/axiosPrivate';

import StationsDropDown from 'components/dropdowns/stationsDropDown';
import SearchList from 'components/views/searchList';
import NoResult from 'components/views/noResult';
import Loading from 'components/views/loading';
import Input from 'components/customeTag/input copy';


export default function RFIDLogs() {
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

    var [isLoad, setLoading] = useState(false)
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
            if (data?.length > 0)
                getData(false)
        }
    }, [isLoad])
    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

    var getData = (reset) => {
        if (reset) {
            setData([])
            setLoading(true)
        }
        AxiosPrivate.get(endpoints.reportRFIDs,
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

    return (
        <div className=' h-100 d-flex flex-column'>

            <div className='row g-2 pb-3 sticky-top   ' style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-10 g-2  '>

                    <div className='col-6 col-md-3'>

                        <label>کد راننده</label>
                        <Input type="number"
                            className=" form-control"
                            placeholder="کد راننده"
                            name="driverCode"
                            value={params?.driverCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>

                    <div className='col-6 col-md-3'>

                        <label>کد ایستگاه</label>
                        <StationsDropDown
                            value={params?.stCode}
                            name="stCode"
                            onChange={readChange} />
                    </div>

                    <div className='col-6 col-md-3'>

                        <label>از تاریخ</label>

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
                        <label>تا تاریخ</label>

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

                <div className='col-12 col-md-2 align-items-end d-flex'>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            getData(true)
                        }} >جستجو</button>

                </div>
            </div>



            <div className='position-sticky h-100 bottom-0   overflow-auto a-scroll' ref={divScrollRef}>
                {
                    data.length > 0 ? <>
                        <TableView data={data} />
                    </>
                        :
                        (isLoad && !isLoadLastRecord) ?
                            <SearchList /> : <NoResult />
                }
            </div>
            {
                data.length > 0 ?
                    (isLoad && !isLoadLastRecord) ?
                        <Loading /> : <></>
                    : <></>
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
                <th width="20%">
                    کارت
                </th>
                <th width="20%">
                    نام راننده
                </th>
                <th width="8%">
                    کد راننده
                </th>
                <th width="10%">
                    کد ملی
                </th>
                <th width="10%">
                    ایستگاه
                </th>
                <th width="10%">
                    ساعت ثبت
                </th>
                <th width="10%">
                    ساعت عملیات
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
                        {item?.RFID}
                    </td>
                    <td>
                        {item?.drvName}
                    </td>
                    <td>
                        {item?.driverCode}
                    </td>
                    <td>
                        {item?.natCode}
                    </td>

                    <td>
                        {item?.stCode}
                    </td>
                    <td>
                        {yyyymmddhhmm(item?.saveTime)}
                    </td>
                    <td>
                        {yyyymmddhhmm(item?.actionTime)}
                    </td>


                </tr>
            })}

        </tbody>
    </table >


}
