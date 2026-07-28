import { useState } from "react"
import { TbBuildingBroadcastTower } from "react-icons/tb";
import { FaCircleDot, FaCircle, FaStar, FaRegStar } from "react-icons/fa6";

export default function TripManageHeader(props) {

    return (

        <div className=' aPointer w-auto bg-white px-1' >
            <div className='row m-0 p-1  '>
                <div className='d-flex m-0 p-0 align-items-top '  >

                    <div className='col-1 text-end px-2 '
                        style={{ width: '3rem' }}>
                        <label className='text-center noSelect small col-12'>
                            ایستگاه
                        </label>
                    </div>
                    <div className="vr col-1" />
                    <div className="col-1 d-flex  "
                        style={{ width: '2rem' }}>
                        <label className='text-center noSelect small col-12'>
                            آزاد
                        </label>
                    </div>
                   
                    <div className="vr col-1" />
                    <div className='col-1 text-end px-2 noSelect'
                        style={{ width: '8rem' }}>
                        <label className='text-end noSelect small col-12'>
                            نام مشترک
                        </label>
                    </div>
                    <div className="vr col-1" />
                    <div className='col-1 text-end px-2 noSelect'
                        style={{ width: '18rem' }}>
                        <label className='text-end noSelect small col-12'>
                            آدرس
                        </label>
                    </div>
                    <div className="vr col-1" />
                    <label className='col-1 text-center noSelect small' style={{ width: '3.5rem' }}>تماس</label>
                    <div className="vr col-1" />
                    <label className='col-1 text-center px-2 noSelect small'
                        style={{ width: '7rem' }}>
                        کد سفر
                    </label>
                    <div className="vr col-1" />
                    <label className='col-1 text-end px-2 noSelect small'
                        style={{ width: '20rem' }}>
                        توضیحات
                    </label>

                </div>
            </div>
        </div >
    )
}