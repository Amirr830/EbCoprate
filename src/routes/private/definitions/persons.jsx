import React, { useContext, useEffect, useRef, useState } from 'react'
import PersonCard from '../../../components/personCard';
import AddPersonModal from '../../../modals/addPersonModal';
import dashboardContext from "../../../contexts/dashboardContext";
import endpoints from '../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../components/toast';
import ProgressBar from '../../../components/ProgressBar';

import { AxiosPrivate } from '../../../app/axiosPrivate';
export default function Persons() {
    var [showAddCar, setShowAddCar] = useState(false)

    var context = useContext(dashboardContext)
    var openAddCarModal = () => {
        setCurrentPerson(undefined)
        setShowAddCar(true)
    }
    var [loadingExport, setLoadingExport] = useState(false)

    var [persons, setPersons] = useState([]);
    var [currentPerson, setCurrentPerson] = useState(undefined);
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
        if (persons.length > 50)
            setLoading(false)
        if (isLoad) {
            getPersons(false)
        }
    }, [isLoad])

    var getPersons = (reset) => {

        AxiosPrivate.get(endpoints.driver,
            {
                params: {
                    offset: reset ? 0 : persons.length,
                    ...params
                }
            }).then((res) => {
                if (reset) {
                    setPersons(res.data)
                } else {
                    setPersons([...persons, ...res.data])
                }
            }).finally(() => {
                setLoading(false)
            })

        // setTimeout(() => {
        //     setPersons([...persons, ...list])
        // }, 2000)
    }

    var getExcelExport = () => {
        setLoadingExport(true)

        AxiosPrivate.get(endpoints.driver,
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
                link.setAttribute('download', 'report_drivers.xlsx'); // نام فایل دانلودی
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

                AxiosPrivate.delete(endpoints.driver, {
                    data: { smartCode: smartCode }
                }).then((res) => {

                    toast.Success("با موفقیت حذف شد")
                    getPersons(true)
                });
            }

        })
        return MySwal;
    }
    return (


        <div className=' h-100 d-flex flex-column'>
            <div className='row g-2  pb-3 '>
                <form className='row col-12 col-lg-10 g-2  '>
                    <div className='col-6 col-md-4'>
                        <input type="text"
                            className="form-control"
                            placeholder="نام"
                            name="firstName"
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4 '>

                        <input type="text"
                            className="form-control"
                            placeholder="نام خانوادگی"
                            name="lastName"
                            onChange={readChange}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <div className='col-6 col-md-4 '>
                        <input type="number"
                            className="form-control"
                            placeholder="شماره ملی"
                            name="natCode"

                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-6 col-md-4 '>
                        <input type="number"
                            className=" form-control"
                            placeholder="شماره هوشمند"
                            name="smartCode"
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                    <div className='col-6 col-md-4 '>
                        <input type="number"
                            className=" form-control"
                            placeholder="شماره همراه"
                            name="phoneNumber"
                            onChange={readChange}
                            onKeyDown={handleEnter}


                        />
                    </div>
                </form>

                <div className='col-12 col-lg-2'>

                    <div className='col-12  '>
                        <button className='col-12 btn btn-warning mt-2'
                            onClick={() => {
                                getPersons(true)
                            }} >جستجو</button>
                    </div>
                    <div className='col-12 ' >
                        <button className='col-12 btn btn-success mt-2 '
                            onClick={openAddCarModal}>افزودن</button>
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
            </div>

            <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll' ref={divScrollRef}>
                {persons.map((item, index) => {
                    return <div key={index}>
                        <PersonCard
                            person={item}
                            onEditPress={() => {
                                setCurrentPerson(item)
                                setShowAddCar(true)
                            }}
                            onRemovePress={() => {
                                deletePerson(item?.smartCode)
                            }} />
                    </div>
                })}
            </div>

            {isLoad ?
                <div className='justify-content-center d-flex py-5' >
                    <div className="spinner-border" role="status" />
                </div> : <></>
            }
            <AddPersonModal
                show={showAddCar}
                person={currentPerson}
                onClose={(e) => {
                    setShowAddCar(false)
                }}
                onSave={(car) => {
                    setShowAddCar(false)
                    getPersons(true)
                }}
            />

        </div >
    )
} 