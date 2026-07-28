import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'


import CompanyDropDown from "components/dropdowns/companyDropDown";
import LinesDropDown from "components/dropdowns/linesDropDown";
import StationsDropDown from "components/dropdowns/stationsDropDown";
import CarClassDropDown from "components/dropdowns/carClassDropDown";
import CarDegreeDropDown from "components/dropdowns/carDegreeDropDown";
import Input from "components/customeTag/input";
import { IoAtCircle, IoClose } from "react-icons/io5";

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import CheckBox from "components/customeTag/checkBox";
import AddTariffRules from "./addTariffRules";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

var titleStyle = {
    marginTop: '10px',
    opacity: '50%',
    color: 'blue',
    fontSize: '0.8rem'
}

export default function AddTariff(props) {

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name
        setCurrentTariff({
            ...currentTariff,
            [name]: value
        })
    }
    var readChecked = (e) => {
        var value = e.target.checked
        var name = e.target.name
        console.log(value)

        setCurrentTariff({
            ...currentTariff,
            [name]: value ? 1 : 0
        })
    }

    var [currentTariff, setCurrentTariff] = useState(props?.item)
    var [tariffSpCo, setTariffSpCo] = useState([])


    useEffect(() => {
        if (show) {

            console.log(props?.item)

            setCurrentTariff(props?.item)
        }
    }, [show])

    const handleClose = () => {
        setShow(false)
    }

    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        setShow(true)
    };


    var addRule = (params) => {
        var cstr = params.conditionStr + ' از ' + params.fromValue + ' تا ' + params.toValue + ' ' + params.priceTypeStr + ' ' + params.price + 'ریال';
        setCurrentTariff((prev) => ({
            ...prev,
            rules: [...(prev?.rules ?? []), { ...params, ruleStr: cstr }],
        }));
    }


    const newFirstChild = React.cloneElement(
        props.children?.length > 1
            ? props.children[0]
            : props.children,
        { onClick: handleShow });


    return (<>
        {newFirstChild}
        <Modal show={show} onHide={handleClose} size="xl" dir="rtl" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header" style={{ background: "#ECEFF1" }}>
                <div className="d-flex flex-column px-1">
                    <h4 className="text-danger text-center">****دقت شود تمام ورودی ها مبلغ به ریال و تمام مسافت ها به متر میباشد****</h4>

                    <div className="row">

                        <div className="col-12  col-lg-3 ">

                            <label style={titleStyle}>نام تعرفه</label>
                            <input className="form-control" onKeyDown={handleEnter} onChange={readChange} placeholder="نام تعرفه" name="tariffName" value={currentTariff?.tariffName} />

                            <label style={titleStyle}>شرکت</label>
                            <div className="p-0">

                                <CompanyDropDown
                                    onChange={readChange}
                                    value={currentTariff?.companyCode}
                                    name="companyCode" />
                            </div>

                            <label style={titleStyle}>خط</label>
                            <div className=" ">
                                <LinesDropDown
                                    name="lineCode"
                                    value={currentTariff?.lineCode}
                                    onChange={readChange}
                                />
                            </div>

                            <label style={titleStyle}>نوع خودرو</label>
                            <div className=" ">
                                <CarClassDropDown
                                    name="classCode"
                                    value={currentTariff?.classCode}
                                    onChange={readChange}
                                />
                            </div>

                            <label style={titleStyle}>درجه</label>
                            <div className=" ">
                                <CarDegreeDropDown
                                    name="degree"
                                    value={currentTariff?.degree}
                                    onChange={readChange}
                                />
                            </div>
                            <label style={titleStyle}>از ایستگاه</label>
                            <div className=" ">
                                <StationsDropDown
                                    name="fromSt"
                                    value={currentTariff?.fromSt}
                                    onChange={readChange}
                                />
                            </div>

                            <label style={titleStyle}>تا ایستگاه</label>
                            <div className=" ">
                                <StationsDropDown
                                    name="toSt"
                                    value={currentTariff?.toSt}
                                    onChange={readChange}
                                />
                            </div>

                        </div>
                        <div className="col-12  col-lg-3">

                            <label style={titleStyle}>مبلغ ورودی</label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ ورودی" name="incomePrice" value={currentTariff?.incomePrice} />
                            <label style={titleStyle}>مبلغ هر کیلومتر حرکت</label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/km حرکت" name="pricePerKM" value={currentTariff?.pricePerKM} />


                            <label style={titleStyle}>مبلغ هر دقیقه توقف</label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/دقیقه توقف" name="pricePerStoppingMin" value={currentTariff?.pricePerStoppingMin} />

                            <label style={titleStyle}>مبلغ هر دقیقه ترافیک</label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/دقیقه ترافیک" name="pricePerTrafficMin" value={currentTariff?.pricePerTrafficMin} />

                            <label style={titleStyle}>مبلغ هر دقیقه حرکت</label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/دقیقه حرکت" name="pricePerMovingMin" value={currentTariff?.pricePerMovingMin} />

                        </div>

                        <div className="col-12  col-lg-3">

                            <label style={titleStyle}>حداقل سرعت حرکت</label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="حداقل سرعت حرکت" name="maxStopSpeed" value={currentTariff?.maxStopSpeed} />
                            <label style={titleStyle}>گرد کردن اعشار تا </label>
                            <Input className="form-control" thousandSeparator={true} onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="گرد تا" name="roundNumber" value={currentTariff?.roundNumber} />


                        </div>
                        <div className="col-12  col-lg-3">


                            <label style={titleStyle}>تاریخ شروع تعرفه</label>
                            <div className='col-12'>

                                <DatePicker
                                    format="dddd DD MMMM YYYY"
                                    className="rmdp-mobile"
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    inputClass='form-control'
                                    onChange={(date) => {
                                        if (date)
                                            setCurrentTariff({
                                                ...currentTariff,
                                                startTime: new Date(date.unix * 1000)
                                            })
                                    }}
                                    value={currentTariff?.startTime || ''}
                                    calendar={persian}
                                    locale={persian_fa}
                                />
                            </div>
                            <label style={titleStyle}>تاریخ خاتمه تعرفه</label>
                            <div className='col-12'>

                                <DatePicker
                                    format="dddd DD MMMM YYYY"
                                    className="rmdp-mobile"
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    inputClass='form-control col-12'
                                    onChange={(date) => {
                                        if (date)
                                            setCurrentTariff({
                                                ...currentTariff,
                                                endTime: new Date(date.unix * 1000)
                                            })
                                    }}
                                    value={currentTariff?.endTime || ''}
                                    calendar={persian}
                                    locale={persian_fa}
                                />
                            </div>
                            <label style={titleStyle}>مورد استفاده در </label>
                            <div className='col-12 card p-2'>
                                <CheckBox title="تاکسیمتر"
                                    name="useInTaximeter"
                                    onChange={readChecked}
                                    checked={currentTariff?.useInTaximeter == 1}
                                />
                                <CheckBox title="اپلیکیشن ها"
                                    name="useInCustomer"
                                    onChange={readChecked}
                                    checked={currentTariff?.useInCustomer == 1}
                                />
                                <CheckBox title="تلفنی"
                                    name="useInOperator"
                                    onChange={readChecked}
                                    checked={currentTariff?.useInOperator == 1}
                                />
                            </div>
                            <div className="mt-3">

                                <AddTariffRules
                                    onAcceptPress={(item) => { addRule(item) }}
                                    title="رونوشت"
                                >
                                    <button className="btn btn-primary col-12 ">
                                        افزودن شرط خاص
                                    </button>
                                </AddTariffRules>

                            </div>

                        </div>
                        <div className="col-12 mt-2">
                            {currentTariff?.rules?.map((item, index) => {
                                return <div className="card text-dark col-12 mt-2" style={{ background: "#ffd9003b" }}>
                                    <div className="d-flex align-items-center justify-content-start p-3">
                                        <FaArrowLeft className="text-danger ms-3" size={20} />
                                        <label className="iranSansBold">{item?.ruleStr}</label>
                                        <FaTrash className=" mx-2 me-auto aPointer text-hover" size={20} onClick={() => {

                                            setCurrentTariff((prev) => ({
                                                ...prev,
                                                rules: [
                                                    ...prev?.rules?.slice(0, index),
                                                    ...prev?.rules?.slice(index + 1)
                                                ],
                                            }));
                                        }} />
                                    </div>
                                </div>

                            })
                            }

                        </div>


                    </div>
                    <div className="px-1 mt-5 d-flex">
                        <button className="btn btn-success  w-100 " onClick={() => {
                            props?.onAcceptPress(currentTariff)
                            setShow(false)
                        }}>تایید</button>
                        <button className="btn btn-danger me-2" title="بستن بدون ذخیره تغییرات" onClick={() => {
                            setShow(false)
                            props?.onCancel(props.item)
                        }}><IoClose size={25} />
                        </button>
                    </div>

                </div>

            </Modal.Body>


        </Modal >
    </>)
}
