import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import LockStatusModal from '../modals/lockStatusModal';
import { BsFillLockFill } from 'react-icons/bs'

export default function SubscriberCard(props) {
    var [showDD, setShowDD] = useState(false)

    const showDropdown = (e) => {
        setShowDD(!showDD);
    }
    const hideDropdown = e => {
        setShowDD(false);
    }
    return (


        <div className='card p-1 my-2 aPointer card-hover  '
            key={props?.person?.id}
            dir="rtl"
            onMouseLeave={hideDropdown}
        >

            <div className='row align-items-center p-0 m-0'>

                <div className='row align-items-center col-12'>
                    <div className='row col-11  m-0 p-0'
                        onClick={(e) => {
                        }}>
                        <label className="col-12 col-lg-2">{props?.data?.sName}</label>
                        <label className="col-12 col-lg-2">{props?.data?.sMobile}</label>
                        <label className="col-12 col-lg-2">{props?.data?.sAddress}</label>
                        <label className="col-12 col-lg-2">{props?.data?.sOriginStCode}</label>
                        <label className="col-12 col-lg-2">{props?.data?.sGrade}</label>
                        <label className="col-12 col-lg-2">{props?.data?.sEmail}</label>
                    </div>

                    <div className='col-1  justify-content-end d-flex p-0 m-0 py-2' onClick={showDropdown} >
                        <Dropdown className='' show={showDD}>
                            <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={(e) => {
                                    props?.onEditPress(props.person)
                                }} >ویرایش</Dropdown.Item>

                                <Dropdown.Item onClick={(e) => {
                                    // showDropdown()
                                    props?.onRemovePress(props.person)

                                }} >حذف </Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
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