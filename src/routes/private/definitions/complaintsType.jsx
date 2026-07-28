import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgClose } from 'react-icons/cg'
import toast from "../../../components/toast";
import endpoints from "../../../app/endpoints";
import { AxiosPrivate } from "../../../app/axiosPrivate"
import loaderModal from "../../../modals/loaderModal";

export default function ComplaintsType() {
    var [complaintsType, setComplaintsType] = useState([]);
    var getComplaintsType = (loader) => {
        if (!loader)
            var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.complaintsType)
            .then((res) => {
                setComplaintsType(res?.data)
            }).finally(() => {
                loaderModal.close(loader)
            })
    }


    var onRemoveComplaintsType = (item) => {
        var loader = loaderModal.load()
        AxiosPrivate.delete(endpoints.complaintsType, { item })
            .then((res) => {
                toast.Success(res?.data?.msg)
                getComplaintsType(loader)
            })
    }

    useEffect(() => {
        getComplaintsType()
    }, [])

    return (
        <>
            <div className="container overflow-hidden" dir="rtl" >
                <div className="row g-2 ">
                    {complaintsType.map((item, index) => {
                        return <div className="col-12 col-sm-6 col-md-4 col-lg-3  " key={index} >
                            <div className="card d-flex py-2 flex-row justify-content-center align-items-center">
                                <h2 className="text-center  w-100">{item.typeName}</h2>
                                <CgClose className="text-danger aPointer mx-2" size={25} onClick={() => {
                                    onRemoveComplaintsType(item)
                                }} />
                            </div>
                        </div>


                    })}
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 aPointer  " onClick={() => {
                        toast.Success('با موفقیت افزوده شد')
                    }}>
                        <div className="card d-flex py-2 flex-row justify-content-center align-items-center bg-warning">
                            <h2 className="text-center  w-100">افزودن نوع جدید</h2>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
