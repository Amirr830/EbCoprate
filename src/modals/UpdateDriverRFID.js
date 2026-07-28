import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ProgressBar from "./../components/ProgressBar"
import { LuSmartphoneNfc } from "react-icons/lu";

export default function UpdateRFIDDriver(props) {

    var [show, setShow] = useState(false)

    var close = () => {
        setShow(false)
        props?.onClose()
    }
    useEffect(() => {
        if (props?.show) {
            setShow(true)
        }
    }, [props?.show])


 
    return (<>
        <Modal show={show}
            centered
            onHide={() => {
                close()
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 card p-3 " dir="rtl">

                <div className="row p-2 px-3">
                    <h3 className="text-center mx-3">در انتظار دریافت کارت ...
                    </h3>
                    <LuSmartphoneNfc className="" size={45} />
                </div>

            </Modal.Body>

        </Modal>
    </>)
}
