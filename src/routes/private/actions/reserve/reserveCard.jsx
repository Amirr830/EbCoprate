import Dropdown from 'react-bootstrap/Dropdown';
import React, { useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { dateTimeStr } from '../../../../helper/dateHelper';
import { createSearchParams, useNavigate } from 'react-router-dom';
import paths from '../../../../app/paths.json'
import SearchCar from '../../../../modals/searchCar';
import ReserveDetails from './reserveDetails';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import answerModal from '../../../../modals/answerModal';
export default function ReserveCard(props) {
    var [showDD, setShowDD] = useState(false)
    var [showSearchCar, setShowSearchCar] = useState(false)
    const [value, setValue] = useState(new Date());

    var pickerRef = useRef()
    const showDropdown = (e) => {
        setShowDD(!showDD);
    }
    const hideDropdown = e => {
        setShowDD(false);
    }



    const navigate = useNavigate();
    return (
        <div className='card p-1 my-2 aPointer card-hover  ' key={props?.reserve?.reserveId}
            onMouseLeave={hideDropdown}
            style={{ background: props?.reserve?.status == 1 ? '#0da1002f' : (props?.reserve?.status == 0 ? '' : '#ff00152f') }}
            onClick={(e) => {
            }} >

            <div className='row align-items-center p-0 m-0 '
            >

                <div className='row col-11 '

                    onClick={(e) => {
                    }}>

                    <div className='d-flex col-1  p-2' >

                        <div className={
                            (props?.reserve?.status == 0 ? "card bg-dark justify-content-center"
                                : (props?.reserve?.status == 1 ? "bg-success card justify-content-center " : "bg-danger card justify-content-center ")
                            )}
                        >
                            <label className="iranSansBold text-light text-center  verticaltext_content m-1 " >
                                {props?.reserve?.statusStr}
                            </label>
                        </div>

                    </div>
                    <div className='col-10'>

                        <div className='d-flex' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3"  >
                                نام :
                            </label>
                            <label className="iranSansBold col-9" >
                                {props?.reserve?.customerName}
                            </label>
                        </div>
                        <div className='d-flex' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                ساعت درخواست :
                            </label>
                            <label className="iranSans col-9" >
                                {dateTimeStr(props?.reserve?.reqTime)}
                            </label>
                        </div>
                        <div className='d-flex ' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                ساعت رزرو :
                            </label>
                            <label className="iranSans col-9" >
                                {dateTimeStr(props?.reserve?.reserveTime)}
                            </label>
                        </div>
                        <hr className='m-0 my-1' />
                        <div className='d-flex' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                مبدا :
                            </label>
                            <label className="iranSansBold text-primary  col-9" >
                                {props?.reserve?.oAddress}
                            </label>
                        </div>
                        <div className='d-flex' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                مقصد :
                            </label>
                            <label className="iranSansBold  text-danger col-9" >
                                {props?.reserve?.d1Address}
                            </label>
                        </div>
                        <hr className='m-0 my-1' />
                        {props?.reserve?.driverCode ?
                            <>
                                <div className='d-flex' >
                                    <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                        نام راننده :
                                    </label>
                                    <label className=" col-9" >
                                        {props?.reserve?.driverCode} - {props?.reserve?.driverName}
                                    </label>
                                </div>

                                <hr className='m-0 my-1' />
                            </>
                            :
                            <></>}
                        <div className='d-flex' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                مبلغ :
                            </label>
                            <label className=" col-9" >
                                {props?.reserve?.priceStr}
                            </label>
                        </div>
                        <div className='d-flex' >
                            <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                توضیحات :
                            </label>
                            <label className=" col-9" >
                                {props?.reserve?.desc}
                            </label>
                        </div>
                    </div>
                </div>

                <div className='col-1  justify-content-end d-flex p-0 m-0 py-2' >
                    <Dropdown className='' show={showDD} onClick={showDropdown} >
                        <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {props.reserve.status == 0
                                ?
                                <Dropdown.Item
                                    onClick={(e) => {
                                        setShowSearchCar(true)
                                    }} >انتساب راننده
                                </Dropdown.Item>
                                :
                                <Dropdown.Item
                                    onClick={() => {
                                        answerModal.show('آیا از حذف انتساب این خودرو مطمئن هستید؟')
                                    }}>حذف انتصاب</Dropdown.Item>
                            }
                            <a className="btn aPointer text-start  w-100 px-3 m-0 card-hover " href={"tel:" + props?.person?.mobile}>
                                تماس با مسافر
                            </a>

                            <ReserveDetails data={props?.reserve}>
                                <Dropdown.Item>جزئیات</Dropdown.Item>
                            </ReserveDetails>



                            <Dropdown.Item onClick={(e) => {
                                pickerRef.current.openCalendar()
                            }}>
                                ویرایش ساعت رزرو
                            </Dropdown.Item>

                            {/* 
                            <ReserveDetails>

                                <Dropdown.Item
                                    onClick={(e) => {
                                        navigate(paths.private.actions.reserveDetails, { state: props?.reserve })
                                    }} >جزئیات
                                </Dropdown.Item>
                            </reserveDetails> */}

                            {props.reserve.status != -1 ?

                                <Dropdown.Item
                                    onClick={(e) => {
                                        props.onCancel(props.reserve)
                                    }} >لغو
                                </Dropdown.Item>
                                : <></>}

                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>

            <SearchCar
                show={showSearchCar}
                onClose={() => { setShowSearchCar(false) }}
                onSelect={(car) => {
                    props.onAccept(car.driverCode, props.reserve)
                    setShowSearchCar(false)
                }} />

            <DatePicker
                disableDayPicker
                className="rmdp-mobile"
                ref={pickerRef}

                plugins={[
                    <TimePicker />
                ]}
                containerStyle={{ width: 0, height: 0, overflow: "hidden" }}
                inputClass="d-none"
                onChange={(date) => {
                    console.log(date, value)
                    answerModal.show("آیا از ویرایش تاریخ رزرو اطمینان دارید؟", () => {
                        if (date)
                            setValue(new Date(date.unix * 1000))
                    }, () => {
                    })
                }}

                value={value}

                calendar={persian}
                locale={persian_fa}
            />
        </div >
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