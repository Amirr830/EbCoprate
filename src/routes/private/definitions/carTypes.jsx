import React, { useEffect, useState, useContext } from "react";
import endpoints from "app/endpoints";
import { AxiosPrivate } from "app/axiosPrivate"

import toast from "components/toast";
import { IoCloseSharp } from "react-icons/io5";
import answerModal from "modals/answerModal";
import CarClassDropDown from "components/dropdowns/carClassDropDown";
import CarDegreeDropDown from "components/dropdowns/carDegreeDropDown";

export default function CarTypes() {
    var [carTypes, setCarTypes] = useState([])

    useEffect(() => {
        getCarTypes()
    }, [])

    var getCarTypes = () => {
        AxiosPrivate.get(endpoints.carType,
            {
                params: {
                    ...params
                }
            }).then((res) => {
                setCarTypes(res.data)
            }).finally(() => {
                setLoading(false)
            })
    }

    var initParams = {
        carTypeCode: ""
        , carTypeName: ""
        , passengerCapacity: ""
        , classCode: ""
        , degree: ''
    }

    var addCarType = () => {
        if (!params?.carTypeName) {
            toast.Error("نام خودرو را وارد نمایید")
            return
        }

        setLoading(true)
        AxiosPrivate.post(endpoints.carType, params)
            .then((res) => {
                if (res?.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                    setParams(initParams)
                }
            }).finally(() => {
                getCarTypes()
            })
    }

    var updateCarType = () => {
        if (!params?.carTypeName) {
            toast.Error("نام خودرو را وارد نمایید")
            return
        }

        setLoading(true)
        AxiosPrivate.put(endpoints.carType, params)
            .then((res) => {
                if (res?.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                    setParams(initParams)
                }
            }).finally(() => {
                getCarTypes()
            })
    }
    var deleteCarType = (carTypeCode) => {
        setLoading(true)
        AxiosPrivate.delete(endpoints.carType, { data: { carTypeCode } })
            .then((res) => {
                if (res?.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                }
            }).finally(() => {
                getCarTypes()
            })
    }


    var [isLoad, setLoading] = useState(true)
    var [editable, setEditable] = useState(false)
    var [params, setParams] = useState()


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
        <>
            <div className='h-100 overflow-y-auto a-scroll d-flex flex-column'>



                <table className='col-12 table table-striped table-bordered  table-hover '  >
                    <thead className='thead-dark position-sticky top-0 col-12'>
                        <tr >
                            <th colSpan="6" className=" p-0 m-0">
                                {/* باکس جستجو */}
                                <div className='row g-2  col-12 m-0 '>
                                    <form className='row col-12 col-md-8 g-2 '>
                                        <div className='col-3 '>

                                            <input type="text"
                                                className="form-control"
                                                placeholder="نام خودرو"
                                                name="carTypeName"
                                                value={params?.carTypeName}
                                                onChange={readChange}
                                                onKeyDown={handleEnter}
                                            />
                                        </div>

                                        <div className='col-3 '>
                                            <CarClassDropDown
                                                name="classCode"
                                                onChange={readChange}
                                                value={params?.classCode}
                                            />

                                        </div>

                                        <div className='col-3'>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="تعداد سرنشین"
                                                name="passengerCapacity"
                                                value={params?.passengerCapacity}
                                                onChange={readChange}
                                                onKeyDown={handleEnter}
                                            />
                                        </div>

                                        <div className='col-3'>
                                            <CarDegreeDropDown
                                                name="degree"
                                                onChange={readChange}
                                                value={params?.degree}

                                            />

                                        </div>
                                    </form>

                                    <div className="col-12 col-md-4 row g-2">
                                        {editable ?
                                            <>
                                                <div className='col-6'>
                                                    <button className='w-100 btn btn-danger'
                                                        onClick={() => {
                                                            setEditable(false)
                                                            setParams(initParams)
                                                            // console.log(params)
                                                        }} >لغو</button>
                                                </div>
                                                <div className='col-6'>
                                                    <button className='w-100 btn btn-success'
                                                        onClick={(e) => {
                                                            updateCarType()
                                                        }}>ویرایش</button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='col-6'>
                                                    <button className='w-100 btn btn-warning'
                                                        onClick={() => {
                                                            setCarTypes([])
                                                            getCarTypes(true)
                                                            setLoading(true)
                                                            // console.log(params)
                                                        }} >جستجو</button>
                                                </div>
                                                <div className='col-6'>
                                                    <button className='w-100 btn btn-success'
                                                        onClick={(e) => {
                                                            addCarType()
                                                        }}>افزودن</button>
                                                </div>
                                            </>}
                                    </div>
                                </div>
                            </th>

                        </tr>
                        <tr>

                        </tr>
                        <tr className=" " style={{ background: '#cccccc' }}>
                            <th width="5%">
                                کد
                            </th>
                            <th width="10%">
                                تعداد
                            </th>
                            <th width="10%">
                                کلاس
                            </th>
                            <th width="10%">
                                درجه
                            </th>
                            <th width="55%">
                                نام خودرو
                            </th>
                            <th width="5%">

                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {carTypes.map((item, index) => {
                            return <tr key={index} className="aPointer"
                                onClick={(e) => {
                                    setParams(item)
                                    setEditable(true)
                                }}>
                                <th>
                                    {item?.carTypeCode}
                                </th>
                                <th>
                                    {item?.passengerCapacity}
                                </th>
                                <th>
                                    {item?.classCode}

                                </th>
                                <th>
                                    {item?.degree}
                                </th>
                                <th>
                                    {item?.carTypeName}
                                </th>
                                <th >
                                    <IoCloseSharp className="aPointer  text-hover" size={20} onClick={(e) => {
                                        answerModal.show("آیا از حذف نوع خودرو " + item?.carTypeName + " مطمئن هستید؟", () => {
                                            deleteCarType(item.carTypeCode)
                                        }, () => {

                                        })
                                    }} />
                                </th>

                            </tr>
                        })}

                    </tbody>
                </table>


                {isLoad ?
                    <div className='justify-content-center d-flex py-5' >
                        <div className="spinner-border" role="status" />
                    </div> : <></>
                }

            </div >
        </>
    );

}

