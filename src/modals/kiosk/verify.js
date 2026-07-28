import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

export default function BillKisok(props) {
    return (<>
        <Modal show={props?.show}
            centered
            // size="lg"
            onHide={() => { props?.onClose(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header p-3 " dir="rtl">
                <div>
                    <div className="row p-3">
                        <h5 className="text-center  text-success iranSansBold col-12">کد تایید پیامک شده به شماره وارد شده را وارد نمایید</h5>
                        <input className="form-control shadow mb-2 col-2"
                            placeholder="کد  تایید"
                            type='number'
                            onChange={(e) => {
                                setParams(prevState => ({
                                    ...prevState, phoneNumber: e.target.value
                                }))
                            }}
                        />

                        <button className="btn btn-primary w-100 mt-5 "
                            onClick={() => {
                                props?.onClose(true)
                            }}>
                            احراز و ثبت
                        </button>
                        <button className="btn btn-danger w-100 mt-2"
                            onClick={() => {
                                props?.onClose(false)
                            }}>
                            انصراف از درخواست
                        </button>
                    </div>
                </div>
            </Modal.Body>

        </Modal>
    </>)
}

