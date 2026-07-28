import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { BsFillLockFill } from 'react-icons/bs'
import LockDriverModal from '../modals/lockDriverModal';
import LockStatusModal from '../modals/lockStatusModal';
export default function PersonCard(props) {
    var [showDD, setShowDD] = useState(false)

    const showDropdown = (e) => {
        setShowDD(!showDD);
    }
    const hideDropdown = e => {
        setShowDD(false);
    }


    var [showLockStatus, setShowLockStatus] = useState(false)
    return (


        <div className='card p-1 my-2 aPointer card-hover  ' key={props?.person?.id}
            onMouseLeave={hideDropdown}
            onClick={(e) => {
                // showDropdown()
                // props?.onClick(props.person)
                // props.onEditPress(props.person)

            }} >

            <div className='row align-items-center'>

                <div className='row col-11'

                    onClick={(e) => {
                    }}>
                    <div className='col-12 col-md-6 col-lg-3' >
                        <label className="opacity-50 iranSans ms-2 noSelect"  >
                            نام :
                        </label>
                        <label className="iranSansBold" >
                            {props?.person?.firstName + ' ' + props?.person?.lastName}
                        </label>
                    </div>
                    <div className='col-12 col-md-6 col-lg-3 ' >
                        <label className="opacity-50 iranSans ms-2 noSelect" >
                            شماره هوشمند :
                        </label>
                        <label className="iranSansBold" >
                            {props?.person?.smartCode}
                        </label>
                    </div>


                    <div className=' col-12 col-md-6 col-lg-3 '>

                        <label className="iranSans ms-2 opacity-50 noSelect " >
                            کدملی :
                        </label>
                        <label className="iranSansBold">
                            {props?.person?.natCode}
                        </label>
                    </div>

                    <div className=' col-12 col-md-6 col-lg-3 '>

                        <label className="iranSans ms-2 opacity-50  noSelect" >
                            نام پدر :
                        </label>
                        <label className="iranSansBold">
                            {props?.person?.fatherName}
                        </label>
                    </div>

                </div>

                <div className='col-1  justify-content-end d-flex p-0 m-0 py-2' >

                    {
                        props?.person?.isLock == 1 ?
                            <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex'
                                onClick={() => {
                                    console.log('ssssssssssssssssssssssssssss')
                                    setShowLockStatus(true)
                                }}
                                style={{ width: '2rem', height: '2rem' }}>
                                <BsFillLockFill
                                    className=''

                                    style={{ height: '100%' }} />
                            </div>
                            :
                            <></>
                    }

                    <Dropdown className='' show={showDD} onClick={showDropdown} >
                        <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    props.onEditPress(props.person)
                                }} >ویرایش</Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    setShowLockStatus(true)
                                }} >تاریخچه قفل</Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    props.onRemovePress(props.person)
                                }} >حذف </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>

  
            <LockStatusModal
                show={showLockStatus}
                person={props?.person}
                onClose={() => {
                    setShowLockStatus(false)
                }} />
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