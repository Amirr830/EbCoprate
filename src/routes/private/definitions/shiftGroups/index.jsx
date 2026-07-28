import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import toast from "components/toast";
import { FaTrashRestore, FaEdit } from "react-icons/fa";
import ShiftGroupModal from "./shiftGroupModal";
import ShiftGroupDrvModal from "./shiftGroupDrvModal";
import answerModal from "modals/answerModal";

export default function ShiftGroups() {

    var [groups, setGroups] = useState([])
    useEffect(() => {
        getGroups()
    }, [])

    var getGroups = () => {
        AxiosPrivate.get(endpoints.shiftGroup)
            .then((res) => {
                setGroups(res?.data)
            })
    }

    var deleteGroup = (shiftGroupCode) => {
        answerModal.show("آیا از حذف این شیفت اطمینان دارید؟", () => {
            AxiosPrivate.delete(endpoints.shiftGroup, { data: { shiftGroupCode } })
                .then((res) => {
                    if (res?.data?.status == 1) {
                        getGroups()
                        toast.Success(res?.data?.msg)
                    } else {
                        toast.Error(res?.data?.msg)
                    }
                })
        }, () => {

        })

    }

    var updateGroup = (data) => {
        AxiosPrivate.put(endpoints.shiftGroup, data)
            .then((res) => {
                if (res?.data?.status == 1) {
                    getGroups()
                    toast.Success(res?.data?.msg)
                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }

    var addGroup = (data) => {
        AxiosPrivate.post(endpoints.shiftGroup, data)
            .then((res) => {
                if (res?.data?.status == 1) {
                    getGroups()
                    toast.Success(res?.data?.msg)
                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }




    return (
        <>
            <div className="row g-2 mt-3 overflow-y-auto overflow-x-hidden a-scroll h-100 ">
                {
                    groups.map((item, index) => {
                        return <div className="col-12 col-md-4 col-lg-3" key={index}>

                            <div className="card d-flex" style={{ height: '9rem' }}>
                                <div className="d-flex flex-column p-2 align-items-center justify-content-center h-100">
                                    <div className="col-12  px-2">
                                        <h3 className="iranSansBold  text-truncate">{item?.shiftGroupName}</h3>
                                        <p className="iranSansBold  text-truncate">تعداد اعضا : {item?.memberCount}</p>

                                    </div>
                                    <div className="col-12 ">
                                        <ShiftGroupDrvModal
                                            shiftGroupCode={item?.shiftGroupCode}
                                            onAccept={(data) => {
                                                getGroups()
                                            }}>

                                            <button className="m-0 p-0 text-truncate  btn btn-primary p-1 col mx-1" >ویرایش اعضا</button>
                                        </ShiftGroupDrvModal>

                                        <button className="m-0 p-0 text-truncate  btn btn-danger p-1 col mx-1"
                                            onClick={() => {
                                                deleteGroup(item?.shiftGroupCode)
                                            }}>
                                            <FaTrashRestore size={20} />
                                        </button>
                                        <ShiftGroupModal
                                            data={item}
                                            onAccept={(data) => {
                                                updateGroup(data)
                                            }}>
                                            <button className="m-0 p-0 text-truncate  btn btn-warning p-1 col mx-1">
                                                <FaEdit size={20} />
                                            </button>

                                        </ShiftGroupModal>

                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }

                <ShiftGroupModal onAccept={(data) => {
                    addGroup(data);
                }}>
                    <div className="col-12 col-md-4  col-lg-3 ">
                        <button className="btn  btn-primary col-12  p-2 text-center " style={{ height: '9rem' }}>
                            <h4 className="iranSansBold">تعریف گروه جدید + </h4>
                        </button>
                    </div>

                </ShiftGroupModal>

            </div >
        </>

    );
}

