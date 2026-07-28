import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'


import CompanyDropDown from "components/dropdowns/companyDropDown";
import LinesDropDown from "components/dropdowns/linesDropDown";
import StationsDropDown from "components/dropdowns/stationsDropDown";
import CarClassDropDown from "components/dropdowns/carClassDropDown";
import CarDegreeDropDown from "components/dropdowns/carDegreeDropDown";
import Input from "components/customeTag/input";
import { IoClose } from "react-icons/io5";

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import CheckBox from "../components/customeTag/checkBox";


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


                    <form className="row">

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
                                    name="carDegree"
                                    value={currentTariff?.carDegree}
                                    onChange={readChange}
                                />
                            </div>

                            <label style={titleStyle}>حداقل قیمت روز</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="حداقل قیمت روز" name="minPriceDay" value={currentTariff?.minPriceDay} />
                            <label style={titleStyle}>حداقل قیمت شب</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="حداقل قیمت شب" name="minPriceNight" value={currentTariff?.minPriceNight} />
                            <label style={titleStyle}>مبلغ ورودی</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ ورودی" name="incomePrice" value={currentTariff?.incomePrice} />
                            <label style={titleStyle}>مبلغ هر کیلومتر حرکت</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/km حرکت" name="pricePerKM" value={currentTariff?.pricePerKM} />



                        </div>
                        <div className="col-12  col-lg-3">
                            <label style={titleStyle}>از ایستگاه</label>
                            <div className=" ">
                                <StationsDropDown
                                    name="startStation"
                                    value={currentTariff?.startStation}
                                    onChange={readChange}
                                />
                            </div>

                            <label style={titleStyle}>تا ایستگاه</label>
                            <div className=" ">
                                <StationsDropDown
                                    name="endStation"
                                    value={currentTariff?.endStation}
                                    onChange={readChange}
                                />
                            </div>


                            <label style={titleStyle}>مبلغ هر دقیقه توقف</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/دقیقه توقف" name="pricePerStopingMin" value={currentTariff?.pricePerStopingMin} />
                            <label style={titleStyle}>مبلغ هر دقیقه حرکت</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ/دقیقه حرکت" name="pricePerMovingMin" value={currentTariff?.pricePerMovingMin} />
                            <label style={titleStyle}>مسافت رایگان</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مسافت رایگان" name="freeDistance" value={currentTariff?.freeDistance} />
                            <label style={titleStyle}>توقف رایگان</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="توقف رایگان" name="freeStopTime" value={currentTariff?.freeStopTime} />
                            <label style={titleStyle}>حرکت رایگان</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="حرکت رایگان" name="freeMoveTime" value={currentTariff?.freeMoveTime} />
                            <label style={titleStyle}>گرد کردن اعشار تا </label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="گرد تا" name="roundNumber" value={currentTariff?.roundNumber} />
                            <label style={titleStyle}>حداقل سرعت حرکت</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="حداقل سرعت حرکت" name="maxStopSpeed" value={currentTariff?.maxStopSpeed} />



                        </div>

                        <div className="col-12  col-lg-3">

                            <label style={titleStyle}>محدوده قیمت ثابت</label>
                            <div className=" ">
                                <StationsDropDown
                                    name="toArea"
                                    value={currentTariff?.toArea}
                                    onChange={readChange}
                                />
                            </div>

                            <label style={titleStyle}>قیمت ثابت</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="قیمت ثابت" name="staticPrice" value={currentTariff?.staticPrice}
                                disabled={!currentTariff?.toArea} />

                            <label style={titleStyle}>شروع ساعت شب از </label>

                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="شب از" name="nightFrom" value={currentTariff?.nightFrom} />
                            <label style={titleStyle}>پایان ساعت شب تا </label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="شب تا" name="nightTo" value={currentTariff?.nightTo} />

                            <label style={titleStyle}>درصد شب</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="درصد شب" name="nightPercent" value={currentTariff?.nightPercent} />
                            <label style={titleStyle}>درصد روز</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="درصد روز" name="dayPercent" value={currentTariff?.dayPercent} />
                            <label style={titleStyle}>درصد شرایط خاص</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="درصد شرایط خاص" name="specialPercent" value={currentTariff?.specialPercent} />
                            <label style={titleStyle}>مبلغ کولر</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ کولر" name="coolerPrice" value={currentTariff?.coolerPrice} />
                            <label style={titleStyle}>مبلغ بیمه</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ بیمه" name="insurancePrice" value={currentTariff?.insurancePrice} />

                        </div>
                        <div className="col-12  col-lg-3">
                            <label style={titleStyle}>مبلغ نفر اضافه</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ نفر اضافه" name="extraPassenger" value={currentTariff?.extraPassenger} />

                            <label style={titleStyle}>مبلغ بار اضافه</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="مبلغ بار اضافه" name="extraLoad" value={currentTariff?.extraLoad} />
                            <label style={titleStyle}>درصد بازگشت به مبدا</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="درصد بازگشت به مبدا" name="back2originPercent" value={currentTariff?.back2originPercent} />
                            <label style={titleStyle}>درصد مبلغ ورودی مسیر دوم</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="درصد مبلغ ورودی مسیردوم" name="percentSecondPathFromStartPrice" value={currentTariff?.percentSecondPathFromStartPrice} />
                            <label style={titleStyle}>هزینه پارکینگ</label>
                            <Input className="form-control" thousandSeparator onKeyDown={handleEnter} onChange={readChange} type="number" placeholder="هزینه پارکینگ" name="parkingPrice" value={currentTariff?.parkingPrice} />
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
                                                saveDate: new Date(date.unix * 1000)
                                            })
                                    }}
                                    value={currentTariff?.saveDate || ''}
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
                                                archiveDate: new Date(date.unix * 1000)
                                            })
                                    }}
                                    value={currentTariff?.archiveDate || ''}
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
                                    name="useInAppSevice"
                                    onChange={readChecked}
                                    checked={currentTariff?.useInAppSevice == 1}
                                />
                                <CheckBox title="تلفنی"
                                    name="useInCallSevice"
                                    onChange={readChecked}
                                    checked={currentTariff?.useInCallSevice == 1}
                                />
                            </div>

                        </div>

                    </form>
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
