import React, { useEffect, useRef, useState } from 'react'
import HorizentalDraggable from '../../../../components/horizentalDraggable'
import { TbBuildingBroadcastTower } from "react-icons/tb";
import { MdTripOrigin, MdOutlineModeStandby } from "react-icons/md";
import { FaCircleDot, FaCircle } from "react-icons/fa6";
import StationTurns from './stationTurns';
import TripManage from './tripManage';
import TripAssigned from './tripAssigned';
import { AxiosPrivate } from '../../../../app/axiosPrivate';
import endpoints from '../../../../app/endpoints';
import paths from '../../../../app/paths.json'
import { useNavigate } from "react-router-dom";
import TripManageHeader from './tripManageHeader';
import { FaSquare, FaAdd } from "react-icons/fa";
import ChannelChooser from '../../../../modals/tripMonit/ChannelChooser';
import { HiDotsVertical } from "react-icons/hi";
import TripCancelReq from './tripCancelReq';
import toast from '../../../../components/toast';
import answerModal from '../../../../modals/answerModal';
import { FaSearch } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import { SlOptions } from 'react-icons/sl'
import { CheckAccess } from "../../../../app/checkAccess";

import { LuCopyPlus } from "react-icons/lu";

import { IoClose } from "react-icons/io5";
import Storages from '../../../../app/storages';
import TripCancelOptions from '../../../../modals/tripMonit/tripCancelOptions';
import StationArea from '../../../../modals/tripMonit/stationArea';
import SearchCar from '../../../../modals/searchCar';
import LockStatusModal from '../../../../modals/lockStatusModal';
import TripMonitContext from '../../../../contexts/tripMonitContext';
import { TbRefresh } from "react-icons/tb";
import ProgressBar from '../../../../components/ProgressBar';
import DriversLocation from '../../reports/driversLocation';
import { FaEarthAmericas } from "react-icons/fa6";
import TripManageOptions from '../../../../modals/tripMonit/tripManageOptions';

export default function TripsMonit() {
    const navigate = useNavigate();
    var [channel, setChannel] = useState(undefined)
    var [showCollapsedTurns, setShowCollapsedTurns] = useState(false)
    var [showCollapsedTrip, setShowCollapsedTrip] = useState(true)
    var [isSyncLoading, setSyncLoading] = useState(false)
    var [showTop10FinishedTrip, setShowTop10FinishedTrip] = useState(true)
    var [monitData, setMonitData] = useState({})
    var [findTrip, setFindTrip] = useState(undefined)
    var sync = () => {
        setSyncLoading(true)
        if (channel)
            AxiosPrivate.get(endpoints.tripMonit, {
                params: {
                    channel: channel?.chId
                }
            }).then((res) => {
                // if (res.data.refreshStatus == 1) {
                setMonitData(res.data);
                // } else {
                //     setMonitData({ ...res.data, waitingTrip: monitData?.waitingTrip });
                // }
            }).finally(() => {
                setSyncLoading(false)
            })


    }


    var enableAutoFreeTrip = (v) => {
        if (channel)
            AxiosPrivate.put(endpoints.settingAutoFreeTrip, {
                autoFreeTripEnable: v
            }).then((res) => {
                if (res.data.status == 1) {
                    sync()
                }
            })
    }
    var [searchLoading, setSearchLoading] = useState(false)

    var search = () => {
        if (params?.driverCode == '' && params?.stCode == '') {
            toast.Error("برای جستجو کد ایستگاه یا کد راننده را وارد نمایید")
            return
        }

        setSearchLoading(true)
        AxiosPrivate.get(endpoints.trip, {
            params: {
                offset: 0,
                oStCode: params?.stCode,
                driverCode: params?.driverCode
            }
        }).then((res) => {
            setFindTrip(res.data);
        }).finally(() => {
            setSearchLoading(false)

        })
    }
    var closeSearch = () => {
        setFindTrip(undefined)
        setParams({
            driverCode: '',
            stCode: ''
        })
    }
    var [findDriver, setFindDriver] = useState(undefined)
    var findDriverInfo = () => {
        console.log(params?.driverCode)
        if (params?.driverCode == '') return
        if (!params?.driverCode) return
        AxiosPrivate.get(endpoints.car, {
            params: {
                offset: 0,
                driverCode: params?.driverCode
            }
        }).then((res) => {
            if (res?.data?.carCount > 0)
                setFindDriver(res.data?.list[0]);
        }).finally(() => {
            setSearchLoading(false)
        })
    }

    var [showChannelChooser, setShowChannelChooser] = useState(false)

    useEffect(() => {
        var lastChanel = Storages.getLastActiveChanel()
        if (!lastChanel) {
            if (!channel)
                setShowChannelChooser(true)
        } else {
            setChannel(lastChanel)
        }
    }, [])

    var [activeIndex, setActiveIndex] = useState()

    useEffect(() => {

        sync()
        const interval = setInterval(() => {
            sync()
        }, 8000)
        return () => {
            // 👇️ clear timeout when the component unmounts
            clearTimeout(interval);
        };
    }, [channel])

    var [showStation, setShowStation] = useState(false)
    var [currentOwner, setCurrentOwner] = useState(undefined)




    const monitRef = useRef();

    const scrollToItem = (index) => {
        monitRef.current.children[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    var onSetCancelTrip = (trip) => {
        var msg = 'آیا سفر آقای/خانم ' + trip?.custName + " به مبدا " + trip?.originAddr + " لغو شود؟"
        answerModal.show(msg, () => {
            AxiosPrivate.delete(endpoints.tripCancel, {
                data: { tripCode: trip?.tripCode }
            }).then((res) => {
                if (res?.data?.returnToTurn == 1) {
                    answerModal.show('آیا راننده به اولویت بازگردد؟', () => {
                        AxiosPrivate.put(endpoints.return2turn, { tripCode: trip?.tripCode })
                            .then((res) => {
                                toast.Success(res.data.msg)
                                sync()
                            })
                    })
                }
                toast.Success(res.data.msg)
                sync()
            })
        })
    }

    var [cancelReqFor, setCancelReqFor] = useState(undefined)
    useEffect(() => {
        // اضافه کردن رویداد گوش دهنده به document
        const handleKeyDown = (event) => {
            // کد مورد نظر شما برای اجرا هنگام فشردن کلید

            // F7
            if (event.keyCode === 118) {
                event.preventDefault();
                if (monitData.canceledReq.length > 0)
                    setCancelReqFor(monitData.canceledReq[0])
                return
            }

            //F8
            if (event.keyCode === 119) {
                event.preventDefault();
                navigate(paths.private.reports.tripHistory)
                return
            }

            //F9
            if (event.keyCode === 120) {
                event.preventDefault();
                navigate(paths.private.reports.driverLocation)
                return
            }

            if (event.keyCode == 9) {
                setCurrentFocus(undefined)
                return
            }

            if (currentFocus == 'waitingTrip') {
                if (activeIndex == undefined) {
                    setActiveIndex(0);
                }
                if (event.keyCode === 38 && activeIndex > 0 && activeIndex <= monitData?.waitingTrip?.length - 1) {
                    // کلید بالا
                    setActiveIndex(activeIndex - 1);
                    scrollToItem(activeIndex - 1)
                    return
                }
                if (event.keyCode === 40 && activeIndex >= 0 && activeIndex < monitData?.waitingTrip?.length - 1) {
                    // کلید پایین
                    setActiveIndex(activeIndex + 1);
                    scrollToItem(activeIndex + 1)
                    return
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        // تابع پاکسازی که هنگام حذف کامپوننت اجرا می‌شود
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });


    var [params, setParams] = useState(undefined)
    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))
        } catch (err) {
            console.log(err)
        }
    }


    // var handleFocus = (e) => {
    //     setTimeout(() => {
    //         setCurrentFocus(e.target.id)
    //     }, 300)
    // }

    var [showStationArea, setShowStationArea] = useState(undefined)
    var [showMapMode, setShowMapMode] = useState(false)

    var [currentFocus, setCurrentFocus] = useState()
    return (
        <TripMonitContext.Provider value={{
            sync,
            search,
            closeSearch
        }}>
            <div className='start-0 end-0 d-flex' onContextMenu={(e) => {
                e.preventDefault()

            }}>

                <div className='d-flex position-fixed p-0 m-0 start-0 end-0 mx-3'
                    style={{ bottom: '3.5rem', top: '3rem' }} >

                    {/* بخش سمت راست */}
                    <div
                        className={(showStation ? ' col-12' : 'd-none d-lg-flex col-lg-3') + ' d-flex  position-relative '}
                        style={{ paddingBottom: '5.5rem' }} dir='ltr' >

                        {/*بخش ایستگاه ها  */}
                        <div className='card  col-12'  >
                            {showMapMode ?
                                <div className='overflow-auto position-sticky'>
                                    <DriversLocation minimal={true} onClose={() => {
                                        setShowMapMode(false)
                                    }} />
                                </div> : <>
                                    <div className="d-flex col-12 pb-2" dir='rtl'>
                                        <button className='btn btn-outline-dark mx-1 my-0 p-0 px-2 d-block d-lg-none'
                                            style={{ height: '1.5rem' }}
                                            onClick={() => {
                                                setShowStation(false)
                                            }}>
                                            سفرها
                                        </button>
                                        <FaEarthAmericas className='text-hover mx-2 mt-1 aPointer' size={25} onClick={() => { setShowMapMode(true) }} />

                                        <div className='me-auto ms-3'>
                                            <label className="noSelect iranSansBold ">
                                                تعداد : {monitData?.inStDriverCount}
                                            </label>
                                        </div>
                                    </div>

                                    <div className='overflow-auto aScroll' tabIndex="0">
                                        <StationTurns
                                            collapsed={showCollapsedTurns}
                                            data={monitData?.stationTurns} />
                                    </div></>
                            }
                        </div>

                        {/* بخش جستجو */}
                        <div className='position-absolute bottom-0 start-0 end-0 card  overflow-hidden  d-flex flex-row p-0 m-0 px-2'
                            tabIndex="0"
                            style={{ height: '5.2rem' }}>
                            <div className='col-2 py-2 pe-1 h-100 ' >

                                {
                                    searchLoading ?
                                        <div className='justify-content-center align-items-center card bg-outline-dark d-flex  h-100 ' >
                                            <div className="spinner-border " role="status" />
                                        </div> :
                                        findTrip ?
                                            <IoClose
                                                className='btn w-100 btn-danger h-100'
                                                title="لغو نمایش جستجو"
                                                size="20"
                                                onClick={() => {
                                                    closeSearch()

                                                }} />
                                            :
                                            <FaSearch
                                                className='btn w-100 btn-success h-100'
                                                title="جستجو سفر"
                                                size="20"
                                                onClick={() => {

                                                    search()
                                                }} />
                                }
                            </div>

                            <div className='col-8  px-2 pt-2' dir='rtl'>
                                <div className='col-12  d-flex'>
                                    <input type="number"
                                        style={{ height: "1.8rem" }}
                                        className="form-control"
                                        placeholder="کد ایستگاه"
                                        name="stCode"
                                        value={params?.stCode}
                                        title="کد ایستگاه"
                                        onChange={handleOnChange}
                                        onContextMenu={(event) => {
                                            setShowStationArea(params?.stCode)
                                            event.preventDefault();
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key.toLowerCase() == "enter") {
                                                search()
                                                event.preventDefault();
                                            }
                                            if (event.key.toLowerCase() == " ") {
                                                setShowStationArea(params?.stCode)
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className='opacity-0'>..</span>
                                    <input type="number"
                                        style={{ height: "1.8rem" }}
                                        className="form-control "
                                        placeholder="کد راننده"
                                        name="driverCode"
                                        value={params?.driverCode}
                                        title="کد راننده"
                                        onKeyDown={(event) => {
                                            if (event.key.toLowerCase() == "enter") {
                                                search()
                                                event.preventDefault();
                                            }
                                        }}
                                        onBlur={(e) => {
                                            findDriverInfo()
                                        }}
                                        onFocus={(e) => {
                                            setFindDriver(undefined)
                                        }}
                                        onChange={handleOnChange}
                                    />
                                </div>
                                <div
                                    className='col-12 mt-1 text-center card'
                                    style={{ background: "rgb(223,223,223)" }}
                                    title="مشخصات خودرو"

                                >
                                    {findDriver?.owners[0]?.firstName} {findDriver?.owners[0]?.lastName} - {findDriver?.carTypeName} - {findDriver?.p2}{findDriver?.ph}{findDriver?.p3}
                                </div>
                            </div>


                            <div className='col-2 py-2 pe-1 h-100 ' >

                                {
                                    <LuCopyPlus className='btn w-100 btn-primary h-100'
                                        title="ثبت در ایستگاه"
                                        size="20"
                                        onClick={() => {
                                            if (params?.driverCode == '') {
                                                toast.Error("برای ثبت در ایتسگاه کد راننده را وارد کنید")
                                                return
                                            }
                                            if (params?.stCode == '') {
                                                toast.Error("برای ثبت در ایتسگاه کد ایستگاه را وارد کنید")
                                                return
                                            }
                                            AxiosPrivate.post(endpoints.stationTurn, {
                                                driverCode: params.driverCode,
                                                stCode: params.stCode
                                            }).then(res => {
                                                toast.Success(res?.data?.message)
                                                setParams({
                                                    driverCode: '',
                                                    stCode: ''
                                                })
                                                sync()
                                            })
                                        }} />
                                }
                            </div>
                        </div>

                    </div>

                    {/* فاصله بین دو بخش چپ و راست */}
                    <div className='opacity-0'>
                        ..
                    </div>

                    {/* بخش سمت چپ */}
                    <div className={(showStation ? 'd-none ' : 'd-flex col-12 col-lg-9') + ' d-flex col-12 col-lg-9  position-relative '} style={{ paddingBottom: (showTop10FinishedTrip || findTrip) ? '5.5rem' : '0rem' }}>
                        <div className='card  col-12'  >
                            {/* هدر بالای سفرهای ورودی */}
                            <div className="d-flex col-12 align-items-center justify-content-center py-2" dir='rtl'>
                                <div className="mx-2" >
                                    <TbRefresh
                                        size={25}
                                        onClick={(e) => {
                                            sync()
                                        }}
                                        className={isSyncLoading ? "aPointer text-hover rotating" : "aPointer text-hover"}
                                    />
                                </div>
                                <button className='btn btn-outline-dark mx-1 my-0 p-0 px-2'
                                    style={{ height: '1.5rem' }}
                                    onClick={() => {
                                        setShowChannelChooser(true)
                                    }}>
                                    {channel?.chName ? channel?.chName : "انتخاب بازه"}
                                </button>
                                <button className='btn btn-outline-dark mx-1 my-0 p-0 px-2 d-block d-lg-none'
                                    style={{ height: '1.5rem' }}
                                    onClick={() => {
                                        setShowStation(true)
                                    }}>
                                    ایستگاه ها
                                </button>

                                <div className="form-check form-switch">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="showTop10FinishedTrip"
                                        checked={showTop10FinishedTrip}
                                        onChange={(e) => {
                                            setShowTop10FinishedTrip(e?.target?.checked);
                                        }} />

                                </div>
                                <label className="form-check-label noSelect mx-2 "
                                    htmlFor="showTop10FinishedTrip">
                                    10سفرآخر
                                </label>
                                <div className='d-none d-lg-flex'>

                                    <div className="form-check form-switch">
                                        <input className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="autoFreeTrip"
                                            checked={monitData?.monitInfo?.autoFreeTripEnable == 1}
                                            onChange={(e) => {
                                                enableAutoFreeTrip(e?.target?.checked);
                                            }} />
                                    </div>
                                    <label className="form-check-label noSelect mx-2 "
                                        htmlFor="autoFreeTrip">
                                        آزاد سازی خودکار
                                    </label>



                                </div>
                                <button className='btn btn-outline-dark mx-1 my-0 p-0 px-2'
                                    style={{ height: '1.5rem' }}
                                    onClick={() => {
                                        // setShowChannelChooser(true)
                                    }}>
                                    {"اپراتور : "}{monitData?.opActiveCount}
                                </button>

                                <div className='me-auto ms-3 d-flex align-items-center justify-content-center'>

                                    <label className="noSelect iranSansBold px-2">
                                        تعداد : {monitData?.waitingTrip?.length}
                                    </label>

                                    <Dropdown className='' >
                                        <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={(e) => {
                                                navigate(paths.private.reports.tripHistory)
                                            }} >
                                                گزارش سفرها <span className='pe-5 fredoka'>(F8)</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => {
                                                navigate(paths.private.reports.driverLocation)

                                            }} >نمایش نقشه <span className='pe-5 fredoka'>(F9)</span>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => {
                                                navigate(paths.private.settings.tripManage)

                                            }} >تنظیمات سرویس دهی <span className='pe-5 fredoka'></span>
                                            </Dropdown.Item>

                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                            </div>
                            <hr className='m-0 p-0' />

                            {/* لیست سفرها */}
                            <div className='overflow-auto aScroll'
                                ref={monitRef}
                                id="waitingTrip">
                                <TripManageHeader />

                                {monitData?.waitingTrip?.map((item, index) => {
                                    return <div key={index} >
                                        <TripManage
                                            data={item}
                                            select={(activeIndex == index)}
                                            onSelect={() => {
                                                setActiveIndex(index)
                                            }}
                                            stationTurns={monitData?.stationTurns}
                                            refreshPage={() => { sync() }}
                                            collapse={showCollapsedTrip} />
                                    </div>
                                })}

                                {monitData?.canceledReq?.map((item, index) => {
                                    return <div key={index} className="opacity-0">
                                        <TripManage
                                            data={item}
                                        />

                                    </div>
                                })}
                            </div>

                            {/* لیست سفرهای لغو شده */}
                            <div className='position-absolute bottom-0 start-0 end-0 overflow-auto aScroll  ms-2' tabIndex="0">
                                {monitData?.canceledReq?.map((item, index) => {
                                    return <div key={index} >

                                        <TripManage
                                            data={item}

                                            stationTurns={monitData?.stationTurns}
                                            refreshPage={() => { sync() }}
                                        />

                                    </div>
                                })}
                            </div>

                        </div>

                        {
                            //لیست سفر های انتساب داده شده
                            showTop10FinishedTrip ?
                                <div className='position-absolute bottom-0 start-0 end-0 card  d-flex flex-row overflow-hidden '
                                    tabIndex="0"
                                    style={{ height: '5.2rem' }}>
                                    <HorizentalDraggable>
                                        <div className='d-flex flex-row  overflow-x-auto overflow-y-hidden '>
                                            <div className='w-auto p-1 justify-content-center align-items-center d-flex'  >
                                                <div className=' p-0 m-0 noSelect row ' style={{ width: '3.3rem' }}>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#A5D6A7' }} size={8} />اولویت</span>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#80DEEA' }} size={8} />آزاد</span>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#F48FB1' }} size={8} />لغو</span>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#E6EE9C' }} size={8} />حضوری</span>
                                                </div>
                                            </div>
                                            <div className="vr col-1 mx-2" />

                                            {monitData?.assignedTrip?.map((item, index) => {
                                                return <div key={index}>
                                                    <TripAssigned status={1} data={item} refreshPage={() => { sync() }} />
                                                </div>
                                            })}

                                        </div>
                                    </HorizentalDraggable>
                                </div>
                                : <></>
                        }

                        {
                            //لیست سفر های جستجو شده
                            findTrip ?
                                <div className='position-absolute bottom-0 start-0 end-0 card  d-flex flex-row overflow-hidden '
                                    tabIndex="0"
                                    style={{ height: '5.2rem' }}>
                                    <HorizentalDraggable>
                                        <div className='d-flex flex-row  overflow-x-auto overflow-y-hidden '>
                                            <div className='w-auto p-1 justify-content-center align-items-center d-flex'  >
                                                <div className=' p-0 m-0 noSelect row ' style={{ width: '3.3rem' }}>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#A5D6A7' }} size={8} />اولویت</span>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#80DEEA' }} size={8} />آزاد</span>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#F48FB1' }} size={8} />لغو</span>
                                                    <span className='col-12 p-0 m-0' style={{ fontSize: 12 }}><FaSquare className='ms-1' style={{ color: '#E6EE9C' }} size={8} />حضوری</span>
                                                </div>
                                            </div>
                                            <div className="vr col-1 mx-2" />

                                            {findTrip?.map((item, index) => {
                                                return <div key={index}>
                                                    <TripAssigned status={1} data={item} />
                                                </div>
                                            })}

                                        </div>
                                    </HorizentalDraggable>
                                </div>
                                : <></>
                        }

                    </div>

                </div >

                {/* راهنما */}
                <div className=' position-fixed p-0 m-0 start-0 end-0 mx-3  opacity-75 px-2 overflow-y-hidden overflow-x-auto hideScroll d-flex  '
                    style={{ bottom: '1.7rem', height: '1.7rem' }}>
                    <label className='iranSans'>راهنما :  </label>

                    <div className='p-0 m-0 px-2 mx-1 btn btn-outline-dark border border-dark disabled' style={{ minWidth: '7rem' }}>
                        <label className='  '>لغو سفر </label>
                        <label className='fredoka small me-3'>(F7)</label>
                    </div>
                    {CheckAccess(15) ?
                        <div className='p-0 m-0 px-2  mx-1 btn btn-outline-dark  border border-dark aPointer' style={{ minWidth: '8rem' }}
                            onClick={(e) => {
                                navigate(paths.private.reports.tripHistory)
                            }}>
                            <label className='aPointer'>گزارش سفرها</label>
                            <label className='fredoka small me-3 aPointer'>(F8)</label>
                        </div> : <></>
                    }
                    {CheckAccess(12) ?
                        <div className='p-0 m-0 px-2  mx-1 btn btn-outline-dark border border-dark aPointer'
                            style={{ minWidth: '6rem' }}
                            onClick={(e) => {
                                navigate(paths.private.reports.driverLocation)
                            }}>
                            <label className='aPointer'>نقشه</label>
                            <label className='fredoka small me-3 aPointer'>(F9)</label>
                        </div>
                        : <></>
                    }
                    {CheckAccess(60) ?

                        <div className='p-0 m-0 px-2  mx-1 btn btn-outline-dark border border-dark aPointer'
                            style={{ minWidth: '7.5rem' }}
                            onClick={(e) => {
                                navigate(paths.private.actions.messanger)
                            }}>
                            <label className='aPointer'>پیام رسان</label>
                            <label className='fredoka small me-3 aPointer'>(F10)</label>
                        </div> : <></>
                    }
                    {CheckAccess(21) ?
                        <div className='p-0 m-0 px-2  mx-1 btn btn-outline-dark border border-dark aPointer'
                            style={{ minWidth: '5rem' }}
                            onClick={(e) => {
                                navigate(paths.private.reports.driverTimeLine)
                            }}>
                            <label className='aPointer'>خط زمانی</label>
                        </div> : <></>
                    }
                    {CheckAccess(21) ?
                        <SearchCar onSelect={(person) => {
                            console.log(person)
                            setCurrentOwner(person)
                        }}>
                            <div className='p-0 m-0 px-2  mx-1 btn btn-outline-dark border border-dark aPointer'
                                style={{ minWidth: '5rem' }}>
                                <label className='aPointer'>قفل راننده</label>
                            </div>
                        </SearchCar>
                        : <></>
                    }

                    {CheckAccess(21) ?
                        <div className='p-0 m-0 px-2  mx-1 btn btn-outline-dark border border-dark aPointer'
                            style={{ minWidth: '8rem' }}
                            onClick={(e) => {
                                navigate(paths.private.reports.station)
                            }}>
                            <label className='aPointer'>گزارش ثبت ایستگاه</label>
                        </div>
                        : <></>
                    }


                </div>



                <ChannelChooser
                    show={showChannelChooser}
                    onChose={(channel) => {
                        Storages.setLastActiveChanel(channel)
                        setChannel(channel)
                    }}
                    onClose={() => {
                        setShowChannelChooser(false)
                    }}
                />

                <TripManageOptions
                    refreshPage={() => {
                        sync();
                    }}
                    data={cancelReqFor}
                    onClose={() => {
                        setCancelReqFor(undefined)
                    }} />

                <LockStatusModal
                    show={currentOwner}
                    person={currentOwner}
                    onClose={() => {
                        setCurrentOwner(undefined)
                    }} />

                <StationArea
                    stCode={showStationArea}
                    onClose={() => {
                        setShowStationArea(undefined)
                    }} />

            </div >
        </TripMonitContext.Provider>

    )
}




const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex' style={{ width: '2rem', height: '2rem' }}>
            <HiDotsVertical size={25}
                style={{ height: '100%' }} />
        </div>

    </a>
));