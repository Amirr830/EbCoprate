import React, { useEffect, useState } from 'react'
// import './style.css'
import { MdOutlineTransitEnterexit } from "react-icons/md";
import { TbLogin } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { FaCarSide } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { FiInfo } from "react-icons/fi";
import StationsDropDown from 'components/dropdowns/stationsDropDown';
import Input from '../../../components/customeTag/input';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import toast from '../../../components/toast';
import { AxiosPrivate } from '../../../app/axiosPrivate';
import endpoints from '../../../app/endpoints';
import { hhmmss } from '../../../helper/dateHelper';
import { PiNumberCircleOneFill } from "react-icons/pi";
import { PiNumberCircleTwoFill } from "react-icons/pi";
import { TbBuildingBroadcastTower } from "react-icons/tb";
import { MdOutlinePublic } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import ProgressBar from '../../../components/ProgressBar';
import TurnOverAtTime from '../../../modals/turnOverAtTime';
import { FaTelegramPlane } from "react-icons/fa";

export default function DriverTimeLine() {
    var turns = '999,998,1253,8541'
    var [data, setDate] = useState([])
    var [isLoading, setLoading] = useState(false)
    var [params, setParams] = useState({
        fromTime: new Date(new Date().setHours(new Date().getHours() - 1)),
        toTime: new Date()
    })

    useEffect(() => {

    }, [])

    var getData = () => {
        if (!params.driverCode) {
            toast.Error("کد راننده را وارد کنید")
            return
        }
        setLoading(true)
        AxiosPrivate.get(endpoints.reportTimeLine, { params: params })
            .then(res => {
                setDate(res.data)
            }).finally(() => {
                setLoading(false)
            })
        console.log(params)
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
        <div dir='rtl' className=' h-100 d-flex flex-column '>


            <div className='row g-2 pb-3' style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-10 g-2  '>

                    <div className='col-6 col-md-4 d-none'>

                        <StationsDropDown
                            name="stCode"
                            onChange={readChange}
                        />
                    </div>

                    <div className='col-2 '>

                        <Input type="number"
                            className="form-control"
                            placeholder="کد"
                            name="driverCode"
                            value={params?.driverCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>


                    <div className='col-5'>


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
                    <div className='col-5'>
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

            {
                isLoading ? <ProgressBar /> :
                    <div className='d-flex flex-column  h-100 bottom-0 overflow-auto a-scroll' >

                        {data.map((item, index) => {
                            return <div key={index}>

                                <HistoryItem time={item?.time}>
                                    {
                                        item?.actionType == '1' ? (
                                            <PiNumberCircleOneFill size={30} className="text-dark" />
                                        ) : item?.actionType == '2' ? (
                                            <PiNumberCircleTwoFill size={30} className="text-secondary" />
                                        ) : item?.actionType == 'A' ? (
                                            <MdOutlinePublic size={30} className="text-secondary" />
                                        ) : item?.actionType == 'F' ? (
                                            <TbBuildingBroadcastTower size={30} className="text-secondary" />
                                        ) : item?.actionType == 'I' ? (
                                            <MdOutlineTransitEnterexit size={30} className="text-primary" />
                                        ) : item?.actionType == 'O' ? (
                                            <MdOutlineTransitEnterexit size={30} className="text-danger" style={{ transform: "rotate(180deg)" }} />
                                        ) : item?.actionType == 'N' ? (
                                            <IoCall size={25} className="text-success" />
                                        ) : item?.actionType == 'S' ? (
                                            <FaTelegramPlane size={30} className="text-warning" />
                                        ) : item?.actionType == 'C' ? (
                                            <MdOutlineCancel size={30} className="text-danger" />
                                        ) : (
                                            <MdOutlinePublic size={30} className="text-primary" />
                                        )
                                    }
                                    <div className='px-2 overflow-hidden w-75' >
                                        <div>
                                            <h4 className={item?.driverCode == params?.driverCode ? "p-0 m-0" : "p-0 m-0 "} style={{ color: item?.driverCode == params?.driverCode ? "#1A237E" : "#78909C" }}>{item.content}</h4>
                                        </div>
                                        <div className=' d-flex flex-wrap overflow-hidden py-2'>
                                            {item?.actionType == 'F' ? (
                                                item?.driverCode?.split(",")?.map((item, index) => {
                                                    return <div key={index} className='w-auto mb-0 m-1 my-2 position-relative opacity-75  ' >
                                                        <div className='card px-2'>
                                                            <strong>{item}</strong>

                                                        </div>
                                                    </div>
                                                })
                                            ) : <></>}
                                        </div>
                                    </div>
                                    <TurnOverAtTime stCode={item?.stCode} atTime={item?.time}>
                                        <FiInfo size={30} className="me-auto aPointer text-hover" />
                                    </TurnOverAtTime>
                                </HistoryItem>

                            </div>
                        })}
                    </div>

            }

        </div >
    )
}

function HistoryItem(props) {
    return <div className='d-flex '>
        <div className=' d-flex justify-content-end align-items-top mt-2 ' style={{ width: '8rem' }} >
            <div>
                <h3 className='p-0 m-0 iranSansBold text-secondary' >{hhmmss(props?.time)}</h3>
            </div>

        </div>
        <div style={{
            width: '1px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }} className="bg-dark mx-3">
            <GoDotFill className='mt-2 text-dark' size={30} />
        </div>

        <div className='col d-flex justify-content-start align-items-top  '>
            <div className='w-100 overflow-x-hidden'>
                <div className='card w-100 m-1 '>
                    <div className='d-flex p-2'>
                        {props?.children}
                    </div>
                </div>
            </div>
        </div>
    </div>

}

