import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { BsFillLockFill } from 'react-icons/bs'
import { RiInboxArchiveFill } from "react-icons/ri";

export default function TariffCard(props) {
    return (
        <div className='card p-1 my-2 aPointer card-hover col-12 col-md-6 col-lg-3' >
            <div className='row w-auto'
                onClick={(e) => {
                }}>
                <div className='col-12 ' >
                    <label className="opacity-50 iranSans small  noSelect col-4" >
                        نام :
                    </label>
                    <label className="iranSansBold small col-8 " >
                        {props?.data?.tariffName}
                    </label>
                </div>
                <div className='col-12 ' >
                    <label className="opacity-50 iranSans small  noSelect col-4" >
                        نوع :
                    </label>
                    <label className="iranSansBold small col-8 " >
                        {props?.data?.className}
                    </label>
                </div>
                <div className='col-12 ' >
                    <label className="opacity-50 iranSans small  noSelect col-4" >
                        ورودی :
                    </label>
                    <label className="iranSansBold small col-8 " >
                        {props?.data?.incomePrice}

                    </label>
                </div>
                <div className='col-12 ' >
                    <label className="opacity-50 iranSans small  noSelect col-4" >
                        هر کیلومتر :
                    </label>
                    <label className="iranSansBold small col-8 " >
                        {props?.data?.pricePerKM}
                    </label>
                </div>
                <div className='col-12 ' >
                    <label className="opacity-50 iranSans small  noSelect col-4 " >
                        هر دقیقه توقف :
                    </label>
                    <label className="iranSansBold small col-8  " >
                        {props?.data?.pricePerStopingMin}
                    </label>
                </div>

            </div>


        </div>

    )
}