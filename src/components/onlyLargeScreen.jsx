import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnlyLargeScreen(props) {
    var navigate = useNavigate()
    return (<>
        <div className="d-none d-lg-block">
            {props.children}
        </div>
        <div className="d-block d-lg-none row  p-0 m-0 mt-5 pt-5">
            <h2 className=" iranSansBold col-12 text-center ">شرمنده</h2>
            <h5 className="  col-12 text-center ">  این صفحه فقط در صفحه نمایش های بزرگ  در دسترس است</h5>
            <div className="d-flex justify-content-center align-items-center">

                <button
                    className="btn btn-primary  w-auto iranSansBold  mt-3"
                    onClick={() => {
                        navigate(-1)
                    }
                    }>بازگشت</button>
            </div>
        </div>
    </>
    );
}
