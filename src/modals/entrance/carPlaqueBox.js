import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import AddPersonBody from '../../components/addPerson'
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "../loaderModal";
import axios from "axios";
import Storages from "../../app/storages";
import { FcSearch } from "react-icons/fc"
import { CgClose } from 'react-icons/cg'
import endpoints from "../../app/endpoints";
import { AxiosPrivate } from "../../app/axiosPrivate";
import { CheckAccess } from "../../app/checkAccess";
import { GoDash } from "react-icons/go";
import flagPlaque from './../../assets/drawable/flag-plaque.png'
import toast from "../../components/toast";
export default function CarPlaqueBox(props) {

    var [params, setParams] = useState({ pIran: 12 })
    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            if (name == 'p2' && value.length >= 2) {
                p3?.current?.select()
            }
            if (name == 'p3' && value.length >= 3) {
                pIran?.current?.select()
            }

            setParams(prevState => ({
                ...prevState,
                [name]: value,
                pChar: 'ت'
            }))

        } catch (err) {
            console.log(err)
        }
    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    const handleClose = () => {
        setShow(false)
    }

    var [show, setShow] = useState(false)

    const handleShow = (e) => {
        console.log(props?.params)

        setParams(props?.params)
        setShow(true)
    };

    var p2 = useRef()
    var p3 = useRef()
    var pIran = useRef()
    var pChar = useRef()
    useEffect(() => {
        if (show) {
            p2?.current?.focus();
            p2?.current?.select()
        }
    }, [show])

    const newFirstChild = React.cloneElement(
        props.children?.length > 1
            ? props.children[0]
            : props.children,
        { onClick: handleShow });


    return (<>
        {newFirstChild}
        <Modal show={show} onHide={handleClose} size="sm" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header">
                <div className="d-flex  justify-content-end">
                    <CgClose className="text-danger aPointer " size={25} onClick={handleClose} />

                </div>

                <div className="justify-content-center align-items-center  d-flex flex-column w-100 "  >
                    <div className="d-flex flex-column w-100" dir="ltr">


                        <form className="card" >
                            <div className="col-12 g-2 row p-0 m-0  justify-content-center align-items-center ">


                                <img src={flagPlaque} className="m-0 p-0" style={{ width: '2rem' }} />


                                <input type="text"
                                    inputMode="numeric"
                                    className=" iranSansBold col-2 flex-grow-1 h2  text-center"
                                    placeholder="- -"
                                    name="p2"
                                    ref={p2}
                                    style={{ border: 0 }}
                                    maxLength={2}

                                    onChange={handleOnChange}
                                    onKeyDown={(event) => {

                                        if (event.key.toLowerCase() === "enter") {
                                            p3?.current?.select()
                                        }
                                    }}
                                    value={params?.p2 || ''}
                                />
                                <h2 className="iranSansBold col-2 flex-grow-1 h2  text-center">ت</h2>



                                <input type="text"
                                    inputMode="numeric"
                                    className="iranSansBold col-3 flex-grow-1 h2  text-center"
                                    style={{ border: 0 }}
                                    placeholder="- - -"
                                    name="p3"
                                    ref={p3}
                                    maxLength={3}
                                    onChange={handleOnChange}
                                    onKeyDown={(event) => {

                                        if (event.key.toLowerCase() === "enter") {
                                            if (!params?.p2) {
                                                toast.Error("پلاک را وارد نمایید")
                                                p2?.current?.select()
                                                return
                                            }
                                            if (!params?.p3) {
                                                toast.Error("پلاک را وارد نمایید")
                                                p3?.current?.select()
                                                return
                                            }
                                            props.onChange(params)
                                            setShow(false)
                                            // pIran?.current?.select()
                                        }
                                    }}
                                    value={params?.p3 || ''}
                                />
                                <div className="vr p-0 m-0" />

                                <input type="text"
                                    inputMode="numeric"
                                    className="iranSansBold col-2 flex-grow-1 h2  text-center"
                                    style={{ border: 0 }}
                                    placeholder="- -"
                                    name="pIran"
                                    maxLength={2}
                                    ref={pIran}
                                        
                                    onChange={handleOnChange}
                                    onKeyDown={(event) => {
                                        if (event.key.toLowerCase() === "enter") {
                                            props.onChange(params)
                                            setShow(false)
                                        }
                                    }}
                                    value={params?.pIran || ''}
                                />
                            </div>
                        </form>
                        <button className="btn btn-success mt-5 col" onClick={(e) => {

                            if (!params?.p2) {
                                toast.Error("پلاک را وارد نمایید")
                                p2?.current?.select()
                                return
                            }
                            if (!params?.p3) {
                                toast.Error("پلاک را وارد نمایید")
                                p3?.current?.select()
                                return
                            }

                            props.onChange(params)
                            setShow(false)
                        }}>
                            ثبت
                        </button>
                    </div>
                    <hr />
                </div>

            </Modal.Body>


        </Modal>
    </>)
}
