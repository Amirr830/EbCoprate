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
import { FaCar, FaInfoCircle } from "react-icons/fa";
import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { Card } from 'react-bootstrap';
import StationsDropDown from 'components/dropdowns/stationsDropDown';
import paths from '../../../app/paths.json'
import SearchList from 'components/views/searchList';
import NoResult from 'components/views/noResult';
import Loading from 'components/views/loading';


export default function QueIO() {
    var context = useContext(dashboardContext)

    var [data, setData] = useState([]);
    var divScroll = useRef()

    useEffect(() => {
        var infiniteScroll = divScroll.current
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
        if (divScroll.current) {
            const { scrollTop, scrollHeight, clientHeight } = divScroll.current;
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
            setLoadLastRecord(false)

        }

        AxiosPrivate.get(endpoints.pointIOQueIO,
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
        <div className='h-100 d-flex flex-column'>

            <div className='row g-2 pb-3 sticky-top  ' style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-10 g-2  '>

                    <div className='col-6 col-md-4'>

                        <StationsDropDown
                            name="stCode"
                            value={params?.stCode}
                            onChange={readChange}

                        />

                    </div>

                    <div className='col-6 col-md-2'>
                        <Input type="number"
                            className="form-control"
                            placeholder="از کد"
                            name="fromCode"
                            value={params?.fromCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-2'>
                        <Input type="number"
                            className="form-control"
                            placeholder="تا کد"
                            name="toCode"
                            value={params?.toCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>


                    <div className='col-6 col-md-2'>


                        <DatePicker
                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            className="rmdp-mobile"

                            format="YYYY/MM/DD HH:mm:ss"
                            plugins={[
                                <TimePicker position="bottom" />
                            ]}
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
                    <div className='col-6 col-md-2'>
                        <DatePicker
                            className="rmdp-mobile"

                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            format="YYYY/MM/DD HH:mm:ss"
                            plugins={[
                                <TimePicker position="bottom" />
                            ]}
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
                            getData(true)
                        }} >جستجو</button>
                </div>
            </div>


            <div className='position-sticky h-100 bottom-0 overflow-auto a-scroll' ref={divScroll}>
                {
                    data.length > 0 ? <>
                        <TableView data={data} params={params} />
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



function TableView({ data, params }) {
    return <table className='col-12 table table-striped table-bordered'>
        <thead className='thead-dark position-sticky top-0'>
            <tr>
                <th width="15%">
                    نام خط
                </th>
                <th width="15%">
                    نام ایستگاه
                </th>
                <th width="15%">
                    پلاک
                </th>
                <th width="5%">
                    کد راننده
                </th>
                <th width="15%">
                    نام راننده
                </th>
                <th width="5%">
                    نوع راننده
                </th>
                <th width="5%">
                    تعداد سفر
                </th>
                <th width="3%">
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
                        {item?.stName}
                    </td>
                    <td>
                        {item?.plaque}
                    </td>
                    <td>
                        {item?.driverCode}
                    </td>
                    <td>
                        {item?.driverName}
                    </td>
                    <td>
                        {item?.driverType}
                    </td>
                    <td>
                        {item?.tripCount}
                    </td>
                    <td>
                        <a
                            href={paths.private.reports.tripHistory + `?stCode=${params?.stCode}&fromTime=${new Date(params?.fromTime).getTime()}&toTime=${new Date(params?.toTime).getTime()}&driverCode=${item?.driverCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInfoCircle className='m-0 p-0 aPointer text-hover' size={30} />
                        </a>
                    </td>


                </tr>
            })}

        </tbody>
    </table >


}
