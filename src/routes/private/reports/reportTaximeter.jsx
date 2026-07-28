import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";
import endpoints from '../../../app/endpoints';
import ReportTaximeterCard from '../../../components/reportTaximeterCard';
import { AxiosPrivate } from '../../../app/axiosPrivate';

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
export default function ReportTaximeter() {

    var context = useContext(dashboardContext)

    var [taximeters, setTaximeters] = useState([]);
    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

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
    var divScroll = useRef()

    var [isLoad, setLoading] = useState(true)
    var [params, setParams] = useState()

    const onScroll = () => {

        if (divScroll.current) {
            const { scrollTop, scrollHeight, clientHeight } = divScroll.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (isNearBottom) {
                console.log("Reached bottom", isLoadLastRecord);
                // DO SOMETHING HERE
                setLoading(true)
            }
        }
    };

    useEffect(() => {

        if (isLoad && !isLoadLastRecord) {
            getTaximeters(false)
        }
    }, [isLoad])


    var getTaximeters = (reset) => {

        AxiosPrivate.get(endpoints.reportTaximeter,
            {
                params: {
                    offset: reset ? 0 : taximeters.length,
                    ...params
                }
            }).then((res) => {
                console.log('ffffffffffffff', res.data.list.length)
                setLoadLastRecord((res.data.list.length == 0 ? true : false))
                if (reset) {
                    setTaximeters(res.data.list)
                } else {
                    setTaximeters([...taximeters, ...res.data.list])
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

            {/* باکس جستجو */}
            <div className='row g-2 bg-light pb-3 sticky-top  '>

                <form className='row col-12 col-lg-10 g-2  '>

                    <div className='col-6 col-md-4 col-lg-3'>

                        <input type="text"
                            className="form-control"
                            placeholder="نام"
                            name="firstName"
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4 col-lg-3 '>

                        <input type="text"
                            className="form-control"
                            placeholder="نام خانوادگی"
                            name="lastName"
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4 col-lg-3 '>
                        <input type="number"
                            className="form-control"
                            placeholder="شماره ملی"
                            name="natCode"

                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-6 col-md-4 col-lg-3 '>
                        <input type="number"
                            className=" form-control"
                            placeholder="شماره هوشمند"
                            name="smartCode"
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-6 col-md-4 col-lg-3 '>
                        <input type="number"
                            className=" form-control"
                            placeholder="کد خودرو"
                            name="carCode"
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-6 col-md-4 col-lg-3  d-flex '>

                        <div className='col-5 p-0 m-0 '>
                            <input type="text"
                                className="form-control text-center"
                                placeholder="- - -"
                                name="p3"
                                onChange={readChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <div className='col-4 p-0 m-0 px-2'>

                            <select
                                className="form-control text-center p-0 h-100"
                                defaultValue={''}
                                onChange={readChange}
                                name="ph">
                                <option value={''}>-</option >
                                <option value={'ب'}>ب</option >
                                <option value={'ت'}>ت</option >
                                <option value={'ج'}>ج</option >
                                <option value={'س'}>س</option >
                                <option value={'م'}>م</option >
                                <option value={'ن'}>ن</option >
                                <option value={'ه‍'}>ه‍</option >
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
                        <div className='col-3 p-0 m-0'>
                            <input type="text"
                                className="form-control  text-center "
                                placeholder="- -"
                                name="p2"
                                onChange={readChange}
                                onKeyDown={handleEnter}


                            />
                        </div>



                    </div>

                    <div className='col-6 col-md-4 col-lg-3'>
                        <input type="number"
                            className=" form-control"
                            placeholder="کد در خط"
                            name="driverCode"
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>

                    <div className='col-6 col-md-4 col-lg-3'>
                        <input type="number"
                            className=" form-control"
                            placeholder="شماره خط"
                            name="lineNum"
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-6 col-md-4 col-lg-3'>
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
                            placeholder='تاریخ'
                            value={params?.fromDate || ''}
                            calendarPosition="bottom-left"
                        />

                    </div>
                </form>

                <div className='col-12 col-lg-2  '>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            getTaximeters(true)
                            // console.log(params)
                        }} >جستجو</button>

                </div>
            </div>
            <div className='d-none d-lg-block  position-sticky h-100 bottom-0  overflow-auto a-scroll' ref={divScroll}>

                {taximeters.map((item, index) => {
                    return <div key={index}>
                        <ReportTaximeterCard
                            taximeter={item}
                            onEditPress={() => {
                            }}
                            onRemovePress={() => {
                            }} />
                    </div>
                })}
            </div>

            {(isLoad && !isLoadLastRecord) ?
                <div className='justify-content-center d-flex py-5' >
                    <div className="spinner-border" role="status" />
                </div> : <></>
            }

        </div >
    )
} 