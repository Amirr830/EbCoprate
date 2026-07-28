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
import SelectUserModal from "./selectUserModal";
export default function MemberGroupsModal(props) {
    const handleClose = () => {
        props.onClose();
    }

    useEffect(() => {
        if (props.show)
            getMemberGroups(props.groupCode)
    }, [props.show])

    var [members, setMembers] = useState([])
    var [isLoading, setLoading] = useState(true)
    var getMemberGroups = (groupCode) => {
        setLoading(true)
        AxiosPrivate.get(endpoints.groupMember, { params: { groupCode: groupCode } })
            .then((res) => {
                setMembers(res.data)
                setLoading(false)
            })
    }

    var deleteGroup = (userCode, groupCode) => {
        answerModal.show('آیا از حذف این عضو از گروه اطمینان دارید؟', () => {
            var loader = loaderModal.load()
            AxiosPrivate.delete(endpoints.groupMember, { data: { groupCode: groupCode, userCode: userCode } })
                .then((res) => {
                    getMemberGroups(groupCode)
                    loaderModal.close(loader)
                })
        }, () => { })
    }

    var addMember = (userCode, groupCode) => {
        var loader = loaderModal.load()
        AxiosPrivate.post(endpoints.groupMember, { groupCode: groupCode, userCode: userCode })
            .then((res) => {
                getMemberGroups(groupCode)
                loaderModal.close(loader)
            })
    }


    var [showSelectUser, setShowSelectUser] = useState(false)
    return (<>
        <Modal show={(props.show && !showSelectUser)} size="lg" centered style={{ background: ' rgba(0, 0, 0, 0.400)' }}>
            <Modal.Body className="card-header" style={{ background: ' rgba(0, 0, 0, 0.05)' }}>

                <div dir="rtl" >
                    <label className="px-2 mb-2">لیست اعضاء </label>
                    {
                        isLoading
                            ? <div className='justify-content-center d-flex py-5' >
                                <div className="spinner-border" role="status" />
                            </div>
                            : <div className="row g-2">
                                {members?.map((item, index) => {
                                    return <div key={index} >
                                        <div className="card d-flex py-2 flex-row justify-content-center align-items-center">
                                            <h4 className="text-center p-0 m-0  w-100">{item.firstName}  {item.lastName}</h4>
                                            <CgClose className="text-danger aPointer mx-2" size={25} onClick={() => {
                                                deleteGroup(item.userCode, item.groupCode)
                                            }} />
                                        </div>
                                    </div>
                                })
                                }</div>
                    }

                    <div className="row g-2 mt-5">
                        <div className="col-8">
                            <button className="btn btn-primary  col-12"
                                onClick={() => {
                                    setShowSelectUser(true)
                                }}>
                                افزودن عضو
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


        <SelectUserModal
            show={showSelectUser}
            onSelect={(user) => {
                addMember(user.uid, props.groupCode)
                setShowSelectUser(false)
            }}
            onClose={() => {
                setShowSelectUser(false)
            }} />
    </>)


}

