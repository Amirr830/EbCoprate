import React, { useState } from "react";

function Menu(props) {
    return (
        <>
            <div className="position-fixed p-0 m-0 d-flex justify-content-center align-items-center"
                onClick={(e) => {
                    props.onClose()
                }}
                style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    bottom: 0,
                    top: 0,
                    right: 0,
                    left: 0,
                    zIndex: 1000
                }} dir="rtl">
                    
                {props?.children}
            </div>
        </>
    );
}

export default function Options(props) {
    var [show, setShow] = useState(false)
    return <div onClick={() => {
        if (!show)
            setShow(true)
    }}>
        {props.children}
        {show ?
            <Menu
                onClose={() => {
                    setShow(false)
                }}>
                {props.options}
            </Menu>
            : <></>
        }
    </div>
}

