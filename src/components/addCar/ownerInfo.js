import React, { useContext, useState, useEffect, useRef } from 'react'
import acContext from './addCarContext'

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

import SearchPersonModal from '../../modals/searchPersonModal'
import AddOwner from './addOwnerModal'

import { FaUndoAlt } from 'react-icons/fa'
import { BiSolidArchiveIn } from 'react-icons/bi'

import { yyyymmdd } from '../../helper/dateHelper'
import OwnerHistoryModal from '../../modals/ownerHistoryModal'
import { FaUserEdit } from "react-icons/fa";
import AddPersonModal from '../../modals/addPersonModal'
import { IoMdOptions } from "react-icons/io";
import OwnerAccessibility from '../../modals/ownerAccessibilty'

export default function OwnerInfo() {
    var context = useContext(acContext)

    var [showAddOwner, setShowAddOwner] = useState(false)
    var [showEditPerson, setShowEditPerson] = useState(false)
    var [showAccessibility, setShowAccessibility] = useState(false)
    var [currentPerson, setCurrentPerson] = useState(undefined)
    var [showHistory, setShowHistory] = useState(false)


    return (
        <>
            <div className='flex'>
                <div className='row g-2  mb-3 px-2'>
                    {context?.acState?.owners?.map((owner, index) => {
                        return <div className='  card px-3 ' style={{ background: owner?.toDate ? '#F8BBD0' : '' }} key={index}>

                            <div className='row card-header w-auto '>

                                <h5 className=" text-end col-9 text-truncate iranSansBold"  >
                                    {owner?.firstName} {owner?.lastName}
                                </h5>

                                <h5 className=" text-center  col-3  "  >
                                    {owner?.type == 1 ? 'مالک' : ''}
                                    {owner?.type == 3 ? 'کمکی' : ''}
                                    {owner?.type == 2 ? 'بهره بردار' : ''}
                                </h5>

                            </div>

                            <div className='row '>
                                <div className=' col-8 p-0 m-0 d-flex flex-column'>
                                    <label className="px-2  text-end "  >
                                        کد راننده : {owner?.smartCode}
                                    </label>
                                    <label className="px-2  text-end"  >
                                        کد ملی : {owner?.natCode}
                                    </label>
                                    <label className="px-2  text-end"  >
                                        همراه : {owner?.mobile}
                                    </label>
                                    <label className="px-2  text-end"  >
                                        از تاریخ : {
                                            yyyymmdd(owner?.fromDate)
                                        }
                                    </label>

                                </div>
                                <div className='col-4 d-flex flex-column justify-content-center align-items-end p-0 m-0 py-2 ps-1'>
                                    {owner?.toDate ?

                                        <button className='btn-danger btn m-0 p-0 p-1 px-2 '
                                            style={{ width: '6rem' }}

                                            onClick={(e) => {
                                                e.preventDefault();
                                                var newEdited = { ...owner, toDate: undefined }
                                                var index = context?.acState?.owners.findIndex(_owner => _owner == owner)
                                                var owners = context?.acState?.owners
                                                owners[index] = newEdited
                                                context?.acDispatch({ ...context?.acState, owners: owners })

                                            }}>
                                            لغو بایگانی
                                        </button>
                                        :
                                        <DatePicker
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={new Date()}
                                            onChange={(date) => {
                                                var newEdited = { ...owner, toDate: new Date(date.unix * 1000) }
                                                var index = context?.acState?.owners.findIndex(_owner => _owner == owner)
                                                var owners = context?.acState?.owners
                                                owners[index] = newEdited
                                                context?.acDispatch({ ...context?.acState, owners: owners })

                                            }}
                                            render={(value, openCalendar) => {
                                                return (
                                                    <button className='btn-warning btn m-0 p-0 p-1 px-2'
                                                        style={{ width: '6rem' }}
                                                        title='بایگانی'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (owner.drvCarCode) {
                                                                openCalendar()
                                                            }
                                                            else {
                                                                var other = context?.acState?.owners.filter(_owner => _owner != owner)
                                                                context?.acDispatch({ ...context?.acState, owners: other })
                                                            }
                                                        }}>

                                                        بایگانی
                                                    </button>
                                                )
                                            }}>

                                        </DatePicker>
                                    }

                                    <button className='btn-success btn m-0 p-0 p-1  px-2  mt-1'
                                        style={{ width: '6rem' }}

                                        onClick={(e) => {
                                            setCurrentPerson(owner)
                                            setShowEditPerson(true)

                                        }}>
                                        ویرایش راننده

                                    </button>

                                    <button className='btn-primary btn m-0 p-0 p-1 px-2 mt-1 text-center'
                                        style={{ width: '6rem' }}
                                        onClick={(e) => {
                                            setCurrentPerson(owner)
                                            setShowAccessibility(true)

                                        }}>
                                        ویژگی ها راننده
                                    </button>
                                </div>

                            </div>

                        </div>
                    })}

                </div>
                <div className='flex '>
                    <button
                        className='btn btn-primary m-1'
                        onClick={() => {
                            context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep + 1 })

                        }}>
                        مرحله بعد
                    </button>
                    <button
                        className='btn btn-warning m-1'
                        onClick={() => {

                            context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep - 1 })

                        }}>
                        مرحله قبلی
                    </button>
                    <button
                        className='btn btn-danger m-1'
                        onClick={() => {
                            setShowHistory(true)

                        }}>
                        تاریخچه
                    </button>
                    <button
                        className='btn btn-success m-1'
                        onClick={() => {
                            setShowAddOwner(true)
                        }}>
                        افزودن
                    </button>

                </div>

            </div>
            <AddOwner
                onAdd={(owner) => {
                    console.log(owner)

                    if (!context?.acState?.owners) {
                        context?.acDispatch({ ...context?.acState, owners: [owner] })

                    } else {
                        context?.acDispatch({ ...context?.acState, owners: [...context?.acState?.owners, owner] })

                    }
                    setShowAddOwner(false)

                }}
                show={showAddOwner}
                onClose={() => {
                    setShowAddOwner(false)
                }} />

            <OwnerHistoryModal
                carCode={context?.acState?.carCode}
                show={showHistory}
                onClose={() => {
                    setShowHistory(false)
                }} />
  
            <AddPersonModal
                show={showEditPerson}
                person={currentPerson}
                onClose={(e) => {
                    setShowEditPerson(false)
                }}
                onSave={(owner) => {
                    setShowEditPerson(false)
                }}
            />
            <OwnerAccessibility
                show={showAccessibility}
                ownerCode={currentPerson?.drvCarCode}
                onClose={(e) => {
                    setShowAccessibility(false)
                }}
            />

        </>
    )
}














