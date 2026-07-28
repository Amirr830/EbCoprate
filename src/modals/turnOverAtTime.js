import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import 'leaflet/dist/leaflet.css';
import _ from 'lodash'
import { AxiosPrivate } from "../app/axiosPrivate";
import endpoints from "../app/endpoints";


export default function TurnOverAtTime(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.params)

    useEffect(() => {
        if (show) {
            setParams({ ...props?.params, tripStatus: -2 })
        }
    }, [show])

    // const handleOnChange = (e) => {
    //     try {
    //         var value = e.target.value
    //         var name = e.target.name

    //         setParams(prevState => ({
    //             ...prevState,
    //             [name]: value
    //         }))

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    // const handleEnter = (event) => {
    //     if (event.key.toLowerCase() === "enter") {
    //         const form = event.target.form;
    //         const index = [...form].indexOf(event.target);
    //         form.elements[index + 1].focus();
    //         event.preventDefault();
    //     }
    // };

    var [isLoading, setLoading] = useState(true)
    var [data, setData] = useState([])
    const handleShow = (e) => {
        setShow(true)
        getTurnOverAtTime()
    };

    var getTurnOverAtTime = () => {
        setLoading(true)

        AxiosPrivate.get(endpoints.retportTurnOverAtTime, {
            params: {
                atTime: props?.atTime,
                stCode: props?.stCode
            }
        }).then(res => {
            setData(res.data)
        }).finally(() => {
            setLoading(false)
        })
    }

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
            size="sm"
            onHide={() => {
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 card p-3 " dir="rtl">
                <div className="row p-2 px-3 g-2">
                    {data?.map((item, index) => {
                        return <div key={index} className="card p-0">
                            <div className="d-flex p-0 m-0 ">
                                <div className="col-3 px-2 bg-primary align-items-center d-flex justify-content-center">
                                    <h3 className="p-0 m-0 iranSansBold text-light  text-center ">{item?.turnOver}</h3>
                                </div>
                                <div className="vr" />
                                <div className="col-6  px-2">
                                    <h2 className="p-0 m-0 iranSansBold">{item?.driverCode}</h2>
                                    <label className="p-0 m-0 opacity-50">{item?.inTime}</label>
                                </div>

                            </div>
                        </div>
                    })}
                </div>

            </Modal.Body>

        </Modal>
    </>)
}
