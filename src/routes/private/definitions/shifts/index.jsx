import React, { useEffect, useState } from "react";
import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import toast from "components/toast";
import { FaTrashRestore, FaEdit } from "react-icons/fa";
import ShiftModal from "./shiftModal";
import { hhmm } from "helper/dateHelper";
import answerModal from "modals/answerModal";

export default function Shifts() {

    var [shifts, setShifts] = useState([])
    useEffect(() => {
        getShifts()
    }, [])

    var getShifts = () => {
        AxiosPrivate.get(endpoints.shift)
            .then((res) => {
                setShifts(res?.data)
            })
    }

    var deleteShift = (shiftCode) => {
        answerModal.show("آیا از حذف این شیفت اطمینان دارید؟", () => {
            AxiosPrivate.delete(endpoints.shift, { data: { shiftCode } })
                .then((res) => {
                    if (res.data?.status == 1) {
                        toast.Success(res?.data?.msg)
                        getShifts()

                    } else {
                        toast.Error(res?.data?.msg)
                    }
                })
        }, () => {

        })

    }

    var updateShift = (data) => {
        AxiosPrivate.put(endpoints.shift, data)
            .then((res) => {
                if (res.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                    getShifts()

                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }

    var addShift = (data) => {
        AxiosPrivate.post(endpoints.shift, data)
            .then((res) => {
                if (res.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                    getShifts()

                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }


    var [isLoading, setLoading] = useState(false)


    return (
        <>

            <div className='h-100 d-flex flex-column'>
                <div className='row g-2 pb-3' id="2" style={{ backgroundColor: '#ECEFF1' }}>

                    <form className='row col-12 col-md-10 g-2  '>



                        {/* <div className='col-6 col-lg-3 d-flex'>
                            <label className='px-2'>خط : </label>
                            <div className='col'>
                                <LinesDropDown
                                    name="lineCode"
                                    onChange={readChange}
                                    value={params?.lineCode}
                                />
                            </div>
                        </div> */}

                        {/* <div className='col-12'>
                            <CheckBox title="نمایش آرشیو شده ها"
                                name="isShowArchive"
                                checked={params?.isShowArchive}
                                onChange={handleCheck} />
                        </div> */}
                    </form>

                    <div className='col-12 col-md-2'>
                        {/* <button className='col-12 btn btn-warning mt-2'
                            onClick={() => {
                                getShifts()
                            }} >جستجو</button> */}

                        <ShiftModal onAccept={(data) => {
                            addShift(data);
                        }}>
                            <button className='col-12 btn btn-success mt-2'>تعریف شیفت جدید + </button>
                        </ShiftModal>
                    </div>
                </div>
                <div className=' position-sticky h-100 bottom-0  overflow-auto a-scroll' >

                    {(isLoading) ?
                        <div className='justify-content-center d-flex py-5' >
                            <div className="spinner-border" role="status" />
                        </div> :
                        <table className='col-12 table table-striped table-bordered  table-hover  ' style={{ minWidth: "70rem" }}>
                            <thead className='thead-dark position-sticky top-0 table-bordered ' style={{ zIndex: 107 }}>
                                <tr>

                                    <th className="text-center" >شرکت</th>
                                    <th className="text-center" >نام خط</th>
                                    <th className="text-center" >نام ایستگاه</th>
                                    <th className="text-center" >کلاس خودرو</th>
                                    <th className="text-center" >عملیات</th>


                                </tr>
                            </thead>
                            <tbody    >

                                {

                                    shifts?.map((item, index) => {
                                        return <tr key={index} className={item?.isArchive == 1 ? "table-danger" : ""} >

                                            <td className="iranSansBold text-center"  >{item?.shiftName}</td>
                                            <td className="iranSansBold text-center text-truncate" >{item?.lineName}</td>
                                            <td className="iranSansBold text-center text-truncate" >{item?.stName}</td>
                                            <td className="iranSansBold text-center"  >از {hhmm(item?.startTime)} - تا {hhmm(item?.endTime)}</td>
                                            <td className="iranSansBold text-center"  >
                                                <div className="d-flex ">
                                                    <div>
                                                        <ShiftModal
                                                            data={item}
                                                            onAccept={(data) => {
                                                                updateShift(data)
                                                            }}>
                                                            <FaEdit className="me-auto aPointer text-hover " size={25} />
                                                        </ShiftModal>
                                                    </div>
                                                    <div className="me-3">

                                                        <FaTrashRestore className="me-auto aPointer text-hover " size={25}
                                                            onClick={() => {
                                                                deleteShift(item?.shiftCode)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>

                        </table>
                    }
                </div>


            </div>

        </>

    );
}

