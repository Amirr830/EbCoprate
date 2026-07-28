import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import CheckBox from "components/customeTag/checkBox";
import ShiftDropDown from "components/dropdowns/shiftDropDown";
import ShiftGroupDropDown from "components/dropdowns/shiftGroupDropDown";
import toast from "components/toast";
import { hhmm } from "helper/dateHelper";

export default function AddNewPattern(props) {

    var saveAction = () => {
        if (!params?.dayNumber) {
            toast.Error("روز شیفت انتخاب نشده")
            return
        }
        if (!params?.shiftCode) {
            toast.Error("کد شیفت انتخاب نشده")
            return
        }

        if (!params?.shiftGroupCode) {
            toast.Error("کد گروه انتخاب نشده")
            return
        }

        setShow(false)
        props?.onAccept(params)

    }
    var [show, setShow] = useState(false)


    useEffect(() => {
        if (show) {
            console.log(props?.data)

            setParams(props?.data)
        } 
    }, [show])




    const handleShow = (e) => {
        setShow(true)
        setParams(undefined)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });



    var [params, setParams] = useState(undefined)

    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name
        console.log(value)

        setParams({
            ...params,
            [name]: value
        })
    }

    var handleCheck = (e) => {
        var value = e?.target?.checked ? 1 : 0
        var name = e?.target?.name
        setParams({
            ...params,
            [name]: value
        })

    }

    useEffect(() => {

        console.log("forceAbsence",params?.forceAbsence )

        if (params?.forceAbsence == 1) {
            setParams({
                ...params,
                forcePresence: 0
            })
        }
    }, [params?.forceAbsence])
    useEffect(() => {
        console.log("forcePresence",params?.forcePresence )

        if (params?.forcePresence == 1) {
            setParams({
                ...params,
                forceAbsence: 0
            })
        }
    }, [params?.forcePresence])

    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="md"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 " dir="rtl">


                <div>
                    <div className="row g-2" >

                        <div className="col-6">
                            <label>روز : </label>

                            <input className="form-control shadow col-12 text-center"
                                placeholder="روز"
                                type='number'
                                inputMode="numeric"
                                pattern="\d*"

                                value={params?.dayNumber}
                                name="dayNumber"
                                onChange={readChange}
                            />

                        </div>
                        <div className="col-6">
                            <label>شیفت : </label>

                            <ShiftDropDown
                                value={params?.shiftCode}
                                name="shiftCode"
                                onChange={readChange} />
                        </div>

                        <div className="col-12">
                            <label> گروه : </label>

                            <ShiftGroupDropDown
                                value={params?.shiftGroupCode}
                                name="shiftGroupCode"
                                onChange={readChange} />
                        </div>

                        <CheckBox
                            className="col-12"
                            onChange={handleCheck}
                            name="forcePresence"
                            checked={params?.forcePresence == 1}
                            title="الزام حضور"
                        />

                        <CheckBox
                            className="col-12"
                            onChange={handleCheck}
                            name="forceAbsence"
                            checked={params?.forceAbsence == 1}
                            title="الزام عدم حضور"
                        />

                        <div className="row g-2 p-0 m-0 pt-3 mt-2 ">

                            <div className="col-9">
                                <button className="btn btn-primary w-100"

                                    onClick={() => {
                                        saveAction()
                                    }}>
                                    ثبت
                                </button>
                            </div>

                            <div className="col-3">
                                <button className="btn btn-danger w-100"
                                    onClick={() => {
                                        setShow(false)
                                    }}>
                                    لغو
                                </button>
                            </div>
                        </div>

                    </div>
                </div>



            </Modal.Body>

        </Modal>
    </>)
}

