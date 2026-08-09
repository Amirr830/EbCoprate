import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";


export default function AddDefMsgModal(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.params)

    useEffect(() => {
        if (show) {
            //بعد از نمایش مودال چه اتفاقی رخ دهد
        }
    }, [show])

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

                aksncakjnklanflkn

            </Modal.Body>

        </Modal>
    </>)
}