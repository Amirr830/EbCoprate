import React, { useContext, useEffect, useRef, useState } from 'react'
import AddCarModal from '../../../modals/addCarModal';
import dashboardContext from "../../../contexts/dashboardContext";

import endpoints from '../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../components/toast';
import CarCard from '../../../components/carCard';
import { AxiosPrivate } from '../../../app/axiosPrivate';
import CarTypeDropDown from 'components/dropdowns/carTypeDropDown';
import CarClassDropDown from 'components/dropdowns/carClassDropDown';
import ProgressBar from '../../../components/ProgressBar';
import AddDriverFromMCS from '../../../modals/AddDriverFromMCS';
import { FaCloud } from "react-icons/fa";

export default function Cars() {
    var [showAddCar, setShowAddCar] = useState(false)

    var context = useContext(dashboardContext)
    var openAddCarModal = () => {
        setCurrentCar(undefined)
        setShowAddCar(true)
    }
    var [cars, setCars] = useState([]);
    var [carCount, setCarCount] = useState(0);
    var [currentCar, setCurrentCar] = useState(undefined);
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
    var [loadingExport, setLoadingExport] = useState(false)

    var [isLoad, setLoading] = useState(true)
    var [params, setParams] = useState()

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
        if (cars.length > 50)
            setLoading(false)
        if (isLoad) {
            getCars(false)
        }
    }, [isLoad])
    var getExcelExport = () => {
        setLoadingExport(true)

        AxiosPrivate.get(endpoints.car,
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
                link.setAttribute('download', 'report_cars.xlsx'); // نام فایل دانلودی
                document.body.appendChild(link);
                link.click();
                link.remove();
                // لغو Object URL برای آزادسازی حافظه
                window.URL.revokeObjectURL(url);

            }).finally(() => {
                setLoadingExport(false)
            })
    }
    var getCars = (reset) => {

        AxiosPrivate.get(endpoints.car,
            {
                params: {
                    offset: reset ? 0 : cars.length,
                    ...params
                }
            }).then((res) => {
                setCarCount(res.data.carCount)

                if (reset) {
                    setCars(res.data.list)
                } else {
                    setCars([...cars, ...res.data.list])
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

    const handleOnCheck = (e) => {
        try {

            var value = e.target.checked
            var name = e.target.name
            setParams(prevState => ({ ...prevState, [name]: value ? 1 : 0 }))
        } catch (err) {
            console.log(err)
        }
    }
    const handleEnter = (event) => {
        if (event.key.toLowerCase() == "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    var deletePerson = (smartCode) => {

        const MySwal = withReactContent(Swal)
        MySwal.fire({
            allowOutsideClick: true,
            title: 'آیا از حذف این رکورد اطمینان دارید',
            icon: 'warning',
            confirmButtonText: "حذف شود",
            denyButtonText: "فعلا نه",
            showDenyButton: true

        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                AxiosPrivate.delete(endpoints.car, {
                    data: { smartCode: smartCode }

                }).then((res) => {

                    toast.Success("با موفقیت حذف شد")
                    getCars(true)
                });
            }

        })
        return MySwal;
    }
    return (
        <div className=' h-100 d-flex flex-column'>


            {/* باکس جستجو */}
            <div className='row g-2 pb-3 '>

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

                    <div className='col-6 col-md-4 col-lg-3 d-flex'>
                        <label className='px-2'>نوع خودرو : </label>
                        <div className='col'>
                            <CarTypeDropDown
                                name="carType"
                                onChange={readChange}
                                value={params?.carType}
                            />
                        </div>

                    </div>
                    <div className='col-6 col-md-4 col-lg-3 d-flex'>
                        <label className='px-2'>کلاس خودرو : </label>
                        <div className='col'>
                            <CarClassDropDown
                                name="classCode"
                                onChange={readChange}
                                value={params?.classCode}
                            />
                        </div>
                    </div>


                    <div className='col-6 col-md-4 col-lg-3' >
                        <input className="form-check-input" type="checkbox" name="onlyLocked" value={() => { return params.onlyLocked == 1 }} onChange={handleOnCheck} />
                        <label className="mx-2" >
                            فقط قفل شده ها
                        </label>
                    </div>


                </form>

                <div className='col-12 col-lg-2  '>
                    <button className='col-12 btn btn-warning mt-2'
                        onClick={() => {
                            setCars([])

                            getCars(true)
                            setLoading(true)
                            // console.log(params)
                        }} >جستجو</button>




                    <div className='col-12 d-flex' >

                        <button className='flex-grow-1 btn btn-primary mt-2 ms-2'
                            onClick={openAddCarModal}>افزودن</button>

                        <AddDriverFromMCS
                            onClose={() => {
                                getCars(true)

                            }}>
                            <button className='btn btn-primary mt-2' title="دریافت اطلاعات خودرو از سامانه جامع">
                                <FaCloud />
                            </button>
                        </AddDriverFromMCS>



                    </div>

                    <div className='col-12 '>
                        {

                            loadingExport ?
                                <button className='btn btn-outline-success disabled col-12 mt-2'>
                                    <ProgressBar />
                                </button> :
                                <button className='col-12 btn btn-success mt-2'
                                    onClick={() => {
                                        getExcelExport()
                                    }} >خروجی Excel</button>
                        }
                    </div>
                </div>
            </div >

            {/* هدر نام فیلد ها */}
            < div className='row col-12' >
                <div className='row col-11  m-0 opacity-25 mt-3' >

                    <div className='row col-12 col-md-6 col-lg-4'>

                        <label className="iranSansBold px-2 text-end " style={{ width: '10rem' }} >
                            تعداد : {carCount}
                        </label>

                        <label className="iranSansBold text-end  text-truncate col" >
                            نوع خودرو
                        </label>
                    </div>

                    <div className='col-12 col-md-6 col-lg-6 row '>
                        <label className="iranSansBold text-end col-4 text-truncate">
                            کد خودرو
                        </label>
                        <label className="iranSansBold text-end text-truncate col-3" >
                            کد در خط
                        </label>

                        <label className="iranSansBold text-end text-truncate col-4" >
                            شماره خط
                        </label>

                    </div>

                    <label className="iranSansBold text-end d-none d-lg-block text-truncate col-lg-2" >
                        نام مالک
                    </label>



                </div>
            </div >
            <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll' ref={divScrollRef}>
                {cars.map((item, index) => {
                    return <div key={index}>
                        <CarCard
                            car={item}
                            onEditPress={() => {
                                setCurrentCar(item)
                                setShowAddCar(true)
                            }}
                            onRemovePress={() => {
                                console.log(item)
                                deletePerson(item?.smartCode)
                            }} />
                    </div>
                })}
            </div>
            {
                isLoad ?
                    <div className='justify-content-center d-flex py-5' >
                        <div className="spinner-border" role="status" />
                    </div> : <></>
            }
            <AddCarModal
                show={showAddCar}
                car={currentCar}
                onClose={(e) => {
                    setShowAddCar(false)
                }}
                onSave={(car) => {
                    setShowAddCar(false)
                    getCars(true)
                }}
            />

        </div >
    )
} 