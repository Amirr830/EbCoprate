import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import { CgClose } from 'react-icons/cg'
import endpoints from "app/endpoints";
import { AxiosPrivate } from "app/axiosPrivate";
import 'leaflet/dist/leaflet.css';
import _ from 'lodash'
import ProgressBar from "components/ProgressBar";


export default function CarLineHistoryModal(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.station)

    useEffect(() => {
        if (show) {
            // if (props?.station?.stCode) {
            // setLockField(true)
            // } else {
            // setLockField(false)
            // stationCheck()
            getCarLineHistory()
            // }
        }
    }, [show])
    const handleShow = (e) => {
        setShow(true)
        console.log(props?.station)
    };
    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });

    var [isLoading, setLoading] = useState(true)
    var [carLineHistory, setCarLineHistory] = useState([])
    const getCarLineHistory = () => {

        setLoading(true)
        AxiosPrivate.get(endpoints.carLineHistory, {
            params: {
                carCode: props?.carCode
            }
        }).then(res => {
            setCarLineHistory(res.data)
        }).finally(() => {
            setLoading(false)
        })
    }


    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            className="modal-lg"
            onHide={() => {
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className=" p-0 card" dir="rtl">
                {

                    isLoading ? <ProgressBar /> :
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                  
                                    <th scope="col">   <CgClose className="text-danger aPointer mx-2" size={25} onClick={() => {
                                        setShow(false)
                                    }} />
                                        کد خودرو</th>
                                    <th scope="col">کد راننده</th>
                                    <th scope="col">نام خط</th>
                                    <th scope="col">تاریخ شروع</th>
                                    <th scope="col">تاریخ خاتم</th>
                                    <th scope="col">شرح</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carLineHistory?.map((item, index) => {
                                    return <tr key={index}>
                                        <td className="text-center">{item?.carCode}</td>
                                        <td>{item?.driverCode}</td>
                                        <td>{item?.lineCode} {item?.lineName}</td>
                                        <td>{item?.fromDateStr}</td>
                                        <td>{item?.toDateStr}</td>
                                        <td>{item?.desc}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                }


            </Modal.Body>

        </Modal>

    </>)
}
