import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa"
import { RiRadioButtonLine } from 'react-icons/ri'
import './ipCard.css'

function IpCard(props) {
    return (
        <>
            {
                props.item.active == 1 ?
                    <div className={"bgCard m-2 default col-12 col-md-12 col-lg-4"} dir="rtl">
                        <Content item={props.item} />
                    </div>
                    :
                    <div className={"bgCard m-2 col-12 col-md-12 col-lg-4"} dir="rtl">
                        <Content item={props.item} />
                    </div>
            }

        </>
    );
}

function Content(props) {

    return (
        <>

            {props.item.isAccess==1 ?
                <div className="d-flex flex-row align-items-center text-success">
                    <RiRadioButtonLine size='20px' />
                    <p className="iranSansBold noSelect m-0 p-0 mx-2">
                        در دسترس
                    </p>
                </div>
                :
                <div className="d-flex flex-row align-items-center text-danger">
                    <RiRadioButtonLine size='20px' />
                    <p className="iranSansBold noSelect m-0 p-0 mx-2">
                        عدم دسترسی
                    </p>
                </div>
            }
            <h4 className="iranSansBold noSelect my-2">
                {props.item.name}

            </h4>
            <p className="enFontBold noSelect m-0 p-0 ">
                {props.item.ip}

            </p>
        </>
    )
}
export default IpCard;
