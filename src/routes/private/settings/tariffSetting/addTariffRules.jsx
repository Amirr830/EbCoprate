import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'


import Input from "components/customeTag/input";
import { IoClose } from "react-icons/io5";

import toast from "components/toast";
import TariffParamsDropDown from "components/dropdowns/tariffParamsDropDown";
import TariffConditionsDropDown from "components/dropdowns/tariffConditionsDropDown";


var titleStyle = {
    marginTop: '10px',
    opacity: '50%',
    color: 'blue',
    fontSize: '0.8rem'
}

export default function AddTariffRules(props) {

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
        setRule({
            ...rule,
            [name]: value
        })
    }


    var [rule, setRule] = useState(props?.rule)


    // useEffect(() => {
    //     if (show) {

    //         console.log(props?.item)

    //         setCurrentTariff(props?.item)
    //     }
    // }, [show])

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
                <div className="row px-1">


                    {/* <form className="row"> */}
                    <div className="col-12 row g-2">

                        <div className="col-3">
                            <label style={titleStyle}>شرط</label>

                            <TariffConditionsDropDown
                                className="form-control"
                                value={rule?.conditionCode}
                                onChange={(e) => {
                                    console.log(e)
                                    setRule({
                                        ...rule,
                                        conditionCode: e.target.value,
                                        conditionStr: e.target.label,
                                        inputType: e.target.type,
                                        unitStr: e.target.unitStr
                                    })
                                }}
                            />
                        </div>

                        {rule?.inputType == 1 ?
                            <>
                                <div className="col-2">

                                    <label style={titleStyle}>از {rule.unitStr}</label>
                                    <Input className="form-control"
                                        onKeyDown={handleEnter}
                                        onChange={readChange}
                                        type="number"
                                        name="fromValue"
                                        value={rule?.fromValue} />

                                </div>
                                <div className="col-2">

                                    <label style={titleStyle}>تا {rule.unitStr}</label>
                                    <Input className="form-control"
                                        onKeyDown={handleEnter}
                                        onChange={readChange}
                                        type="number"
                                        name="toValue"
                                        value={rule?.toValue} />

                                </div>
                            </>
                            : rule?.inputType == 2 ?
                                <>
                                    <div className="col-4">

                                        <div className="col-12">
                                            <label style={titleStyle}>از</label>
                                            <div className="d-flex">
                                                <Input className="form-control"
                                                    onKeyDown={handleEnter}
                                                    onChange={readChange}
                                                    type="number"
                                                    name="fromLat"
                                                    placeholder="fromLat"
                                                    value={rule?.fromLat} />
                                                <Input className="form-control"
                                                    onKeyDown={handleEnter}
                                                    onChange={readChange}
                                                    type="number"
                                                    name="fromLng"
                                                    placeholder="fromLng"
                                                    value={rule?.fromLng} />
                                            </div>


                                        </div>
                                        <div className="col-12">

                                            <label style={titleStyle}>تا</label>
                                            <div className="d-flex ">
                                                <Input className="form-control"
                                                    onKeyDown={handleEnter}
                                                    onChange={readChange}
                                                    type="number"
                                                    name="toLat"
                                                    placeholder="toLat"
                                                    value={rule?.toLat} />
                                                <Input className="form-control"
                                                    onKeyDown={handleEnter}
                                                    onChange={readChange}
                                                    type="number"
                                                    name="toLng"
                                                    placeholder="toLng"
                                                    value={rule?.toLng} />
                                            </div>

                                        </div>
                                    </div>

                                </> : <></>

                        }

                        <div className="col-3">


                            <label style={titleStyle}>پارامتر قیمت</label>
                            <TariffParamsDropDown
                                className="form-control"
                                value={rule?.priceType}
                                name="priceType"
                                onChange={(e) => {
                                    setRule({
                                        ...rule,
                                        priceType: e.target.value,
                                        priceTypeStr: e.target.label
                                    })
                                }}
                            />

                        </div>
                        <div className="col-2">

                            <label style={titleStyle}>مبلغ ریال</label>
                            <Input className="form-control"
                                onKeyDown={handleEnter}
                                onChange={readChange}
                                type="number"
                                thousandSeparator={true}
                                placeholder="مبلغ" name="price"
                                value={rule?.price} />

                        </div>
                    </div>




                    {/* </form> */}
                    <div className="px-1 mt-2 d-flex">
                        <button className="btn btn-success  w-100 " onClick={() => {

                            if (rule.condition == 0) {
                                toast.Error("پارامتر شرط انتخاب نشده")
                                return
                            }

                            if (!(rule.fromValue || rule.toValue)) {
                                toast.Error("بازه تعیین نشده")
                                return
                            }

                            // Number.parseInt(rule.fromValue)
                            // console.log(rule.fromValue, rule.toValue)
                            // if ( Number.parseInt(rule.fromValue) >  Number.parseInt(rule.toValue)) {
                            //     console.log(rule.fromValue, rule.toValue)

                            //     toast.Error("بازه تعیین شده اشتباه هست")
                            //     return
                            // }
                            if (rule.priceType == 0) {
                                toast.Error("پارامتر قیمت انتخاب نشده")
                                return
                            }
                            if (!rule.price) {
                                toast.Error("قیمت تعیین نشده")
                                return
                            }

                            console.log(rule)
                            props?.onAcceptPress(rule)
                            setShow(false)
                        }}>تایید</button>
                        <button className="btn btn-danger me-2" title="بستن بدون ذخیره تغییرات" onClick={() => {
                            setShow(false)
                            // props?.onCancel(props.item)
                        }}><IoClose size={25} />

                        </button>
                    </div>

                </div>

            </Modal.Body>


        </Modal >
    </>)
}
