import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "contexts/dashboardContext";

import endpoints from 'app/endpoints';

import toast from 'components/toast';
import Input from 'components/customeTag/input';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { AxiosPrivate } from 'app/axiosPrivate';

import ProgressBar from 'components/ProgressBar';
import { FaCheck } from "react-icons/fa6";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import NoResult from 'components/views/noResult';
import SearchList from 'components/views/searchList';
import Loading from 'components/views/loading';
import ShiftGroupDropDown from 'components/dropdowns/shiftGroupDropDown';
import ShiftDropDown from 'components/dropdowns/shiftDropDown';
import Select from 'react-select';

export default function ShiftReport() {
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

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const driverCode = queryParams.get('driverCode'); // "electronics"
    const startTime = queryParams.get('startTime');         // "2"
    const toTime = queryParams.get('toTime');    // "2"
    const stCode = queryParams.get('stCode');    // "2"



    var [isLoad, setLoading] = useState(false)
    var [params, setParams] = useState({})

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
            if (data.length > 0)
                getShiftReport(false)
        }
    }, [isLoad])

    var [isLoadLastRecord, setLoadLastRecord] = useState(false);

    var getShiftReport = (reset) => {
        if (!params?.shiftCode) {
            toast.Error("شیفت مورد نظر را انتخاب نمایید")
            return
        }
        if (!params?.startTime) {
            toast.Error("تاریخ مورد نظر را انتخاب نمایید")
            return
        }
        if (reset) {
            setLoading(true)
            setLoadLastRecord(false)
            setData([]);
        }

        AxiosPrivate.post(endpoints.shiftReport,
            {
                offset: reset ? 0 : data.length,
                ...params
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
    var [loadingExport, setLoadingExport] = useState(false)
    var getShiftReportExport = () => {
        setLoadingExport(true)
        AxiosPrivate.post(endpoints.shiftReport, {
            offset: -1,
            ...params
        }, {
            responseType: 'blob'
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
    const statusList = [{ label: 'همه', value: 100 },
    { label: 'حضور', value: 1 },
    { label: 'حضور بدون سفر', value: 0 },
    { label: 'عدم حضور', value: -1 },
    { label: 'حضور بدون شیفت', value: 2 }


    ]

    return (
        <div className='h-100 d-flex flex-column'>
            <div className='row g-2 pb-3' id="2" style={{ backgroundColor: '#ECEFF1' }}>

                <form className='row col-12 col-md-8 g-2  '>


                    <div className='col-6 col-lg-3  '>
                        <label>شیفت <span className='text-danger'>*</span></label>

                        <ShiftDropDown
                            value={params?.shiftCode}
                            name="shiftCode"
                            onChange={readChange} />
                    </div>


                    <div className='col-6 col-lg-3  '>

                        <label>تاریخ <span className='text-danger'>*</span></label>
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
                                    startTime: date
                                }))


                            }}
                            placeholder='تاریخ'
                            value={params?.startTime || ''}
                            calendarPosition="bottom-left"
                        />

                    </div>
                    <div className='col-6 col-lg-3'>

                        <label>وضعیت </label>
                        <Select
                            value={statusList?.find(option => option.value === params?.status)}

                            onChange={(e) => {
                                setParams({ ...params, status: e.value });
                            }}
                            placeholder="انتخاب کنید..."
                            isSearchable={true}
                            options={statusList} />


                    </div>

                    <div className='col-6 col-lg-3  '>

                        <label>کد راننده </label>
                        <Input type="number"
                            className=" form-control"
                            placeholder="کد راننده"
                            name="driverCode"
                            value={params?.driverCode}
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-12 '>

                        <label>گروه </label>
                        <ShiftGroupDropDown
                            value={params?.shiftGroupCode}
                            name="shiftGroupCode"
                            onChange={readChange} />

                    </div>

                </form>

                <div className='col-12 col-md-4 row g-2 align-items-end'>

                    <div className='col-12  col-md-6'>
                        <button className='col-12 btn btn-warning '
                            onClick={() => {
                                getShiftReport(true)
                            }} >جستجو</button>
                    </div>
                    <div className='col-12 col-md-6 '>
                        {
                            loadingExport ?
                                <button className='btn btn-outline-success disabled col-12 mt-2'>
                                    <ProgressBar />
                                </button> :
                                <button className='col-12 btn btn-success mt-2'
                                    onClick={() => {
                                        getShiftReportExport()
                                    }} >خروجی Excel</button>
                        }
                    </div>
                </div>


            </div>

            <div className='position-sticky h-100 bottom-0   overflow-auto a-scroll' ref={divScroll}>
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
    const navigate = useNavigate();

    var [column, setColumn] = useState([
        { id: 1, title: 'کد در خط', size: '5%' },
        { id: 2, title: 'نام راننده', size: '15%' },
        { id: 3, title: 'کد ملی راننده', size: '10%' },
        { id: 4, title: 'همراه راننده', size: '10%' },
        { id: 5, title: 'تعداد سفر', size: '5%' },
        { id: 6, title: 'تعداد حضور', size: '5%' },
        { id: 7, title: 'نام گروه', size: '5%' },
        { id: 8, title: 'وضعیت', size: '20%' },
        { id: 9, title: 'الزام حضور', size: '5%' },
        { id: 10, title: 'الزام عدم حضور', size: '5%' },

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

    return <table className='col-12 table table-striped table-bordered  table-hover' style={{ width: "100rem" }}>
        <thead className='thead-dark position-sticky top-0'>
            <tr>

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
            {data.map((item, index) => {
                return <tr className={
                    item?.status == 0 ? 'table-warning'
                        : item?.status == 1 ? 'table-success'
                            : item?.status == -1 ? 'table-danger'
                                : item?.status == 2 ? 'table-info' : ''

                }>
                    {
                        column.map((col, index) => {
                            switch (col.id) {
                                case 1:
                                    return <td>
                                        {item?.driverCode}
                                    </td>

                                case 2:
                                    return <td>
                                        {item?.drvName}
                                    </td>
                                case 3:
                                    return <td>
                                        {item?.natCode}
                                    </td>

                                case 4:
                                    return <td>
                                        {item?.drvMobile}
                                    </td>
                                case 5:
                                    return <td>
                                        {item?.tripCount}
                                    </td>
                                case 6:
                                    return <td>
                                        {item?.inStCount}
                                    </td>
                                case 7:
                                    return <td>
                                        {item?.shiftGroupName}
                                    </td>
                                case 8:
                                    return <td>
                                        {item?.statusStr}
                                    </td>

                                case 9:
                                    return <td className='text-center'>
                                        {item?.forcePresence ? <FaCheck className='text-success' /> : <></>}
                                    </td>
                                case 10:
                                    return <td className='text-center'>
                                        {item?.forceAbsence ? <FaCheck className='text-success' /> : <></>}
                                    </td>
                            }
                        })
                    }

                </tr>
            })}

        </tbody>
    </table >



}
