import { useEffect, useRef, useState } from "react"
import { TbBuildingBroadcastTower } from "react-icons/tb";
import { FaCircleDot, FaCircle, FaStar, FaRegStar } from "react-icons/fa6";
import gold from '../../../../assets/drawable/gold.png'
import silver from '../../../../assets/drawable/silver.png'
import bronze from '../../../../assets/drawable/bronze.png'
import { setComma } from "../../../../helper/numberHelper";
import TripCancelOptions from "../../../../modals/tripMonit/tripCancelOptions";
import { FiPhoneCall } from "react-icons/fi";
import toast from "../../../../components/toast";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import endpoints from "../../../../app/endpoints";
import TripManageOptions from "../../../../modals/tripMonit/tripManageOptions";
export default function TripCancelReq(props) {

    const [isHovering, setIsHovering] = useState(false);
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    var [currentItem, setCurrentItem] = useState(undefined)
    var [checkDriver, setShowCheckDriver] = useState(undefined)

    var isDriverActive = (stCode) => {
        var find = props?.stationTurns?.find(item => item.stCode == stCode)
        if (!find)
            return true
        else
            return false
    }


    useEffect(() => {
        console.log(props.select)
        if (props?.onKeyDown?.keyCode === 13) {
            if (props?.data?.waitingAccept != 1)
                setShowCheckDriver(props.data)
        } else if (props?.onKeyDown?.keyCode === 32) {
            setCurrentItem(props.data)

        } else {
            // console.log(props?.onKeyDown?.keyCode)
        }
    }, [props.onKeyDown])

    var onCallDirect = (tripCode) => {
        toast.Success("درخواست تماس ارسال شد")
        AxiosPrivate.get(endpoints.directCallTo, { params: { tripCode } })
            .then((res) => {
                toast.Success(res.data.msg)
            })
    }

    return (
        <div className=' m-1 aPointer w-auto ' >
            <div className='row m-0 p-1  card'
                style={{
                    minWidth: '80rem',
                    backgroundColor: props?.data?.waitingAccept == 1 ? (isHovering ? '#81C784' : '#A5D6A7')//در انتظار قبول سفر
                        : props?.data?.cancelType != 0 ? (isHovering ? '#EC407A' : '#F06292')//لغو شده
                            : (isHovering ? '#CFD8DC' : '#ECEFF1'),//معمول
                }}
                onContextMenu={(e) => {
                    setCurrentItem(props.data)
                    e.preventDefault()

                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className='d-flex m-0 p-0 align-items-top '  >
                    <div className="d-flex m-0 p-0" >
                        <div className='col-1 text-end  p-0 m-0 px-2 d-flex row'
                            style={{ width: '3rem' }}>
                            <label className='text-center noSelect iranSansBold col-12  p-0 m-0'
                                style={{ color: isDriverActive(props?.data?.originSt) ? '#000000' : '#C51162' }}>
                                {props?.data?.originSt}
                            </label>

                            <label className=' small text-center col-12 text-secondary p-0 m-0'>
                                {props?.data?.queue}
                            </label>
                        </div>
                        <div className="vr col-1" />
                        <div className='mx-1 col-1' style={{ width: '1.5rem', height: '1.5rem' }} >
                            {
                                props?.data?.passengerStar == 3 ?
                                    <img src={gold} style={{ width: '1.5rem', height: '1.5rem' }} />
                                    : props?.data?.passengerStar == 2 ?
                                        <img src={silver} style={{ width: '1.5rem', height: '1.5rem' }} />
                                        : props?.data?.passengerStar == 1 ?
                                            <img src={bronze} style={{ width: '1.5rem', height: '1.5rem' }} />
                                            : <></>
                            }
                        </div>
                        <div className="vr col-1" />
                        <div className='col-1 text-end px-2 noSelect'
                            style={{ width: '8rem' }}>
                            <p className='text-end noSelect small iranSansBold col-12 text-truncate m-0 p-0 ' title={props?.data?.custTel}>
                                {props?.data?.custName}
                            </p>
                            <label className=' small  text-end  w-100 '

                                onClick={(e) => {
                                    onCallDirect(props?.data?.tripCode)
                                    e.stopPropagation()
                                }
                                } >
                                <FiPhoneCall size={15} className="ms-2" />
                                {props?.data?.custTel}
                            </label>
                        </div>
                        <div className="vr col-1" />
                        <div className='col-1 text-end px-2 noSelect'
                            style={{ width: '18rem' }}>
                            <p className='iranSansBold small col-12 text-truncate p-0 m-0' title={props?.data?.originAddr} >
                                <FaCircleDot size={10} className="text-primary mx-1" />
                                {props?.data?.originAddr}
                            </p>
                            <p className='col-12 text-truncate p-0 m-0' title={props?.data?.dist1St} >
                                <FaCircleDot size={10} className="text-danger mx-1" />
                                {props?.data?.dist1Addr}
                            </p>
                        </div>

                        <div className="vr col-1" />
                        <label className='col-1 text-center noSelect iranSansBold small' style={{ width: '3.5rem' }}>{props?.data?.callTime?.substring(0, 5)}</label>
                        <div className="vr col-1" />

                        <div
                            className="d-flex row col-1 p-0 m-0"
                            style={{ width: '7rem' }}>
                            <label className='text-center noSelect w-100 iranSansBold small'
                                title={props?.data?.opAnswerName}>{props?.data?.tripCode}
                            </label>
                            <label className='noSelect p-0 m-0 small text-center text-truncate px-2 w-100'>
                                {props?.data?.opAnswerName}</label>
                        </div>

                        <div className="vr col-1" />
                        <label className='col-1 text-end px-2 noSelect small iranSansBold d-flex'
                            style={{ width: '20rem' }}>
                            {
                                props?.data?.tripPrice == 0 ? <></> :
                                    <div className='col-1 text-end px-2 noSelect bg-info card ms-2'
                                        style={{ width: '6rem' }}>
                                        <label className='iranSansBold small w-100 text-center'> {setComma(props?.data?.tripPrice)} ریال</label>
                                    </div>
                            }
                            {props?.data?.desc}
                            {props?.data?.staticDesc}
                        </label>

                        {/* <div className="vr col-1" /> */}



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

            {/* <TripCancelOptions
            /> */}


        </div >
    )
}