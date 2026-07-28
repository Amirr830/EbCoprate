import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import 'leaflet/dist/leaflet.css';
import _ from 'lodash'


export default function AddSurveyOption(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.params)

    useEffect(() => {
        if (show) {
            setParams(props?.params)
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
                            <h4 className="ps-2" >عنوان</h4>
                        </div>
                        <input type="text"
                            className="form-control"
                            placeholder="عنوان"
                            name="name"
                            onChange={handleOnChange}
                            onKeyDown={handleEnter}
                            value={params?.name}
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={() => {
                        setShow(false)
                        props?.onClose(params?.name)
                    }}>
                        افزودن +
                    </button>
                </div>

            </Modal.Body>

        </Modal>
    </>)
}
