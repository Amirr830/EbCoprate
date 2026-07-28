import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import { useReactToPrint } from "react-to-print";
import StationsDropDown from "components/dropdowns/stationsDropDown";
import LinesDropDown from "components/dropdowns/linesDropDown";
import ProgressBar from "components/ProgressBar";
export default function ExportData(props) {


    var [show, setShow] = useState(false)
    var [params, setParams] = useState({})

    const handleShow = (e) => {
        setShow(true)
        getData()

    };
    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name

        setParams({
            ...params,
            [name]: value
        })
    }


    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });



    var [shiftData, setShiftData] = useState([])
    var [columns, setColumns] = useState([])
    var [loading, setLoading] = useState(true)

    var getData = () => {
        setLoading(true)
        AxiosPrivate.get(endpoints.shiftPreview,{params})
            .then((res) => {
                setShiftData(res?.data)

                setColumns(Object.keys(res?.data[0]));

            })
            .finally(() => {
                setLoading(false)
            })
    }
    var [print, setPrint] = useState({})

    var contentToPrint = useRef()
    const handlePrint = useReactToPrint({
        documentTitle: "Print This Document",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => {
            // setReader(!sreader)
            props?.onAfterPrint()

        },
        removeAfterPrint: true,
    });


    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="xl"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 " dir="rtl">

                <div className="overflow-auto">

                    <div className="d-flex row g-2 py-3">

                        <div className="col-5">
                            <label>شماره خط : </label>

                            <LinesDropDown
                                name="lineCode"
                                className="form-control shadow col-12 text-center iranSansBold"
                                value={params?.lineCode}
                                onChange={readChange}
                            />


                        </div>
                        <div className="col-5">
                            <label>شماره ایستگاه : </label>

                            <StationsDropDown
                                name="stCode"
                                className="form-control shadow col-12 text-center iranSansBold"
                                value={params?.stCode}
                                onChange={readChange}
                            />

                        </div>
                        <div className='col-2  row  align-items-end'>
                            <button className='col-12 btn btn-warning mt-2 '
                                onClick={() => {
                                    getData()
                                }} >جستجو</button>
                        </div>
                    </div>
                    {
                        loading ? <ProgressBar /> :
                            <table className='col-12 table table-striped table-bordered  table-hover ' ref={contentToPrint} style={{ minWidth: "50rem" }}>
                                <thead className="thead-dark position-sticky top-0 table-bordered">
                                    <tr>
                                        {columns?.map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {shiftData?.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {columns.map((col) => (
                                                <td key={col}>{row[col] || "-"}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                    }

                </div>
                <div className="row g-2 col-4">
                    <div className="col">

                        <button className="btn btn-primary col w-100" onClick={() => {
                            handlePrint(null, () =>
                                contentToPrint.current
                            );
                        }}>
                            چاپ
                        </button>
                    </div>

                    <div className="col">

                        <button className="btn btn-danger  w-100" onClick={() => {
                            setShow(false)
                        }}>
                            بستن
                        </button>
                    </div>

                </div>

            </Modal.Body>

        </Modal>
    </>)
}

