import { useState } from "react"

import TripManageOptions from "../../../../modals/tripMonit/tripManageOptions";
import gold from '../../../../assets/drawable/gold.png'
import silver from '../../../../assets/drawable/silver.png'
import bronze from '../../../../assets/drawable/bronze.png'
import { FiPhoneCall } from "react-icons/fi";
import TripEditModal from "../../../../modals/tripMonit/TripEditModal";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import endpoints from "../../../../app/endpoints";
import toast from "../../../../components/toast";

export default function TripAssigned(props) {
    var [currentItem, setCurrentItem] = useState(undefined)
    var onCallDirect = (tripCode) => {
        toast.Success("درخواست تماس ارسال شد")

        AxiosPrivate.get(endpoints.directCallTo, { params: { tripCode } })
            .then((res) => {
                toast.Success(res.data.msg)
            })
    }
    var [itemSelectEdit, setItemSelectEdit] = useState(undefined);
    var editTrip = (data) => {
        setItemSelectEdit(data)
    }

    return (
        <div className='w-auto p-1'>
            <div className='w-auto card p-1  noSelect'
                onClick={(e) => {
                    setCurrentItem(props.data)
                }}
                onContextMenu={(e) => {
                    setCurrentItem(props.data)
                    e.preventDefault()

                }}
                style={{
                    backgroundColor: props?.data?.status == 6 ? '#F48FB1' :
                        props?.data?.isHand ? '#BCAAA4' :
                            props?.data?.isPresence ? '#E6EE9C' :

                                props?.data?.isFree ? '#80DEEA' : '#A5D6A7'
                }}>
                <div className='d-flex'>
                    <div className='d-flex flex-column  align-items-center'>
                        <label className='iranSansBold mb-2 aPointer text-hover'
                            style={{ height: '1.3rem' }}
                            onClick={(e) => {
                                editTrip(props.data)
                                e.stopPropagation()
                            }}>{props?.data?.originSt}
                        </label>

                        {
                            props?.data?.passengerStar == 3 ?
                                <img src={gold} style={{ width: '1.4rem', height: '1.4rem' }} />
                                : props?.data?.passengerStar == 2 ?
                                    <img src={silver} style={{ width: '1.4rem', height: '1.4rem' }} />
                                    : props?.data?.passengerStar == 1 ?
                                        <img src={bronze} style={{ width: '1.4rem', height: '1.4rem' }} />
                                        : <></>
                        }
                    </div>
                    <div className="vr col-1 mx-2" />
                    <div className='d-flex flex-column ps-2'
                        title={props?.data?.callTime}>
                        <label className=' iranSansBold small h-auto text-truncate' >
                            {props?.data?.custName}  (<label className='iranSansBold opacity-75 h-auto p-0 m-0 pt-1 aPointer text-hover' style={{ fontSize: 11 }}
                                onClick={(e) => {
                                    onCallDirect(props?.data?.tripCode)
                                    e.stopPropagation()
                                }}>
                                <FiPhoneCall size={15} className="ms-1" />
                                {props?.data?.custTel}
                            </label>)
                        </label>
                        <label className='iranSansBold opacity-50 h-auto p-0 m-0 pt-1 text-truncate' style={{ fontSize: 10, maxWidth: '10rem' }}>
                            {props?.data?.originAddr}.
                        </label>
                        <label className='iranSansBold h-auto p-0 m-0 small text-truncate' >
                            کد {props?.data?.driverCode}
                        </label>
                    </div>
                </div>
            </div>
            <TripManageOptions
                refreshPage={() => {
                    props.refreshPage()
                }}
                data={currentItem}
                onClose={() => {
                    setCurrentItem(undefined)
                }} />


            <TripEditModal
                refreshPage={() => {
                    props.refreshPage()
                }}
                data={itemSelectEdit}
                onClose={() => {
                    setItemSelectEdit(undefined)
                }} />

        </div >
    )
}