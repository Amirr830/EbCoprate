import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { MdTripOrigin } from 'react-icons/md'
import { BsFillCircleFill } from 'react-icons/bs'
import { CgBorderStyleDashed } from 'react-icons/cg'
import paths from '../app/paths.json'
import { MdOutlineAirlineSeatReclineExtra } from 'react-icons/md'
import { dateStr, milisecond2timeStr, persianString, timeStr, yyyymmdd } from '../helper/dateHelper';
import { setComma } from '../helper/numberHelper';
import TripRoute from '../modals/tripRoute';
import { useNavigate } from 'react-router-dom';
import { CheckAccess } from '../app/checkAccess';

export default function ReportTaximeterCard(props) {
    var [showDD, setShowDD] = useState(false)

    const showDropdown = (e) => {
        setShowDD(!showDD);
    }

    var navigate = useNavigate()
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
    return (


        <div className='card p-1 my-2 aPointer card-hover  '
            key={props?.person?.id}
            dir="rtl"
            onMouseLeave={hideDropdown}
            onMouseEnter={mouseEnter}
            onClick={(e) => {
                // showDropdown()
                // props?.onClick(props.person)
                props.onEditPress(props.person)

            }} >

            <div className='row align-items-center p-0 m-0'>

                <div className='row align-items-center col-12'>
                    <div className='row col-11  m-0 p-0'
                        onClick={(e) => {
                        }}>
                        <div className='col-12 row mt-1'>
                            <label className="iranSansBold card px-2 bg-warning text-center " style={{ width: '8rem', height: '2rem' }} >
                                {props?.taximeter?.pIran}  -  {props?.taximeter?.p3} {props?.taximeter?.ph} {props?.taximeter?.p2}
                            </label>
                            <label className="iranSansBold text-end  text-truncate col-1 d-none d-lg-block" >
                                <MdOutlineAirlineSeatReclineExtra /> {props?.taximeter?.chairPosition}
                            </label>

                            <label className="iranSansBold text-end  text-truncate col-1 d-none d-lg-block" >
                                {props?.taximeter?.driverCode}
                            </label>
                            <label className="iranSansBold text-end  text-truncate col-4 col-lg-3  d-none d-md-block " >
                                {dateStr(props?.taximeter?.startDate)}   {timeStr(props?.taximeter?.startDate)}
                            </label>
                            <label className="iranSansBold text-end   text-truncate col-2 d-block d-md-none " >
                                {props?.taximeter?.distance > 2000 ? props?.taximeter?.distance / 1000 + " km" : props?.taximeter?.distance + " متر"}
                            </label>
                            <label className="iranSansBold text-end   text-truncate col-2 d-none d-md-block " >
                                {props?.taximeter?.distance > 2000 ? props?.taximeter?.distance / 1000 + " km" : props?.taximeter?.distance + " متر"}
                            </label>
                            <label className="iranSansBold text-end text-danger  text-truncate col-3 col-lg-2" >
                                {setComma(props?.taximeter?.price)} تومان
                            </label>


                        </div>
                    </div>

                    <div className='col-1  justify-content-end d-flex p-0 m-0 py-2' onMouseEnter={showDropdown} >
                        <TripRoute data={props?.taximeter}>

                            <button className='btn btn-primary' >نمایش مسیر</button>
                        </TripRoute>


                        <Dropdown className='d-none' show={showDD}>
                            <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <TripRoute data={props?.taximeter}>

                                    <Dropdown.Item onClick={(e) => {
                                        // showDropdown()
                                        // navigate(paths.private.reports.tripRoute, { state: props?.taximeter })

                                        // e.stopPropagation()
                                    }} >نمایش مسیر</Dropdown.Item>
                                </TripRoute>

                                <Dropdown.Item onClick={(e) => {
                                    // showDropdown()
                                    props.onRemovePress(props.person)
                                    e.stopPropagation()

                                }} >نمایش تعرفه </Dropdown.Item>

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

                            </div>
                        })}



                    </div>
                    : <></>}

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