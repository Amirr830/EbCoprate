import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "modals/loaderModal";

import { FcSearch } from "react-icons/fc"
import endpoints from "app/endpoints";
import { AxiosPrivate } from "app/axiosPrivate";
import CarClassDropDown from "components/dropdowns/carClassDropDown";
import CarTypeDropDown from "components/dropdowns/carTypeDropDown";
import AddDriverFromMCS from "modals/AddDriverFromMCS";
export default function SearchCar(props) {


    //هنگام بسته شدن مودال
    const handleClose = (force) => {
        //اگر لیست رانندگان نمایش داده شده باشد
        //ابتدا لیست بسته میشود
        if (showSearchList && !force) {
            searchAgain()
        } else {
            //در غیر این صورت مودال بسته میشود
            setShow(false)
            setShowSearchList(false)
        }
    }

    var [params, setParams] = useState()
    const [drivers, setDrivers] = useState([])
    const [showSearchList, setShowSearchList] = useState(false)

    //رفتن به حالت جستجوی مجدد
    var searchAgain = (e) => {
        console.log(props, params)
        setParams({ lineNum: props?.lineNum })
        setShowSearchList(false)
        setDrivers([])
    }
    //هر زمان که به حالت جستجو میرود بروی کد در خط متمرکز میشود
    useEffect(() => {
        if (!showSearchList)
            searchTermRef?.current?.focus();
    }, [showSearchList])


    var searchPerson = () => {
        var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.car,
            {
                params: {
                    offset: 0,
                    ...params
                }
            }).then((res) => {
                var drivers2 = res.data.list.flatMap(driver =>
                    driver.owners.map(owner => ({
                        ...driver,
                        ...owner,
                        owners: undefined
                    }))
                );
                setDrivers(drivers2)
                setShowSearchList(true)
            }).finally((e) => {
                loaderModal.close(loader)
            })
    }

    var submit = useRef()

    const handleEnterToSubmit = (event) => {
        if (event.key.toLowerCase() === "enter") {
            submit.current.focus();
        }
    };

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


    var searchTermRef = useRef()

    var [show, setShow] = useState(false)
    var [showAddFromMCS, setShowAddFromMCS] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0); // موقعیت فعلی در لیست
    var [params, setParams] = useState(props?.params)

    useEffect(() => {
        if (show) {
            console.log(props)
            setParams({ lineNum: props?.lineNum })
            setShowSearchList(false)
            setDrivers([])
            searchTermRef?.current?.focus();
        } else {
            try {
                props?.onClose()
            } catch (e) {
            }
        }
        setShowAddFromMCS(false)
    }, [show])

    // اضافه کردن رویداد گوش دهنده به document
    const handleKeyDown = (event) => {
        // کد مورد نظر شما برای اجرا هنگام فشردن کلید
        // UP
        if (event.keyCode === 38) {
            event.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : drivers.length - 1
            );
        }
        // DOWN
        else if (event.keyCode === 40) {
            event.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex < drivers.length - 1 ? prevIndex + 1 : 0
            );
        }
        // ENTER
        else if (event.keyCode === 13) {
            event.preventDefault();
            itemRefs.current[selectedIndex].click();
        }

        // اسکرول کردن آیتم انتخاب‌شده به داخل دید
        if (itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }


    };
    const handleKeyDownOther = (event) => {
        if (event.keyCode === 113) {
            event.preventDefault();
            setShow(false)
            setShowAddFromMCS(true)
        }
    };



    //در صورت انتخاب به خروجی ارسال میشود
    var onSelect = (person) => {
        handleClose(true)
        props?.onSelect(person)
    }

    //هنگام نمایش لیست برای پیمایش بروی کلید های جهت نما گوش میدهد
    useEffect(() => {
        if (show && drivers?.length > 0) {
            document.addEventListener('keydown', handleKeyDown);
            // تابع پاکسازی که هنگام حذف کامپوننت اجرا می‌شود
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [drivers, selectedIndex, show])
    //هنگام نمایش لیست برای پیمایش بروی کلید های جهت نما گوش میدهد
    useEffect(() => {
        if (show) {
            document.addEventListener('keydown', handleKeyDownOther);
            // تابع پاکسازی که هنگام حذف کامپوننت اجرا می‌شود
            return () => {
                document.removeEventListener('keydown', handleKeyDownOther);
            };
        }
    }, [drivers, selectedIndex, show])

    useEffect(() => {
        if (show && drivers?.length > 0) {
            setSelectedIndex(0)
        }
    }, [drivers])

    const itemRefs = useRef([]); // ذخیره‌ی مرجع آیتم‌ها


    useEffect(() => {
        setShow(props?.show)
    }, [props?.show])


    const handleShow = (e) => {
        setShow(true)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });


    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            onKeyDown={(e) => {
                // ESC
                if (e.keyCode == 27) {
                    handleClose()
                }
            }}
            size="md"
            onHide={handleClose}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }} >


            <Modal.Body className="card-header">
                <div className="justify-content-center align-items-center  d-flex w-100 col-12 " dir="rtl">
                    <div className="d-flex flex-column w-100">


                        {!showSearchList ?
                            <div>
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >برای انتخاب فرد مورد نظر خود را جستجو نمایید</h5>
                                </div>

                                <form>
                                    <div className=" row g-2" >

                                        <div className='col-6 '>

                                            <input type="text"
                                                className="form-control"
                                                placeholder="نام"
                                                name="firstName"
                                                onChange={readChange}
                                                onKeyDown={handleEnter}
                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="نام خانوادگی"
                                                name="lastName"
                                                onChange={readChange}
                                                onKeyDown={handleEnter}
                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <input type="number"
                                                className="form-control"
                                                placeholder="شماره ملی"
                                                name="natCode"

                                                onChange={readChange}
                                                onKeyDown={handleEnter}

                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <input type="number"
                                                className=" form-control"
                                                placeholder="شماره هوشمند"
                                                name="smartCode"
                                                onChange={readChange}
                                                onKeyDown={handleEnterToSubmit}
                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <input type="number"
                                                className=" form-control"
                                                placeholder="کد در خط"
                                                name="driverCode"
                                                ref={searchTermRef}
                                                onChange={readChange}
                                                onKeyDown={handleEnterToSubmit}
                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <input type="number"
                                                className=" form-control"
                                                placeholder="کد خودرویی"
                                                name="carCode"
                                                onChange={readChange}
                                                onKeyDown={handleEnterToSubmit}
                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <CarClassDropDown
                                                name="classCode"
                                                onChange={readChange}
                                                value={params?.classCode}
                                            />
                                        </div>
                                        <div className='col-6 '>
                                            <CarTypeDropDown
                                                name="carType"
                                                onChange={readChange}
                                                value={params?.carType}
                                            />
                                        </div>

                                        <div className='col-6  d-flex'>

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
                                    </div>

                                </form>

                                <div className=" mt-2">
                                    <button className="btn btn-success w-100" ref={submit} onClick={searchPerson}>جستجو</button>
                                </div>
                            </div>
                            :
                            <div>
                                <h5 className="mb-2" >لیست افراد یافت شده برای انتخاب کلیک کنید</h5>

                                {drivers?.length > 0 ?
                                    <div>
                                        {

                                            drivers.map((person, index) => {
                                                return <div key={index}>
                                                    <div className='card p-1 my-2 aPointer noSelect card-hover'
                                                        ref={(el) => (itemRefs.current[index] = el)} // مرجع برای هر آیتم

                                                        style={{
                                                            padding: "10px",
                                                            cursor: "pointer",
                                                            backgroundColor: index === selectedIndex ? "#d3d3d3" : "white",
                                                        }}
                                                        onClick={(e) => {
                                                            onSelect(person)
                                                        }}>

                                                        <div className="row mx-1 aPointer" >
                                                            <label className="iranSansBold w-auto aPointer" >
                                                                {person?.firstName + ' ' + person?.lastName}
                                                                {person?.type == 1 ? <label className="aPointer text-primary px-2" >
                                                                    مالک
                                                                </label> :
                                                                    person?.type == 2 ? <label className="aPointer text-info px-2" >
                                                                        بهره بردار
                                                                    </label> : <label className="aPointer text-danger px-2" >
                                                                        کمکی
                                                                    </label>
                                                                }

                                                            </label>
                                                            {person?.drv3Car ?
                                                                <label className="iranSansBold aPointer w-auto me-auto  " >
                                                                    کد در خط : {person?.drv3Car}
                                                                </label> : <></>
                                                            }
                                                            <div className=" col-12 row p-0 m-0">
                                                                <label className="iranSansaPointer opacity-50  w-auto ">
                                                                    {person?.carTypeName} - {person?.p3}{person?.ph}{person?.p2}
                                                                </label>

                                                                <label className="iranSans aPointer opacity-25 w-auto me-auto ">
                                                                    {person?.lineName}
                                                                </label>
                                                            </div>
                                                            <div className=" col-12 row p-0 m-0">
                                                                <label className="iranSansaPointer text-danger w-auto ">
                                                                    {person?.mobile}
                                                                </label>

                                    
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            })

                                        }

                                    </div>
                                    :
                                    <div className="align-items-center d-flex  flex-column justify-content-center"><FcSearch size={60} />
                                        <h2 className="w-100 text-center">موردی یافت نشد</h2>
                                    </div>
                                }
                                <div className="mt-5 mb-2 d-flex flex-column">
                                    <h5 className="m-0 p-0" >
                                        در لیست فرد مورد نظر خود را پیدا نکردید؟
                                    </h5>
                                    <p className="m-0 p-0 text-hover aPointer d-flex  p-0 m-0 mb-1"
                                        onClick={() => {
                                            setShow(false)
                                            setShowAddFromMCS(true)
                                        }} >
                                        دریافت اطلاعات از سامانه جامع
                                        <p className="fredoka p-0 m-0">(F2)</p>
                                    </p>


                                </div>
                                <div className="d-flex flex-row">
                                    <button className="btn btn-danger w-100  iranSansBold" onClick={searchAgain}>جستجوی مجدد</button>
                                </div>
                            </div>

                        }



                    </div>

                </div>

            </Modal.Body>

        </Modal>
        <AddDriverFromMCS
            show={showAddFromMCS}
            onClose={() => {
                setShow(true)
                setShowAddFromMCS(false)
            }
            }>

        </AddDriverFromMCS>
    </>)
}
