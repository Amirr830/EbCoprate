import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "../../components/toast";



export default function MoreInfoKiosk(props) {
    var [show, setShow] = useState(false)
    const closer = () => {
        setShow(false)
    }
    const handleShow = (e) => {
        setShow(true)
        setParams(undefined)
        props.onOpen(closer)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });



    var [params, setParams] = useState(undefined)



    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            // size="lg"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 " dir="rtl">
                {
                    params?.classCode ?
                        <div>
                            <div >
                                <input className="form-control shadow mb-2 col-2"
                                    placeholder="نام و نام خانوادگی"
                                    type='text'
                                    onChange={(e) => {
                                        setParams(prevState => ({
                                            ...prevState, custName: e.target.value
                                        }))
                                    }}
                                />
                                <input className="form-control shadow mb-2 col-2"
                                    placeholder="همراه"
                                    type='number'
                                    onChange={(e) => {
                                        setParams(prevState => ({
                                            ...prevState, phoneNumber: e.target.value
                                        }))
                                    }}
                                />
                                <button className="btn btn-primary w-100"
                                    onClick={() => {
                                        if (!params?.phoneNumber) {
                                            toast.Error("شماره همراه به درستی وارد نشده است")
                                            return
                                        }
                                        console.log(params?.phoneNumber.length)
                                        if (params?.phoneNumber.length < 11) {
                                            toast.Error("شماره همراه به درستی وارد نشده است")
                                            return
                                        }
                                        props?.onClose(params)
                                        setShow(false)
                                    }}>
                                    ثبت
                                </button>
                                <button className="btn btn-danger w-100 mt-2"
                                    onClick={() => {
                                        setShow(false)
                                    }}>
                                    لغو
                                </button>
                            </div>
                        </div> :
                        <div className="row g-2 ">
                            {
                                props?.carClass?.map((item, index) => {
                                    return <button key={index} className="btn btn-outline-primary w-100 "
                                        onClick={() => {
                                            setParams(prevState => ({
                                                ...prevState, classCode: item.classCode
                                            }))
                                        }}>
                                        <h3 >
                                            {item?.className}
                                        </h3>
                                    </button>
                                })
                            }
                        </div>
                }

            </Modal.Body>

        </Modal>
    </>)
}

