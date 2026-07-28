import React, { useEffect, useState } from "react";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import endpoints from "../../../../app/endpoints";

import answerModal from "../../../../modals/answerModal";
import { FaInfoCircle } from "react-icons/fa";
import AddNewPattern from "./addNewPattern";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import GetTimePriod from "./getTimePriod";
import toast from "../../../../components/toast";
import ExportData from "./exportData";

export default function ShiftPattern() {

    var [patterns, setPatterns] = useState([])
    useEffect(() => {
        getPatterns()
    }, [])

    var getPatterns = () => {
        AxiosPrivate.get(endpoints.shiftPattern)
            .then((res) => {
                setPatterns(res?.data)
            })
    }

    var deletePattern = (patternCode) => {
        answerModal.show("آیا از حذف این الگو اطمینان دارید؟", () => {
            AxiosPrivate.delete(endpoints.shiftPattern, { data: { patternCode } })
                .then((res) => {
                    getPatterns()
                    if (res.data?.status == 1) {
                        toast.Success(res?.data?.msg)
                    } else {
                        toast.Error(res?.data?.msg)
                    }
                })
        }, () => {

        })

    }

    var updateShift = (data) => {
        AxiosPrivate.put(endpoints.shift, { data: data })
            .then((res) => {
                getPatterns()
            })
    }

    var addPattern = (data) => {
        AxiosPrivate.post(endpoints.shiftPattern, data)
            .then((res) => {
                if (res.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                } else {
                    toast.Error(res?.data?.msg)
                }
                getPatterns()
            })
    }

    var releasePattern = (data) => {

        AxiosPrivate.post(endpoints.shiftRelease, data)
            .then((res) => {
                if (res.data?.status == 1) {
                    toast.Success(res?.data?.msg)
                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }




    return (
        <>
            <div className="row g-2 mt-3  h-100 ">
                <div className="col-12 col-lg-4">

                    <AddNewPattern
                        onAccept={(pattern) => {
                            addPattern(pattern)
                        }}>

                        <button className="btn btn-primary w-100 p-2 text-center " >
                            <h4 className="iranSansBold">تعریف الگوی جدید + </h4>
                        </button>
                    </AddNewPattern>

                </div>
                <div className="col-12 col-lg-4">

                    <GetTimePriod
                        onAccept={(data) => {
                            releasePattern(data)

                        }}>

                        <button className="btn btn-danger  w-100 p-2 text-center ">
                            <h4 className="iranSansBold">تنظیم مجدد شیفت ها </h4>
                        </button>
                    </GetTimePriod>
                </div>
                <div className="col-12 col-lg-4">
                    <ExportData >
                        <button className="btn btn-success w-100 p-2 text-center " >
                            <h4 className="iranSansBold">نمایش </h4>
                        </button>
                    </ExportData>
                </div>
                <div className="overflow-y-auto overflow-x-hidden a-scroll h-100 ">
                    <table className='col-12 table table-striped table-bordered  table-hover  ' style={{ minWidth: "60rem" }}>
                        <thead className='thead-dark position-sticky top-0 table-bordered ' style={{ zIndex: 107 }}>
                            <tr>
                                <th className="text-center" width="5%">روز</th>
                                <th className="text-center" width="10%">شیفت</th>
                                <th className="text-center" width="10%">گروه</th>
                                <th className="text-center" width="10%">الزام حضور</th>
                                <th className="text-center" width="10%">الزام عدم حضور</th>

                                <th className="text-center" width="5%">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                patterns?.map((pattern, index) => {
                                    return <tr key={index}>
                                        <td className="iranSansBold text-center"  >{pattern?.dayNumber}</td>
                                        <td className="iranSansBold text-center"  >{pattern?.shiftName}</td>
                                        <td className="iranSansBold text-center"  >{pattern?.shiftGroupName}</td>
                                        <td className="iranSansBold text-center"  >{pattern?.forcePresence ? <FaCheckCircle className="text-success" size={30} /> : <IoIosCloseCircle className="text-danger" size={40} />}</td>
                                        <td className="iranSansBold text-center"  >{pattern?.forceAbsence ? <FaCheckCircle className="text-success" size={30} /> : <IoIosCloseCircle className="text-danger" size={40} />}</td>
                                        <td className="iranSansBold text-center"  >
                                            <button className="btn btn-danger" onClick={() => {
                                                deletePattern(pattern?.patternCode)
                                            }}>حذف</button>
                                        </td>
                                    </tr>
                                })
                            }
                            <tr style={{ height: '10rem' }}></tr>


                        </tbody>

                    </table>

                </div>

            </div >

        </>

    );
}

