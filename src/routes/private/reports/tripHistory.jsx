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
import { dateTimeStr, hhmm, hhmmss, withoutTZ, yyyymmdd } from '../../../helper/dateHelper';
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
import paths from '../../../app/paths.json'
import bronze from '../../../assets/drawable/bronze.png'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import TripDetails from './tripDetails/tdModal';
import StationsDropDown from 'components/dropdowns/stationsDropDown';
import NoResult from 'components/views/noResult';
import SearchList from 'components/views/searchList';
import Loading from 'components/views/loading';

export default function TripHistory() {
    var context = useContext(dashboardContext)

    var [trips, setTrips] = useState([]);
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

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const driverCode = queryParams.get('driverCode'); // "electronics"
    const fromTime = queryParams.get('fromTime');         // "2"
    const toTime = queryParams.get('toTime');    // "2"
    const stCode = queryParams.get('stCode');    // "2"



    var [isLoad, setLoading] = useState(false)
    var [params, setParams] = useState({
        showAccepted: true,
        showCanceled: true,
        showWaiting: true,
        driverCode,
        toTime: toTime ? new Date(Number.parseInt(toTime)) : undefined,
        fromTime: toTime ? new Date(Number.parseInt(fromTime)) : new Date(new Date().setHours(0, 0, 0, 0) - 86400000),
        oStCode: stCode
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
            if (trips.length > 0 || !driverCode )
                getTripHistory(false)
        }
    }, [isLoad])
    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

    var getTripHistory = (reset) => {
        console.log(endpoints.trip)
        console.log(reset, isLoad)
        if (reset) {
            setLoading(true)
            setLoadLastRecord(false)
            setTrips([]);
        }
        AxiosPrivate.get(endpoints.trip,
            {
                params: {
                    offset: reset ? 0 : trips.length,
                    ...params
                }
            }).then((res) => {
                setLoadLastRecord((res.data.length == 0 ? true : false))

                if (reset) {
                    setTrips(res.data)
                } else {
                    setTrips([...trips, ...res.data])
                }

            }).finally(() => {
                setLoading(false)

            })
    }
    var [loadingExport, setLoadingExport] = useState(false)
    var getTripHistoryExport = () => {
        setLoadingExport(true)
        AxiosPrivate.get(endpoints.trip,
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

    const navigate = useNavigate();

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


                    <div className='col-6 col-md-3 '>
                        <input type="text"
                            className=" form-control"
                            placeholder="شماره همراه"
                            name="mobile"
                            value={params?.mobile}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    {/* <div className='col-6 col-md-3 '>
                        <input type="text"
                            className=" form-control"
                            placeholder="شماره مشتری"
                            name="custCode"
                            value={params?.custCode}
                            onChange={readChange}

                            onKeyDown={handleEnter}
                        />
                    </div> */}

                    <div className='col-6 col-md-3'>
                        <Input type="number"
                            className=" form-control"
                            placeholder="شماره سفر"
                            name="tripCode"
                            value={params?.trackingCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-3'>
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


                        <StationsDropDown
                            name="oStCode"
                            value={params?.oStCode}
                            onChange={readChange}
                        />
                    </div>
                    <div className='col-6 col-md-3'>
                        <input type="text"
                            className=" form-control"
                            placeholder="جستجوی ترکیبی"
                            name="custName"
                            value={params?.custName}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-3 '>

                        <div className=' row gx-1 '>

                            <div className='col-5 '>

                                <input type="number"
                                    className=" form-control col-6 text-center"
                                    placeholder="---"
                                    name="p3"
                                    value={params?.p3}
                                    onChange={readChange}
                                    onKeyDown={handleEnter}
                                />
                            </div>
                            <div className='col-3 '>
                                <select
                                    className="form-control text-center p-0 py-1 "
                                    onChange={readChange}
                                    value={params?.ph}
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
                            <div className='col-4'>
                                <input type="number"
                                    className=" form-control text-center"
                                    placeholder="--"
                                    name="p2"
                                    value={params?.p2}
                                    onChange={readChange}
                                    onKeyDown={handleEnter}
                                />
                            </div>
                        </div>

                    </div>


                    <div className='col-6 col-md-3'>


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
                    <div className='col-6 col-md-3'>
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
                            getTripHistory(true)
                        }} >جستجو</button>

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

            <div className='position-sticky h-100 bottom-0   overflow-auto a-scroll' ref={divScroll}>
                {
                    trips.length > 0 ? <>
                        saf
                        <TableView trips={trips} />
                    </>
                        :
                        (isLoad && !isLoadLastRecord) ?
                            <SearchList /> : <NoResult />
                }
            </div>
            {
                trips.length > 0 ?
                    (isLoad && !isLoadLastRecord) ?
                        <Loading /> : <></>
                    : <></>
            }

        </div >
    )
}


function TableView({ trips }) {
    const navigate = useNavigate();

    var [column, setColumn] = useState([
        { id: 1, title: 'کدسفر', size: '3%' },
        { id: 2, title: 'وضعیت', size: '3%' },
        { id: 3, title: 'تاریخ', size: '3%' },
        { id: 31, title: 'ساعت ورود به صف', size: '4%' },
        { id: 4, title: 'ساعت تماس', size: '3%' },
        { id: 5, title: 'ساعت اعزام', size: '3%' },
        { id: 6, title: 'نام مشترک', size: '6%' },
        { id: 7, title: 'کد راننده', size: '11%' },
        { id: 8, title: 'نحوه دریافت', size: '3%' },
        { id: 9, title: 'نوع خودرو', size: '3%' },
        { id: 10, title: 'پلاک', size: '3%' },
        { id: 11, title: 'مبدا', size: '2%' },
        { id: 12, title: 'آدرس مبدا', size: '11%' },
        { id: 13, title: 'مقصد', size: '2%' },
        { id: 14, title: 'آدرس مقصد', size: '11%' },
        { id: 15, title: 'توضیحات', size: '11%' },
        { id: 16, title: 'نحوه درخواست', size: '4%' },
        { id: 17, title: 'کرایه سفر', size: '3%' },
        { id: 18, title: 'کرایه ثبتی', size: '3%' },
        { id: 19, title: 'توضیحات کرایه', size: '8%' },
        { id: 20, title: 'اپراتور', size: '5%' },
        { id: 21, title: 'گروه', size: '4%' },
        { id: 22, title: 'شیفت', size: '4%' },
        { id: 23, title: 'مسافت', size: '4%' },

        { id: 28, title: 'مدت سفر', size: '4%' },
        { id: 29, title: 'کد ملی راننده', size: '4%' },
        { id: 30, title: 'درصد هوشمند سازی', size: '4%' },

    ])
    const swapItems = (index1, index2) => {

        console.log(index1, index2)
        // ایجاد یک کپی از آرایه
        let newItems = [...column];


        // جابجایی آیتم‌ها
        let temp = newItems[index1];
        newItems[index1] = newItems[index2];
        newItems[index2] = temp;

        // به‌روزرسانی state
        setColumn(newItems);
    };

    return <table className='col-12 table table-striped table-bordered  table-hover' style={{ width: "250rem" }}>
        <thead className='thead-dark position-sticky top-0'>
            <tr>
                <th>
                </th>
                {
                    column.map((item, index) => {
                        return <th className='aPointer noSelect'

                            key={index}
                            onClick={(e) => {
                                if (column.length > index + 1)
                                    swapItems(index, index + 1);
                            }}
                            onContextMenu={(e) => {
                                if (0 < index - 1)
                                    swapItems(index, index - 1);
                                e.preventDefault()
                            }}>
                            {item.title}
                        </th>
                    })
                }
            </tr>

        </thead>

        <tbody>
            {trips.map((item, index) => {
                return <tr>
                    <td>
                        <a
                            href={paths.private.reports.tripDetails + `?tripCode=${item?.tripCode}`}
                            target="_blank"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            rel="noopener noreferrer"
                        >
                            <TripDetails tripCode={item?.tripCode}>
                                <FaInfoCircle className='m-0 p-0 aPointer text-hover' size={30} />
                            </TripDetails>
                        </a>



                    </td>
                    {
                        column.map((col, index) => {
                            switch (col.id) {
                                case 1:
                                    return <td>
                                        {item?.tripCode}
                                    </td>
                                case 2:
                                    return <td>
                                        <p className={item?.status == 6 ? 'text-danger p-0 m-0'
                                            : item?.status == 1 ? 'text-success p-0 m-0'
                                                : 'text-warning p-0 m-0'}>{item?.statusStr}</p>
                                    </td>
                                case 3:
                                    return <td>
                                        {yyyymmdd(item?.callDate)}
                                    </td>
                                case 4:
                                    return <td>
                                        {hhmmss(item?.callDate)}
                                    </td>
                                case 5:
                                    return <td>
                                        {hhmmss(item?.sendDate)}
                                    </td>
                                case 6:
                                    return <td>
                                        {
                                            item?.passengerStar == 3 ?
                                                <img src={gold} className={"m-0 p-0"}
                                                    style={{ height: '1.5rem', width: '1.5rem' }} />
                                                : item?.passengerStar == 2 ?
                                                    <img src={silver} className={"m-0 p-0"}
                                                        style={{ height: '1.5rem', width: '1.5rem' }} />
                                                    : item?.passengerStar == 1 ?
                                                        <img src={bronze} className={"m-0 p-0"}
                                                            style={{ height: '1.5rem', width: '1.5rem' }} />
                                                        : <></>

                                        }
                                        {item?.custName}
                                    </td>
                                case 7:
                                    return <td>
                                        {item?.driverCode} - {item?.drvName} {item?.drvFamily}
                                    </td>
                                case 8:
                                    return <td>
                                        {item?.acceptTypeStr}
                                    </td>
                                case 9:
                                    return <td>
                                        {item?.carType} {item?.carColor}
                                    </td>
                                case 10:
                                    return <td>
                                        {item?.plaque}
                                    </td>
                                case 11:
                                    return <td>
                                        {item?.originSt}
                                    </td>
                                case 12:
                                    return <td>
                                        {item?.originAddr}
                                    </td>
                                case 13:
                                    return <td>
                                        {item?.d1StCode}
                                    </td>
                                case 14:
                                    return <td>
                                        {item?.d1Address}
                                    </td>
                                case 15:
                                    return <td>
                                        {item?.defDesc}  {item?.sysDesc} {item?.tripDesc}
                                    </td>
                                case 16:
                                    return <td>
                                        {item?.agentTypeStr}
                                    </td>
                                case 17:
                                    return <td>
                                        {item?.tripPriceStr}
                                    </td>
                                case 18:
                                    return <td>
                                        {item?.finalPriceStr}
                                    </td>
                                case 19:
                                    return <td>
                                        {item?.priceDesc}
                                    </td>
                                case 20:
                                    return <td>
                                        {item?.opTel}
                                    </td>
                                case 21:
                                    return <td>
                                        {item?.groupName}
                                    </td>
                                case 22:
                                    return <td>
                                        {item?.shiftName}
                                    </td>
                                case 23:
                                    return <td>
                                        {item?.distance}
                                    </td>
                                case 24:
                                    return <td>
                                        {item?.trafficDuration}
                                    </td>

                                case 28:
                                    return <td>
                                        {item?.duration}
                                    </td>
                                case 29:
                                    return <td>
                                        {item?.natCode}
                                    </td>
                                case 30:
                                    return <td>
                                        {item?.extraFareStr}
                                    </td>
                                case 31:
                                    return <td>
                                        {item?.stRInTime}
                                    </td>
                            }
                        })
                    }

                </tr>
            })}

        </tbody>
    </table >



}
