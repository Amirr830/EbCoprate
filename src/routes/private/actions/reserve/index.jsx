import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../../contexts/dashboardContext";

import endpoints from '../../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../../components/toast';
import ReserveCard from './reserveCard';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { withoutTZ } from '../../../../helper/dateHelper';
import { AxiosPrivate } from '../../../../app/axiosPrivate';
import ProgressBar from '../../../../components/ProgressBar';
export default function Reserve() {
    var context = useContext(dashboardContext)

    var [reserveCount, setReserveCount] = useState([]);
    var [reserve, setReserve] = useState([]);
    var [currentReserve, setCurrentReserve] = useState(undefined);
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
        showAccepted: true,
        showCanceled: true,
        showWaiting: true
    })

    const onScroll = () => {
        if (divScrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = divScrollRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (isNearBottom) {
                console.log("Reached bottom");
                // DO SOMETHING HERE

                setLoading(true)
            }
        }
    };



    useEffect(() => {
        if (reserve.length > 0)
            setReserveCount(reserve[0].totalCount)
        else
            setReserveCount(0)
    }, [reserve])


    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

    useEffect(() => {
        if (isLoad && !isLoadLastRecord) {
            getReserve(false)
        }
    }, [isLoad])

    var getReserve = (reset) => {
        AxiosPrivate.get(endpoints.reserve,
            {
                params: {
                    offset: reset ? 0 : reserve.length,
                    ...params,
                    toTime: withoutTZ(params.toTime),
                    fromTime: withoutTZ(params.fromTime),
                    showAccepted: params?.showAccepted ? 1 : 0,
                    showCanceled: params?.showCanceled ? 1 : 0,
                    showWaiting: params?.showWaiting ? 1 : 0,
                }
            }).then((res) => {
                setLoadLastRecord((res.data.length == 0 ? true : false))

                if (reset) {
                    setReserve(res.data)
                } else {
                    setReserve([...reserve, ...res.data])
                }

            }).finally(() => {
                setLoading(false)
            })
    }
    var [loadingExport, setLoadingExport] = useState(false)

    var getReserveExport = () => {
        setLoadingExport(true)
        AxiosPrivate.get(endpoints.reserve,
            {
                params: {
                    offset: -1,
                    ...params,
                    toTime: withoutTZ(params.toTime),
                    fromTime: withoutTZ(params.fromTime),
                    showAccepted: params?.showAccepted ? 1 : 0,
                    showCanceled: params?.showCanceled ? 1 : 0,
                    showWaiting: params?.showWaiting ? 1 : 0,
                }, responseType: 'blob'
            }).then((res) => {
                // ایجاد URL از داده‌های blob دریافت شده
                const url = window.URL.createObjectURL(new Blob([res.data]));
                // ایجاد لینک دانلود
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'reserv-report.xlsx'); // نام فایل دانلودی
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
    var readCheckChange = (e) => {
        var value = e.target.checked
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

    var cancelReserve = (uuid) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            allowOutsideClick: true,
            title: 'آیا از لغو این رزرو اطمینان دارید',
            icon: 'warning',
            confirmButtonText: "لغو شود",
            denyButtonText: "فعلا نه",
            showDenyButton: true

        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                AxiosPrivate.delete(endpoints.reserve, {
                    data: { uuid: uuid }
                }).then((res) => {
                    toast.Success("با موفقیت لغو شد")
                    getReserve(true)
                })
            }

        })
        return MySwal;
    }

    var setAcceptReserve = (uuid, driverCode) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            allowOutsideClick: true,
            title: 'آیا از انتساب این سفر به راننده با شماره  ' + driverCode + ' اطمینان دارید',
            icon: 'warning',
            confirmButtonText: "بله",
            denyButtonText: "خیر",
            input: "text",
            inputPlaceholder: "توضیحات",
            showDenyButton: true

        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                AxiosPrivate.post(endpoints.reserve, { uuid: uuid, driverCode: driverCode, desc: result.value })
                    .then((res) => {
                        toast.Success("با موفقیت منتسب شد")
                        getReserve(true)
                    })
            }
        })
        return MySwal;
    }
    return (
        <div className=' h-100 d-flex flex-column'>
            <div className='row g-2  pb-3   '>

                <form className='row col-12  g-2  '>

                    <div className='col-4'>

                        <input type="text"
                            className="form-control"
                            placeholder="نام"
                            name="name"
                            value={params?.name}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-4 '>
                        <input type="text"
                            className=" form-control"
                            placeholder="شماره همراه"
                            name="mobile"
                            value={params?.mobile}
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-4 '>
                        <input type="text"
                            className=" form-control"
                            placeholder="شماره مشتری"
                            name="customerCode"
                            value={params?.customerCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>

                    <div className='col-4 '>
                        <input type="text"
                            className=" form-control"
                            placeholder="شماره پیگیری"
                            name="trackingCode"
                            value={params?.trackingCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>

                    <div className='col-4'>


                        <DatePicker
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
                                    fromTime: date
                                }))


                            }}
                            placeholder='از تاریخ'
                            value={params?.fromTime || ''}
                            calendarPosition="bottom-left"
                        />

                    </div>
                    <div className='col-4'>
                        <DatePicker
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
                    <div className='col-12 col-lg-6'>
                        <input type="text"
                            className=" form-control"
                            placeholder="مبدا"
                            name="originAddr"
                            value={params?.originAddr}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-12 col-lg-6'>
                        <input type="text"
                            className=" form-control"
                            placeholder="مقصد"
                            name="destAddr"
                            value={params?.destAddr}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>

                    <div className='col-4 '>
                        <input type="checkbox"
                            className=" form-check-input"
                            onChange={readCheckChange}
                            checked={params?.showAccepted}
                            name="showAccepted"

                            id="showAccepted"
                        />
                        <label className="form-check-label noSelect mx-2" htmlFor="showAccepted">
                            فقط تایید شده ها
                        </label>
                    </div>
                    <div className='col-4 '>
                        <input type="checkbox"
                            className=" form-check-input"
                            onChange={readCheckChange}
                            checked={params?.showCanceled}
                            name="showCanceled"
                            id="showCanceled"
                        />
                        <label className="form-check-label noSelect  mx-2" htmlFor="showCanceled">
                            فقط کنسل شده ها
                        </label>
                    </div>
                    <div className='col-4 '>
                        <input type="checkbox"
                            className=" form-check-input"
                            onChange={readCheckChange}
                            checked={params?.showWaiting}
                            name="showWaiting"

                            id="showWaiting"
                        />
                        <label className="form-check-label noSelect  mx-2" htmlFor="showWaiting">
                            فقط در انتظار ها
                        </label>
                    </div>


                </form>

                <div className='row g-2  mt-2'>
                    <div className='col-8'>

                        <button className='w-100 btn btn-warning '
                            onClick={() => {
                                getReserve(true)
                            }} >جستجو</button>
                    </div>
                    <div className='col-4 '>


                        {
                            loadingExport ?
                                <button className='btn btn-outline-success disabled col-12 '>
                                    <ProgressBar />
                                </button> :
                                <button className='col-12 btn btn-success '
                                    onClick={() => {
                                        getReserveExport()
                                    }} >خروجی Excel</button>
                        }
                    </div>

                </div>

            </div>


            <div className='row col-12'>
                <div className='row col-11  m-0 opacity-25 mt-3' >

                    <div className='row col-12 col-md-6 col-lg-4'>

                        <label className="iranSansBold px-2 text-end " style={{ width: '10rem' }} >
                            تعداد : {reserveCount}
                        </label>
                    </div>
                </div>
            </div>
            <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll' ref={divScrollRef}>

                <div className='row '>
                    {reserve.map((item, index) => {
                        return <div key={index} className='col-12 col-lg-6'>
                            <ReserveCard
                                reserve={item}
                                onCancel={(reserve) => {
                                    cancelReserve(reserve.reserveCode)
                                }}
                                onAccept={(driverCode, reserve) => {
                                    console.log(reserve.reserveCode, driverCode)
                                    setAcceptReserve(reserve.reserveCode, driverCode)
                                }}
                            />
                        </div>
                    })}
                </div>
            </div>

            {(isLoad && !isLoadLastRecord) ?
                <div className='justify-content-center d-flex py-5' >
                    <div className="spinner-border" role="status" />
                </div> : <></>
            }


        </div >
    )
} 