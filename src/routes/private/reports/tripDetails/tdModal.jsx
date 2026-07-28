import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "../../../../components/toast";
import { hhmm } from "../../../../helper/dateHelper";
import TripDetailsModule from "./tdBody";
import { useSearchParams } from "react-router-dom";
import { CgClose, CgCPlusPlus } from "react-icons/cg";

export default function TdModal(props) {
    var [show, setShow] = useState(false)

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
    var tripCode = props?.tripCode;


    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            fullscreen={true}

            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3  bg-white" dir="rtl">
                <div className="">
                    <TripDetailsModule tripCode={tripCode}
                        onClose={() => {
                            setShow(false)
                        }} />
                </div>
            </Modal.Body>

        </Modal>
    </>)

}

