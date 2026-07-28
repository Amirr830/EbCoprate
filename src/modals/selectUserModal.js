import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";
import endpoints from "../app/endpoints";
import accessList from "../app/accessList.json";
import { CgClose } from 'react-icons/cg'

import { withoutTZ } from "../helper/dateHelper";
import toast from "../components/toast";
import { AxiosPrivate } from "../app/axiosPrivate";
import { hex2Binary } from '../helper/hex2Binary'
import { binary2Hex } from '../helper/binary2Hex'
import answerModal from "./answerModal";
import { useStateManager } from "react-select";
export default function SelectUserModal(props) {

    const handleClose = () => {
        props.onClose();
    }

    useEffect(() => {
        if (props.show)
            getUsers(props)
    }, [props.show])

    var [users, setUsers] = useState([])
    var [isLoading, setLoading] = useState(true)

    var getUsers = () => {
        setLoading(true)
        AxiosPrivate.get(endpoints.users,
            {
                params: {
                    offset: 0,
                    ...params
                }
            }).then((res) => {
                setUsers(res.data.list)
                setLoading(false)
            })
    }




    var [params, setParams] = useState({})
    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name

        setParams({
            ...params,
            [name]: value
        })
    }
    const handleEnter = (event) => {
        if (event.key.toLowerCase() == "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };
    return (<>
        <Modal show={props.show} size="lg" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header" style={{ background: ' rgba(0, 0, 0, 0.05)' }}>

                <div dir="rtl" >

                    <form className='row g-2'>

                        <div className='col-6 '>

                            <input type="text"
                                className="form-control"
                                placeholder="نام"
                                name="firstName"
                                onChange={readChange}
                                onKeyDown={handleEnter}
                            />
                        </div>

                        <div className='col-6 '>

                            <input type="text"
                                className="form-control"
                                placeholder="نام کاربری"
                                name="username"
                                onChange={readChange}
                                onKeyDown={handleEnter}
                            />
                        </div>
                        <div className='col-6  '>
                            <input type="number"
                                className="form-control"
                                placeholder="شماره ملی"
                                name="natCode"

                                onChange={readChange}
                                onKeyDown={handleEnter}


                            />
                        </div>
                        <div className='col-6 '>
                            <input type="number"
                                className=" form-control"
                                placeholder="شماره موبایل"
                                name="mobile"
                                onChange={readChange}
                                onKeyDown={handleEnter}


                            />
                        </div>
                    </form>


                    <label className="px-2 mb-2 mt-5">لیست اعضاء </label>
                    {
                        isLoading
                            ? <div className='justify-content-center d-flex py-5' >
                                <div className="spinner-border" role="status" />
                            </div>
                            : <div className="row g-2">
                                {users?.map((item, index) => {
                                    return <div key={index} className="col-12 aPointer " onClick={() => {
                                        props.onSelect(item)
                                    }}>
                                        <div className="card d-flex py-2 flex-row justify-content-center align-items-center card-hover">
                                            <h4 className="text-center p-0 m-0  w-100">{item.firstName}  {item.lastName}</h4>
                                        </div>
                                    </div>
                                })
                                }
                            </div>

                    }

                    <div className="row g-2 mt-5">
                        <div className="col-8">
                            <button className='btn btn-warning w-100 '
                                onClick={() => {
                                    getUsers(true)
                                }} >جستجو</button>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-danger w-100" onClick={handleClose} >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>

            </Modal.Body>
        </Modal>

    </>)


}

