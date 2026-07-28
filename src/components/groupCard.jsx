import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { BsFillLockFill } from 'react-icons/bs'
import LockDriverModal from '../modals/lockDriverModal';
import LockStatusModal from '../modals/lockStatusModal';
import { MdCall } from "react-icons/md";
import { Tb2Fa } from "react-icons/tb";

export default function UserCard(props) {
    var [showDD, setShowDD] = useState(false)

    const showDropdown = (e) => {
        setShowDD(!showDD);
    }
    const hideDropdown = e => {
        setShowDD(false);
    }

    return (
        <div className={'card p-1 my-2  card-hover '}
            style={{ background: (props?.group?.isArchive == 0 ? '' : '#ff00152f') }}
            key={props?.group?.id}
            onMouseLeave={hideDropdown}
        >
            <div className='row align-items-center'>

                <div className='row col-10'
                    onClick={(e) => {
                    }}>
                    <div className='col-12 col-md-6 col-lg-3' >
                        <label className="opacity-50 iranSans ms-2 noSelect"  >
                            نام :
                        </label>
                        <label className="iranSansBold" >
                            {props?.group?.name + ' ' + props?.group?.name}
                        </label>
                    </div>
                    <div className=' col-12 col-md-6 col-lg-3 '>
                        <label className="iranSans ms-2 opacity-50  noSelect" >
                            سطح دسترسی :
                        </label>
                        <label className="">
                            {props?.group?.accessLevel}
                        </label>
                    </div>
                    <div className=' col-12 col-md-6 col-lg-3 '>
                        <label className="iranSans ms-2 opacity-50  noSelect" >
                            تعداد اعضا :
                        </label>
                        <label className="">
                            {props?.group?.memberCount}
                        </label>
                    </div>
                </div>

                <div className='col-2  justify-content-end d-flex p-0 m-0 py-2' >
                    {
                        <div className='row ms-2 '>
                            {props.user.twoStepVerify ? <Tb2Fa size={30} /> : <></>}
                        </div>
                    }

                    <Dropdown className='' show={showDD} onClick={showDropdown} >
                        <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    props.onEditPress(props.user)
                                }} >ویرایش</Dropdown.Item>

                            <Dropdown.Item
                                onClick={(e) => {
                                    props.onRemovePress(props.user)
                                }} >اعضا</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>
        </div>

    )
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex' style={{ width: '2rem', height: '2rem' }}>
            <SlOptions
                className=''
                style={{ height: '100%' }} />
        </div>

    </a>
));