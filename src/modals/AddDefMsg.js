import React, { useEffect,  useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import 'leaflet/dist/leaflet.css';
import _ from 'lodash'


export default function AddDefMsgModal(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.params)

    useEffect(() => {
        if (show) {
            setParams({ ...props?.params, tripStatus: -2 })
        }
    }, [show])

    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))

        } catch (err) {
            console.log(err)
        }
    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    const handleShow = (e) => {
        setShow(true)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });

    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            onHide={() => {
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 card p-3 " dir="rtl">
                <div className="row p-2 px-3">
                    <div className="p-0 m-0 col-12" >
                        <div className="d-flex flex-row align-items-center">
                            <p className="p-1 m-0 ps-2 iranSansBold  opacity-50" >پیام</p>
                        </div>
                        <input type="text"
                            className="form-control"
                            placeholder="پیام"
                            name="msg"
                            onChange={handleOnChange}
                            onKeyDown={handleEnter}
                            value={params?.msg}
                        />
                        <div className="d-flex flex-row align-items-center mt-2">
                            <p className="p-1 m-0  ps-2 iranSansBold opacity-50" >وضعیت سفر</p>
                        </div>
                        <select
                            className="form-control text-center  px-2"
                            onChange={(e) => {
                                // var item = lineTypes.find(s => s.typeId == e.target.value)
                                console.log(e.target.value)
                                setParams(prevState => ({
                                    ...prevState,
                                    tripStatus: e.target.value
                                }))
                            }}
                            value={params?.tripStatus ? params.tripStatus : null}
                            defaultValue={null}
                            name="tripStatus">
                            <option
                                value={-2}
                                className="text-end">
                                انتخاب نشده
                            </option>
                            <option
                                value={-1}
                                className="text-end">
                                لغو شده
                            </option>
                            <option
                                value={0}
                                className="text-end">
                                در انتظار قبول راننده
                            </option>
                            <option
                                value={2}
                                className="text-end">
                                اتمام یافته
                            </option>
                            <option
                                value={1}
                                className="text-end">
                                راننده در حال حرکت به سمت مسافر
                            </option>
                            <option
                                value={3}
                                className="text-end">
                                در حال سفر به سمت مقصد
                            </option>
                            <option
                                value={4}
                                className="text-end">
                                راننده رسید و منتظر شماست
                            </option>
                            <option
                                value={40}
                                className="text-end">
                                سفر رزرو شده است
                            </option>
                        </select>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={() => {
                        setShow(false)
                        console.log(params?.tripStatus)

                        props?.onClose(params?.msg, params?.tripStatus)
                    }}>
                        افزودن +
                    </button>
                </div>

            </Modal.Body>

        </Modal>
    </>)
}
