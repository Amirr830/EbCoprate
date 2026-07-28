import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import ProgressBar from "components/ProgressBar";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

export default function TripPriceDetails(props) {
    var [show, setShow] = useState(false)
    var [isLoading, setLoading] = useState(false)
    var [TPDs, setTPDs] = useState([])

    useEffect(() => {
        if (show) {
            getTripPriceDetails(props?.tripCode)
        }
    }, [show])

    var getTripPriceDetails = (tripCode) => {
        setLoading(true)
        AxiosPrivate.get(endpoints.tripPriceDetails, {
            params: { tripCode: tripCode }
        }).then(res => {
            console.log(res.data)
            setTPDs(res?.data)
        }).finally(() => {
            setLoading(false)
        })
    }


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

    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="lg"
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 " dir="rtl">

                <div className="row p-2 ">
                    <div className="d-flex align-items-start">

                        <IoClose className="text-danger aPointer " size={30}
                            onClick={() => setShow(false)} />
                    </div>
                    {isLoading ?
                        <ProgressBar />
                        :
                        <div className="p-2">
                            <div>جمع مبلغ مسافت : {TPDs?.distancePrice}</div>
                            <div>جمع درصد افزوده شده : {TPDs?.increasePrice}</div>
                            <div>جمع مبلغ زمان حرکت : {TPDs?.movingPrice}</div>
                            <div>جمع مبلغ زمان توقف : {TPDs?.stopTimePrice}</div>
                            <div>جمع مبلغ زمان ترافیک : {TPDs?.trafficPrice}</div>
                            <div>مبلغ حداقل : {TPDs?.minPrice}</div>
                            <table className="table  table-striped ">
                                <thead>
                                    <tr >
                                        <td width="20%">عنوان  </td>
                                        <td width="30%">بازه  </td>

                                        <td width="10%"> مقدار</td>
                                        <td width="20%">مبلغ واحد </td>
                                        <td width="20%">مبلغ کل </td>
                                    </tr>
                                </thead>
                                <tbody>

                                    {

                                        TPDs?.priceDetails?.map((item, index) => {
                                            return <tr >
                                                <td >{item?.title}  </td>
                                                <td >{item?.desc}  </td>
                                                <td > {item?.amount}</td>
                                                <td >{item?.pricePerUnit} </td>
                                                <td >{item?.price} </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                                <thead>
                                    <tr >
                                        <td > جمع کل</td>
                                        <td > </td>
                                        <td > </td>
                                        <td ></td>
                                        <td >{TPDs?.finalPrice}</td>
                                    </tr>

                                </thead>
                            </table>

                        </div>
                    }
                </div>
            </Modal.Body>


        </Modal>
    </>)
}
