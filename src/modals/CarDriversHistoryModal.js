import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'

import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
import 'leaflet/dist/leaflet.css';
import _ from 'lodash'

import ProgressBar from "../components/ProgressBar";


export default function CarDriversHistoryModal(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.station)

    useEffect(() => {
        if (show) {
            // if (props?.station?.stCode) {
            // setLockField(true)
            // } else {
            // setLockField(false)
            // stationCheck()
            getCarDriversHistory()
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
    var [carDriversHistory, setCarDriversHistory] = useState([])
    const getCarDriversHistory = () => {

        setLoading(true)
        AxiosPrivate.get(endpoints.carDriversHistory, {
            params: {
                carCode: props?.carCode
            }
        }).then(res => {
            setCarDriversHistory(res.data)
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
                                    <th scope="col">کد خودرو</th>
                                    <th scope="col">کد هوشمند</th>
                                    <th scope="col">نام راننده</th>
                                    <th scope="col">همراه</th>
                                    <th scope="col">کد ملی</th>
                                    <th scope="col">نوع رابط</th>
                                    <th scope="col">تاریخ شروع</th>
                                    <th scope="col">تاریخ خاتم</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carDriversHistory?.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{item?.carCode}</td>
                                        <td>{item?.smartCode}</td>
                                        <td>{item?.firstName} {item?.lastName}</td>
                                        <td>{item?.mobile}</td>
                                        <td>{item?.natCode}</td>
                                        <td>{item?.type}</td>
                                        <td>{item?.fromDateStr}</td>
                                        <td>{item?.toDateStr}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                }

            </Modal.Body>

        </Modal>
    </>)
}
