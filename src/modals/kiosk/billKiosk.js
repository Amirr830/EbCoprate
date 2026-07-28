import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { AxiosPrivate } from "../../app/axiosPrivate";
import endpoints from "../../app/endpoints";
import toast from "../../components/toast";
import loaderModal from "../loaderModal";

export default function BillKisok(props) {


    useEffect(() => {

        setAuthentication(undefined)
    }, [props.show])
    var [authentication, setAuthentication] = useState(undefined);
    var mobileAuthentication = (mobile) => {
        var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.pointIOAuthentication, { params: { phoneNumber: mobile } })
            .then(res => {
                setAuthentication(res.data)
                loaderModal.close(loader)
            })
    }

    var mobileVerify = (mobile, verifyCode) => {
        var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.pointIOMobileVerify, { params: { phoneNumber: mobile, verifyCode: verifyCode } })
            .then(res => {
                if (res.data?.status == 1) {
                    props.onClose(true)
                } else {
                    toast.Error(res?.data?.msg)
                }
                loaderModal.close(loader)
            })
    }



    const [verifyCode, setVerifyCode] = useState('');


    return (<>
        <Modal show={props?.show}
            centered
            // size="lg"
            onHide={() => { props?.onClose(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header p-3 " dir="rtl">
                <div>
                    {!authentication ?
                        <div className="row p-3">
                            <h3 className="text-center  text-success iranSansBold col-12">{props?.tripInfo?.priceStr}</h3>
                            <label className="text-center col-12">{props?.tripInfo?.duration}</label>
                            <label className="text-center col-12">{props?.tripInfo?.distance}</label>


                            <button className="btn btn-primary w-100 mt-5 "
                                onClick={() => {
                                    mobileAuthentication(props?.tripInfo?.phoneNumber)
                                    // props?.onClose(true)
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
                        :
                        <div className="row p-3">
                            <h5 className="text-center  text-success iranSansBold col-12">کد تایید برای شماره {authentication?.phoneNumber} ارسال شد</h5>

                            <input className="form-control shadow mb-2 col-2 text-center iranSansBold"
                                placeholder="کد تایید"
                                type='number'
                                onChange={(e) => {
                                    setVerifyCode(e.target.value)
                                    // setParams(prevState => ({
                                    //     ...prevState, phoneNumber: e.target.value
                                    // }))
                                }}
                            />


                            <button className="btn btn-primary w-100 mt-5 "
                                onClick={() => {
                                    mobileVerify(props?.tripInfo?.phoneNumber, verifyCode)
                                    // props?.onClose(true)
                                }}>
                                ثبت نهایی
                            </button>
                            <button className="btn btn-danger w-100 mt-2"
                                onClick={() => {
                                    props?.onClose(false)
                                }}>
                                انصراف از درخواست
                            </button>
                        </div>
                    }
                </div>
            </Modal.Body>

        </Modal>
    </>)
}

