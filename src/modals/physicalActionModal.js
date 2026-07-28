import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "components/toast";
import StationsDropDown from "components/dropdowns/stationsDropDown";
import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";



export default function PhysicalActionModal(props) {

    var saveAction = () => {
        if (!params?.title) {
            toast.Error("نام عملیات فیزیکی به درستی وارد نشده است")
            return
        }
        
        if (!params?.actionUrl) {
            toast.Error("آدرس راهبند درستی وارد نشده است")
            return
        }

        AxiosPrivate.post(endpoints.physicalAction, params)
            .then(res => {
                toast.Success("با موفقیت افزوده شد")
                setShow(false)
                props?.onClose()
            })
        
    }




    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        setShow(true)
        setParams(undefined)
        props.onOpen()
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
            size="md"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 " dir="rtl">


                <div>
                    <div className="row g-2" >

                        <div className="col-6">
                            <label>ایستگاه : </label>
                            <StationsDropDown
                                name="stCode"
                                value={params?.stCode}
                                onChange={readChange}
                            />
                        </div>
                        <div className="col-6">
                            <label>نام عملیات : </label>

                            <input className="form-control shadow col-2 text-center iranSansBold"
                                placeholder="نام عملیات"
                                type='text'
                                name="title"
                                disabled={!params?.stCode}

                                onChange={readChange}
                            />
                        </div>

                        <input className="form-control shadow col-2 fredoka text-start"
                            placeholder="Url Address"
                            dir="ltr"
                            disabled={!params?.stCode}
                            type='text'
                            name="actionUrl"
                            onChange={readChange}
                        />
                        <div className="row g-2 p-0 m-0 pt-3 mt-2 ">

                            <div className="col-6">

                                <button className="btn btn-primary w-100"
                                    disabled={!params?.stCode}

                                    onClick={() => {
                                        saveAction()
                                    }}>
                                    ثبت
                                </button>
                            </div>
                            <div className="col-6">
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

