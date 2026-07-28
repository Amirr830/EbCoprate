import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "./loaderModal";

import { FcSearch } from "react-icons/fc"
import AddPersonModal from "./addPersonModal";
import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
export default function SearchPersonModal(props) {

    const handleClose = () => {
        props.onClose();
        setShowSearchList(false)
    }
    var [params, setParams] = useState()

    const [persons, setPersons] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showSearchList, setShowSearchList] = useState(false)
    const [showAddPerson, setShowAddPerson] = useState(false)

    var searchAgain = (e) => {
        setParams({})
        setShowSearchList(false)
        setPersons([])
    }


    var searchPerson = () => {


        var loader = loaderModal.load()

        AxiosPrivate.get(endpoints.driver,
            {
                params: {
                    offset: 0,
                    ...params
                }
            }).then((res) => {

                loaderModal.close(loader)
                setPersons(res.data)
                setShowSearchList(true)

            })

    }



    var submit = useRef()

    const handleEnterToSubmit = (event) => {
        if (event.key.toLowerCase() === "enter") {
            submit.current.focus();
        }
    };


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

    var searchTermRef = useRef()

    useEffect(() => {
        if (props.show) {
            setParams({})
            searchTermRef?.current?.focus();

        }
    }, [props.show])

    return (<>
        <Modal show={props.show && !showAddPerson} size="md" onHide={handleClose} centered style={{ background: ' rgba(0, 0, 0, 0.400)' }} >

            <Modal.Body className="card-header">
                <div className="justify-content-center align-items-center  d-flex w-100 col-12 " dir="rtl">
                    <div className="d-flex flex-column w-100">


                        {!showSearchList ?
                            <div>
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >برای انتخاب شخص فرد مورد نظر خود را جستجو نمایید</h5>
                                </div>

                                <form>
                                    <div className=" row g-2" >

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
                                                placeholder="نام خانوادگی"
                                                name="lastName"
                                                onChange={readChange}
                                                onKeyDown={handleEnter}
                                            />
                                        </div>
                                        <div className='col-6 '>
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
                                                placeholder="شماره هوشمند"
                                                name="smartCode"
                                                onChange={readChange}
                                                onKeyDown={handleEnterToSubmit}
                                            />
                                        </div>
                                    </div>

                                </form>

                                <div className=" mt-2">
                                    <button className="btn btn-success w-100" ref={submit} onClick={searchPerson}>جستجو</button>
                                </div>
                            </div>
                            :
                            <div>
                                <h5 className="mb-2" >لیست افراد یافت شده برای انتخاب کلیک کنید</h5>
                                {persons?.length > 0 ?
                                    <div>
                                        {
                                            persons.map((person, index) => {
                                                return <div key={index}>
                                                    <div className='card p-1 my-2 aPointer noSelect card-hover  '
                                                        onClick={(e) => {
                                                            props.onSelect(person)
                                                        }}>

                                                        <div className="row mx-1 " >
                                                            <label className="iranSansBold col-7" >
                                                                {person?.firstName + ' ' + person?.lastName}
                                                            </label>
                                                            <label className="iranSans col-2 " >
                                                                {person?.smartCode}
                                                            </label>
                                                            <label className="iranSans col-3  ">
                                                                {person?.natCode}
                                                            </label>
                                                        </div>

                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    :
                                    <div className="align-items-center d-flex  flex-column justify-content-center"><FcSearch size={60} />
                                        <h2 className="w-100 text-center">موردی یافت نشد</h2>
                                    </div>
                                }
                                <h5 className="mt-5 mb-2" >در لیست فرد مورد نظر خود را پیدا نکردید؟</h5>
                                <div className="d-flex flex-row">

                                    <button className="btn btn-success w-100 ms-2 iranSansBold" onClick={(e) => {
                                        setShowAddPerson(true)
                                    }}>افزودن شخص جدید</button>
                                    <button className="btn btn-danger w-100  iranSansBold" onClick={searchAgain}>جستجوی مجدد</button>

                                </div>
                            </div>

                        }



                    </div>

                </div>

            </Modal.Body>

        </Modal>
        <AddPersonModal
            onClose={(e) => {
                setShowAddPerson(false)
            }}
            onSave={(car) => {
                setShowAddPerson(false)
                searchAgain()
            }}
            show={showAddPerson}
        />
    </>)
}
