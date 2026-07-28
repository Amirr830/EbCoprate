import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from '../app/paths.json'
import Storages from "../app/storages";
import { MdDns } from "react-icons/md"
import { FaChevronDown, FaChevronLeft } from "react-icons/fa"
import { TbPointFilled } from "react-icons/tb"
import './sidebarTab.css'
import { width } from "@mui/system";
function SidebarTab(props) {
    var navigate = useNavigate()
    var back = "back"
    function is_part_of(a, b) {
        if (a > b) {
            return false;
        }

        // بررسی اینکه آیا a برابر با b است یا خیر.
        if (a === b) {
            return true;
        }

        // بررسی اینکه آیا a بخشی از b است.
        return b % a === 0;
    }
    return (
        <>
            {
                props.item.access == false
                    ?
                    <></>
                    :
                    <div className={"back noSelect aPointer level" + props.level} onClick={props.onClick} >
                        {props?.active ? <h5 /> : <></>}


                        {props?.active ? <div className="bg-primary p-0 m-0 h-100" style={{ width: '0.5rem' }} />
                            : <div className="bg-dark   opacity-25 p-0 m-0 h-100" style={{ width: '0.5rem' }} />

                        }

                        <div className="text-end w-auto p-0 m-0 pe-1 d-flex align-items-center ">
                            <div className='d-flex justify-content-center align-items-center  ' style={{ width: '2rem', height: '2rem' }}>
                                {/* {props.item.icon} */}

                                {props.item?.sub?.length > 0 ?
                                    props.open == props.item.id ? <FaChevronDown className="text-end w-auto text-hover  p-0 m-0 px-2 me-auto px-2 " size="15" />
                                        : <FaChevronLeft className="text-end w-auto text-hover  p-0 m-0 px-2 me-auto px-2 " size="15" />
                                    : <></>}
                            </div>

                            {props.item.name}


                        </div>


                    </div>
            }


        </>
    );
}

export default SidebarTab;
