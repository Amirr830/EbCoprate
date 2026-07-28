import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import LockStatusModal from '../modals/lockStatusModal';
import { BsFillLockFill } from 'react-icons/bs'
import CarLineHistoryModal from '../modals/CarLineHistoryModal';
import CarDriversHistoryModal from '../modals/CarDriversHistoryModal';

export default function CarCard(props) {
    var [showDD, setShowDD] = useState(false)

    const showDropdown = (e) => {
        setShowDD(!showDD);
    }
    const hideDropdown = e => {
        setShowDD(false);
        setShowDetails(false)
        clearTimeout(timer)
    }
    const mouseEnter = (e) => {
        setTimer(setTimeout(() => {
            setShowDetails(true)
        }, 500))
    }

    const [timer, setTimer] = useState(null);

    var [showDetails, setShowDetails] = useState(false)
    var [currentOwner, setCurrentOwner] = useState(undefined)

    var [showLockStatus, setShowLockStatus] = useState(false)
    return (


        <div className='card p-1 my-2 aPointer card-hover  '
            key={props?.person?.id}
            dir="rtl"
            onMouseLeave={hideDropdown}
            // onMouseEnter={mouseEnter}
            onClick={(e) => {
                setShowDetails(!showDetails)

                // showDropdown()
                // props?.onClick(props.person)
                // props.onEditPress(props.person)

            }} >

            <div className='row align-items-center p-0 m-0'>

                <div className='row align-items-center col-12'>
                    <div className='row col-11  m-0 p-0'
                        onClick={(e) => {
                        }}>

                        <div className='row col-12 col-md-6 col-lg-4'>

                            <label className="iranSansBold card px-2 bg-warning text-center " style={{ width: '9rem', height: '2rem' }} >
                                {props?.car?.pIran}  -  {props?.car?.p3} {props?.car?.ph} {props?.car?.p2}
                            </label>
                            <label className="iranSansBold text-end  text-truncate col" >
                                {props?.car?.carTypeName}   {props?.car?.color}
                            </label>
                        </div>


                        <div className='col-12 col-md-6 col-lg-6 row mt-1'>
                            <label className="iranSansBold text-end col-4 text-truncate">
                                {props?.car?.carCode}
                            </label>
                            <label className="iranSansBold text-end text-truncate col-3" >
                                {props?.car?.driverCode}
                            </label>

                            <label className="iranSansBold text-end text-truncate col-4" >
                                {props?.car?.lineName}
                            </label>

                        </div>

                        <label className="iranSansBold text-end d-none d-lg-block text-truncate col-lg-2" >
                            {props?.car?.owners[0]?.firstName} {props?.car?.owners[0]?.lastName}
                        </label>

                    </div>

                    <div className='col-1  justify-content-end d-flex p-0 m-0 py-2' onClick={showDropdown} >
                        {
                            props?.car?.isLock == 1 ?
                                <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex'
                                    onClick={() => {

                                        setCurrentOwner(props?.car?.owners[0])
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
                        <Dropdown className='' show={showDD}>
                            <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={(e) => {
                                    props.onEditPress(props.person)
                                }} >ویرایش</Dropdown.Item>
                                <Dropdown.Item onClick={(e) => {

                                    setCurrentOwner(props?.car?.owners[0])
                                    setShowLockStatus(true)
                                }} >تاریخچه قفل</Dropdown.Item>
                                <CarLineHistoryModal carCode={props?.car?.carCode}>
                                    <Dropdown.Item onClick={(e) => {

                                        setCurrentOwner(props?.car?.owners[0])
                                        setShowLockStatus(true)
                                    }} >تاریخچه خط</Dropdown.Item>
                                </CarLineHistoryModal>
                                <CarDriversHistoryModal carCode={props?.car?.carCode}>

                                <Dropdown.Item onClick={(e) => {

                                    setCurrentOwner(props?.car?.owners[0])
                                    setShowLockStatus(true)
                                }} >تاریخچه رانندگان</Dropdown.Item>
                                </CarDriversHistoryModal>
                                
                                <Dropdown.Item onClick={(e) => {
                                    // showDropdown()
                                    props.onRemovePress(props.person)

                                }} >حذف </Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                {showDetails ?

                    <div className='col-12 card '>

                        {props?.car?.owners.map((owner, index) => {
                            return <div className='row py-2' key={index}>
                                <label className="px-2  text-center col-3  text-truncate"  >
                                    {owner?.firstName}    {owner?.lastName}
                                </label>
                                <label className="px-2  text-center col-2 "  >
                                    {owner?.type}
                                </label>
                                <label className="px-2  text-center  col-2"  >
                                    {owner?.smartCode}
                                </label>
                                <label className="px-2  text-center  col-3"  >
                                    {owner?.mobile}
                                </label>
                                {
                                    owner?.isLock == 1 ?
                                        <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex'
                                            onClick={() => {
                                                // console.log(owner)
                                                setCurrentOwner(owner)
                                                setShowLockStatus(true)

                                            }}
                                            style={{ width: '3rem', height: '2rem' }}>
                                            <BsFillLockFill
                                                style={{ height: '100%' }} />
                                        </div>
                                        :
                                        <></>
                                }

                            </div>
                        })}

                    </div>
                    : <></>}

            </div>

            <LockStatusModal
                show={showLockStatus}
                person={currentOwner}
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