import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "components/toast";
import { hhmm } from "helper/dateHelper";
import LinesDropDown from "components/dropdowns/linesDropDown";
import StationsDropDown from "components/dropdowns/stationsDropDown";

export default function ShiftModal(props) {

    var saveAction = () => {

        if (!params?.shiftName) {
            toast.Error("نام شیفت به درستی وارد نشده است")
            return
        }

        if (!params?.startTime) {
            toast.Error("شروع شیفت وارد نشده است")
            return
        }

        if (!params?.endTime) {
            toast.Error("پایان شیفت وارد نشده است")
            return
        }

        if (!params?.stCode && !params?.lineCode) {
            toast.Error("شماره خط یا شماره ایستگاه باید وارد شود")
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

        setParams({
            ...params,
            [name]: value
        })
    }

    function readChangeTime(e) {
        var name = e.target.name

        let val = e.target.value;
        if (val) {
            const [h, m] = val.split(":").map(Number);
            // اطمینان از اینکه همیشه فرمت 24 ساعت است
            val = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
        }
        setParams({
            ...params,
            [name]: val
        })
    }

    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="xlg"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 " dir="rtl">


                <div>
                    <div className="row g-2" >


                        <div className="col-12">
                            <label>نام گروه : </label>

                            <input className="form-control shadow col-12 text-center iranSansBold"
                                placeholder="نام شیفت"
                                type='text'
                                value={params?.shiftName}
                                name="shiftName"
                                onChange={readChange}
                            />

                        </div>
                        <div className="col-6">
                            <label>شماره خط : </label>

                            <LinesDropDown
                                name="lineCode"
                                className="form-control shadow col-12 text-center iranSansBold"
                                value={params?.lineCode}
                                onChange={readChange}
                            />


                        </div>
                        <div className="col-6">
                            <label>شماره ایستگاه : </label>

                            <StationsDropDown
                                name="stCode"
                                className="form-control shadow col-12 text-center iranSansBold"
                                value={params?.stCode}
                                onChange={readChange}
                            />

                        </div>
                        <div className="col-6">
                            <label>شروع از : </label>

                            <input
                                type="time"
                                onChange={readChangeTime}
                                name="startTime"
                                value={hhmm(params?.startTime) || ""}
                                className="form-control shadow col-12 text-center iranSansBold"
                                style={{ display: "block", marginTop: 6, padding: 6, borderRadius: 6 }}
                            />
                        </div>

                        <div className="col-6">
                            <label>پایان تا : </label>
                            <input
                                type="time"
                                onChange={readChangeTime}
                                name="endTime"
                                value={hhmm(params?.endTime) || ""}

                                className="form-control shadow col-10 text-center iranSansBold"
                                style={{ display: "block", marginTop: 6, padding: 6, borderRadius: 6 }}
                            />
                        </div>


                        <div className="col-12 d-none">
                            <label>توضیحات : </label>

                            <input className="form-control shadow col-12 text-center iranSansBold"
                                placeholder="توضیحات"
                                type='text'
                                value={params?.desc}
                                name="desc"
                                onChange={readChange}
                            />
                        </div>

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

