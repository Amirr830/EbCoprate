import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";
import endpoints from '../../../app/endpoints';
import { RiRefreshFill } from "react-icons/ri";
import { AxiosPrivate } from '../../../app/axiosPrivate';
export default function Verify() {

    var [verifyCode, setVerifyCode] = useState([])
    useEffect(() => {
        getVerifyCode()
    }, [])

    var getVerifyCode = () => {
        AxiosPrivate.get(endpoints.reportVerify,
            {
                params: {
                }
            }).then((res) => {
                setVerifyCode(res.data)
            })
    }

    return (
        <div>
            <div className='row d-flex'>
                <h1 className='col-5 text-center'>
                    درخواست دهنده
                </h1>
                <h1 className='col-5 text-center'>
                    کد
                </h1>
                <h1 className='col-2 text-center'>
                    <RiRefreshFill size={35} className="me-auto text-hover aPointer" onClick={() => {
                        getVerifyCode()
                    }} />
                </h1>


            </div>
            <div className='d-flex row g-2'>

                {verifyCode.map((item, index) => {
                    return <div className='card' key={index}>
                        <div className='row d-flex'>
                            <h1 className='col-5 text-center'>
                                {item.phoneNumber}
                            </h1>
                            <h1 className='col-5 text-center'>
                                {item.vCode}
                            </h1>
                        </div>
                    </div>
                })}


            </div >
        </div>

    )
} 