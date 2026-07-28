import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "components/toast";
import { hhmm } from "helper/dateHelper";

export default function ShiftGroupModal(props) {

    var saveAction = () => {

        if (!params?.shiftGroupName) {
            toast.Error("نام گروه به درستی وارد نشده است")
            return
        }

        setShow(false)
        props?.onAccept(params)

    }
    var [show, setShow] = useState(false)


    useEffect(() => {
        if (show) {
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
                                placeholder="نام گروه"
                                type='text'
                                value={params?.shiftGroupName}
                                name="shiftGroupName"
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

