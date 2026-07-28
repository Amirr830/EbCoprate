import { useContext, useEffect, useState } from "react"
import { TbBuildingBroadcastTower } from "react-icons/tb";
import { FaCircleDot } from "react-icons/fa6";
import gold from '../../../../assets/drawable/gold.png'
import silver from '../../../../assets/drawable/silver.png'
import bronze from '../../../../assets/drawable/bronze.png'
import TripManageOptions from "../../../../modals/tripMonit/tripManageOptions";
import CheckDriverModal from "../../../../modals/tripMonit/CheckDriverModal";
import { setComma } from "../../../../helper/numberHelper";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import endpoints from "../../../../app/endpoints";
import toast from "../../../../components/toast";
import { ToastContainer } from "react-bootstrap";
import TripMonitContext from "../../../../contexts/tripMonitContext";
import { FiPhoneCall } from "react-icons/fi";
import TripEditModal from "../../../../modals/tripMonit/TripEditModal";
import { mmdd, yyyymmdd } from "helper/dateHelper";

export default function TripManage(props) {

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

    var tmContext = useContext(TripMonitContext);

    useEffect(() => {
        // اضافه کردن رویداد گوش دهنده به document
        if (props.select) {
            const handleKeyDown = (e) => {

                // if (e?.keyCode === 13) {
                //     if (props?.data?.waitingAccept != 1)
                //         setShowCheckDriver(props.data)
                // } else if (e?.keyCode === 32) {
                //     setCurrentItem(props.data)
                // }
            };

            document.addEventListener('keydown', handleKeyDown);
            // تابع پاکسازی که هنگام حذف کامپوننت اجرا می‌شود
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [props.select])


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

    var onEditTrip = (params) => {
        setItemSelectEdit(undefined)

        AxiosPrivate.put(endpoints.tripEdit, params).then((res) => {
            toast.Success(res.data.msg)
            props.refreshPage();

        })
    }

    return (
        <div className=' m-1  w-auto ' >
            <div className='row m-0 p-1  card aPointer'
                style={{
                    minWidth: '80rem',
                    // رنگ اصلی پس‌زمینه (بر اساس شرایط)
                    backgroundColor: (isHovering ? props?.data?.rowColor : props?.data?.rowHoverColor), // معمول

                    // لایه شفاف اضافی
                    backgroundImage: (props?.data?.tripType == 2
                        ? 'linear-gradient(to left,rgba(255, 0, 255, 0.3), rgba(0, 0, 0, 0.0))'
                        : 'none')

                        + (props?.data?.tripType == 3
                            ? ',linear-gradient(to left,rgba(25,35, 126, 0.3), rgba(0, 0, 0, 0.0))'
                            : ',none')
                    , // در صورت برقرار بودن شرط لایه آبی شفاف اعمال می‌شود


                    border: props.select ? '3px solid #0091EA' : undefined //انتخاب شده
                }}

                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className='d-flex m-0 p-0 align-items-top aPointer'
                    onContextMenu={(e) => {
                        setCurrentItem(props.data)
                        tmContext?.closeSearch()
                        e.preventDefault()
                    }}
                    onClick={(e) => {
                        // tmContext?.closeSearch()

                        if (props.select) {
                            if (props?.data?.rowType > 1)
                                setShowCheckDriver(props.data)
                        } else {
                            props.onSelect()
                        }
                    }}
                >
                    <div className="d-flex m-0 p-0">
                        <div className='col-1 text-end  p-0 m-0 px-2 d-flex row justify-content-center'
                            style={{ width: '3rem' }}
                            onClick={(e) => {
                                tmContext?.closeSearch()
                                if (props?.data?.rowType > 1)
                                    setShowCheckDriver(props.data)
                                e.stopPropagation()
                            }}>
                            <label className='text-center noSelect iranSansBold  col-12  p-0 m-0 aPointer'
                                style={{ color: isDriverActive(props?.data?.originSt) ? '#000000' : '#C51162' }}
                                onClick={(e) => {
                                    if (props?.data?.rowType != 2)
                                        editTrip(props.data)
                                    e.stopPropagation()
                                }}>
                                {props?.data?.originSt}
                            </label>
                            {
                                props?.data?.passengerStar == 3 ?
                                    <img src={gold} className={"m-0 p-0"}
                                        style={{ height: '1.5rem', width: '1.5rem' }} />
                                    : props?.data?.passengerStar == 2 ?
                                        <img src={silver} className={"m-0 p-0"}
                                            style={{ height: '1.5rem', width: '1.5rem' }} />
                                        : props?.data?.passengerStar == 1 ?
                                            <img src={bronze} className={"m-0 p-0"}
                                                style={{ height: '1.5rem', width: '1.5rem' }} />
                                            : <></>

                            }
                        </div>
                        <div className="vr col-1" />

                        <div className="col-1"
                            onClick={(e) => {
                                tmContext?.closeSearch()

                                if (props?.data?.waitingAccept != 1)
                                    AxiosPrivate.post(endpoints.tripFree, { tripCode: props?.data?.tripCode })
                                        .then((res) => {

                                            toast.Success(res.data.msg)
                                        })
                                e.stopPropagation()
                            }}

                            style={{ width: '2rem' }}>
                            {
                                props?.data?.isFree == 1 ?
                                    <TbBuildingBroadcastTower
                                        size={20}
                                        className='text-primary col-12'
                                    />
                                    : <></>
                            }

                            <label className='small text-center col-12 text-secondary p-0 m-0'>
                                {props?.data?.queue}
                            </label>

                        </div>
                        <div className="vr col-1" />
                        <div className='col-1 text-end px-2 noSelect'
                            style={{ width: '8rem' }}>
                            <p className='text-end noSelect small iranSansBold col-12 text-truncate m-0 p-0 ' title={props?.data?.custTel}>
                                {props?.data?.custName}
                            </p>
                            <label className=' small text-end w-100 text-hover aPointer'
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

                        <div className="col-1 row justify-content-center" >
                            <label className='text-center noSelect iranSansBold small col-12' >{props?.data?.callTime?.substring(0, 5)}</label>
                            {
                                props?.data?.tripCount ?
                                    <label className='text-center noSelect small bg-dark col-12 opacity-75 text-white w-auto card' >{props?.data?.tripCount}</label>
                                    : <></>
                            }
                            {/* <label classNamestyle={{ transform:'rotate(90deg)' }}>
                                {mmdd(props?.data?.callDate)}
                            </label> */}
                        </div>

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
                        <div className='col-1 text-end px-2 noSelect  iranSansBold d-flex flex-column'
                            style={{ width: '40rem' }}>


                            <div className="col-12 d-flex small">
                                <div className='col-1 text-end px-2 noSelect bg-info text-dark card ms-2 w-auto'
                                    style={{ height: '1.5rem' }}><label className='w-100 text-center iranSansBold'> {setComma(props?.data?.tripPrice)} ریال</label>
                                </div>

                                {props?.data?.tags == "" ? <></> : props?.data?.tags.split(',').map((item, index) => {
                                    return <div className='col-1 text-end px-2 noSelect bg-warning text-dark card ms-2 w-auto' key={index}
                                        style={{ height: '1.5rem' }}><label className=' w-100 text-center'> {item}</label>
                                    </div>
                                })}
                            </div>

                            <div className="col-12 d-flex ">
                                {props?.data?.desc}
                                {props?.data?.staticDesc}
                            </div>

                        </div>
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

            <TripEditModal
                refreshPage={() => {
                    props.refreshPage()
                }}
                data={itemSelectEdit}
                onClose={() => {
                    setItemSelectEdit(undefined)
                }}
                onEdit={onEditTrip} />

            <CheckDriverModal
                refreshPage={() => {
                    props.refreshPage()
                }}
                data={checkDriver}
                onClose={() => {
                    setShowCheckDriver(undefined)
                }} />
        </div >
    )
}