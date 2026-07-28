import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import 'leaflet/dist/leaflet.css';
import _, { find } from 'lodash'
import { AxiosPrivate } from "../app/axiosPrivate";
import endpoints from "../app/endpoints";
import { hhmmss } from "../helper/dateHelper";


export default function StationTurns(props) {

    var [show, setShow] = useState(false)
    var [activeClass, setActiveClass] = useState(0)
    var [turns, setTurns] = useState([])
    var [classList, setClassList] = useState([])

    useEffect(() => {
        if (show) {
            getClass()
        }
    }, [show])

    const getTurn = (classCode) => {
        AxiosPrivate.get(endpoints.pointIOTurn, {
            params: {
                classCode: classCode,
                stCode: props?.stCode
            },
        }).then((res) => {
            setTurns(res.data)
        })
    };
    const getClass = () => {
        AxiosPrivate.get(endpoints.carClass, {

        }).then((res) => {


            var classCode = res.data?.find(item => item.isActive == 1)?.classId
            setActiveClass(classCode)
            setClassList(res?.data)
            getTurn(classCode)

        })
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
                            <p className="p-1 m-0 ps-2 iranSansBold  opacity-50 text-center w-100" >لیست ثبت ایستگاه های {props?.stCode}</p>
                        </div>

                        <div className="d-flex">

                            {classList?.map((item, index) => {
                                if (item?.isActive == 1)
                                    return <button className={item?.classId == activeClass ? "btn btn-primary col" : " btn btn-outline-primary col"}
                                        onClick={() => {
                                            setActiveClass(item?.classId)
                                            getTurn(item?.classId)
                                        }}>{item?.className}</button>
                            })}
                        </div>

                        <TableView data={turns} />
                    </div>
                </div>
            </Modal.Body>

        </Modal>
    </>)
}

function TableView({ data }) {
    return <table className='col-12 table table-striped table-bordered table-hover' >
        <thead className='thead-dark position-sticky top-0'>
            <tr>
                <th width="5%">
                    نوبت
                </th>
                <th width="20%">
                    کد
                </th>
                <th width="20%">
                    نوع خودرو
                </th>
                <th width="20%">
                    پلاک
                </th>
                <th width="20%">
                    نوع
                </th>
                <th width="20%">
                    ورود
                </th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => {
                return <tr >
                    <td>
                        {item?.turn}
                    </td>
                    <td>
                        {item?.driverCode}
                    </td>
                    <td>
                        {item?.carType}
                    </td>
                    <td>
                        {item?.plaque}
                    </td>
                    <td>
                        {item?.driverType}
                    </td>
                    <td>
                        {hhmmss(item?.registerTime)}
                    </td>
                </tr>

            })}
        </tbody>
    </table >
}
