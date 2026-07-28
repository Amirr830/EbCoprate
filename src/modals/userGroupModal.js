import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import accessList from "app/accessList.json";

import toast from "components/toast";
import { hex2Binary } from 'helper/hex2Binary'
import { binary2Hex } from 'helper/binary2Hex'
import { CheckAccess } from "app/checkAccess";
import CheckBox from "components/customeTag/checkBox";
import CompanyDropDown from "components/dropdowns/companyDropDown";
export default function UserGroupModal(props) {
    const handleClose = () => {
        props.onClose();
    }
    var [group, setGroup] = useState(undefined)


    useEffect(() => {
        if (props.group)
            setGroup(props.group)
        else
            setGroup(initGroup)

    }, [props?.show])

    var [isLoading, setLoading] = useState(true)

    useEffect(() => {
        console.log('ssssssssssssss')
        setLoading(false)
    }, [group])
    var initGroup = { groupName: '', accessLevel: '000000000000000000000000000000000000000000000000000000000000000000000', companyCode: '' }

    var handleChecked = (e) => {
        var code = parseInt(e.target.value)
        var check = e.target.checked
        // console.log(group?.accessLevel, code, check)

        var binary = hex2Binary(group?.accessLevel)
        binary = replaceCharacter(binary, code, check ? 1 : 0)

        var hex = binary2Hex(binary)
        // console.log(hex,binary, code, check)

        setGroup(prevState => ({ ...prevState, accessLevel: hex }))
    }

    var isChecked = (code) => {
        // console.log(code)
        var binary = hex2Binary(group?.accessLevel)
        // console.log(binary,binary.charAt(code),code,'ssssssssssss')
        // console.log(code,binary)
        return binary.charAt(code) == 1;
    }
    function replaceCharacter(string, index, replacement) {
        return (
            string.slice(0, index) + replacement + string.slice(index + 1, string.length)
        );
    }
    var [tab, setTab] = useState(0)



    var readChange = (e) => {

        var value = e.target.value
        var name = e.target.name
        setGroup(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    return (<>

        <Modal show={props.show} size="lg" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header" style={{ background: ' rgba(0, 0, 0, 0.05)' }}>

                <div dir="rtl" className=" row">
                    <div className="col-9">
                        <label>نام گروه</label>
                        <input type="text"
                            className="form-control mb-3 col-5"
                            placeholder="نام گروه"
                            name="groupName"
                            value={group?.groupName}
                            onChange={readChange}
                        />
                    </div>

                    <div className="col-3">

                        <label>کد شرکت</label>

                        {
                            isLoading ? <></> : < CompanyDropDown
                                value={group?.companyCode}
                                onChange={readChange}
                                name="companyCode"
                            />
                        }
                    </div>

                    <label className="col-12">سطح دسترسی</label>
                    <div className="justify-content-center align-items-center  d-flex flex-column w-100 col-12 card p-2" dir="rtl" >
                        <div className="row align-items-start col-12">
                            <button className={"col btn " + (tab === 0 ? "btn-primary" : "btn-outline-secondary")} onClick={() => { setTab(0) }}>
                                تعاریف</button>
                            <button className={"col btn " + (tab === 1 ? "btn-primary" : "btn-outline-secondary")} onClick={() => { setTab(1) }}>
                                گزارشات</button>
                            <button className={"col btn " + (tab === 2 ? "btn-primary" : "btn-outline-secondary")} onClick={() => { setTab(2) }}>
                                عملیات</button>
                            <button className={"col btn " + (tab === 3 ? "btn-primary" : "btn-outline-secondary")} onClick={() => { setTab(3) }}>
                                تنظیمات</button>
                        </div>

                        {
                            tab == 0 ?
                                <form className="row g-2 col-12 mt-3">
                                    {accessList?.definitions?.map((item, index) => {
                                        return CheckAccess(item.id) ?
                                            <div key={index}> <CheckBox
                                                title={item.name}
                                                value={item.id}
                                                checked={isChecked(item.id)}
                                                onChange={handleChecked}
                                            /> </div>
                                            : <></>
                                    })}
                                </form>
                                : <></>
                        }

                        {
                            tab == 1 ?
                                <form className="row g-2 col-12 mt-3">
                                    {accessList?.reports?.map((item, index) => {
                                        return CheckAccess(item.id) ? <div key={index}>
                                            <CheckBox
                                                title={item.name}
                                                value={item.id}
                                                checked={isChecked(item.id)}
                                                onChange={handleChecked}
                                            />
                                        </div>
                                            : <></>

                                    })}
                                </form>
                                : <></>
                        }

                        {
                            tab == 2 ?
                                <form className="row g-2 col-12 mt-3">
                                    {accessList?.actions?.map((item, index) => {
                                        return CheckAccess(item.id) ? <div key={index}>
                                            <CheckBox
                                                title={item.name}
                                                value={item.id}
                                                checked={isChecked(item.id)}
                                                onChange={handleChecked}
                                            />
                                        </div>
                                            : <></>
                                    })}
                                </form>
                                : <></>
                        }
                        {
                            tab == 3 ?
                                <form className="row g-2 col-12 mt-3">
                                    {accessList?.settings?.map((item, index) => {
                                        return CheckAccess(item.id) ? <div key={index}>
                                            <CheckBox
                                                title={item.name}
                                                value={item.id}
                                                checked={isChecked(item.id)}
                                                onChange={handleChecked}
                                            />
                                        </div>
                                            : <></>
                                    })}
                                </form>
                                : <></>
                        }
                    </div>

                    <div className="row g-2 mt-5 col-12">
                        <div className="col-8">
                            <button className="btn btn-success  col-12"
                                onContextMenu={() => { console.log('sssssssssssss', group) }}
                                onClick={() => {

                                    if (group.groupName == '') {
                                        toast.Error("نام را وارد کنید")

                                        return
                                        
                                    }
                                    if (group.companyCode == '') {
                                        toast.Error("شرکت را انتخاب کنید")
                                        return
                                    }

                                    props.onAccept(group)
                                }}>
                                 تایید
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-danger col-12 " onClick={handleClose} >
                                بستن
                            </button>
                        </div>

                    </div>
                </div>

            </Modal.Body>
        </Modal>


    </>)
}
