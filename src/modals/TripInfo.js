import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import { CgClose } from 'react-icons/cg'
import endpoints from "../app/endpoints";
import { AxiosPrivate } from "../app/axiosPrivate";
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import _ from 'lodash'
import DivBlock from "../components/customeTag/divBlock";
import ProgressBar from "components/ProgressBar";

import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { dateTimeStr, hhmm, hhmmss, withoutTZ, yyyymmdd, yyyymmddhhmm } from 'helper/dateHelper';
import { FaCircle, FaInfoCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { MapSettingsContext } from "contexts/initialMapSettings";

import gold from 'assets/drawable/gold.png'
import silver from 'assets/drawable/silver.png'
import bronze from 'assets/drawable/bronze.png'
export default function TripInfo(props) {
    var [show, setShow] = useState(false)
    var position = [36.31935058, 59.554662]
    var [trip, setTrip] = useState({})
    var [isLoading, setLoading] = useState(false)

    var getTripDetails = (tripCode) => {
        setLoading(true)
        AxiosPrivate.get(endpoints.tripDetails, {
            params: { tripCode: tripCode }
        }).then(res => {
            setTrip(res?.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if (show) {
            getTripDetails(props?.tripCode)
        }
    }, [show])

    const handleShow = (e) => {
        setShow(true)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });
    const { mapSettings } = useContext(MapSettingsContext);

    return (<>
        {newFirstChild}

        <Modal show={show}
            fullscreen={true}
            centered
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-0 " dir="rtl">
                {
                    isLoading ?
                        <>
                            <div className="w-100 d-flex justify-content-end">

                                <button className="btn btn-light m-2 shadow p-0 "
                                    onClick={() => {
                                        setShow(false)
                                    }} >
                                    <CgClose className=" text-hover aPointer  p-2" size={40} />
                                </button>
                            </div>

                            <div className=" d-flex justify-content-center align-items-center h-75">

                                <ProgressBar />
                                <h2 className="mx-2">
                                    در حال دریافت اطلاعات ...
                                </h2>
                            </div>
                        </> :
                        <div className="d-flex ">
                            <div className="d-flex flex-column p-3  col-12 col-lg-5 col-md-6 overflow-auto vh-100 aScroll p-3" >
                                <h5 className={trip?.status == 6 ? 'text-danger iranSansBold'
                                    : trip?.status == 1 ? 'text-success iranSansBold'
                                        : 'text-warning iranSansBold'}>{trip?.statusStr}
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
                                </h5>
                                <label className='text-dark small'>{trip?.tripCode} - {trip?.opTel}</label>

                                <label className='text-dark iranSansBold'><IoIosCall className='text-danger' style={{ width: '1.5rem' }} />تماس در  {dateTimeStr(trip?.callDate)}</label>
                                <div className="d-flex">
                                    <label className='text-primary  ' style={{ paddingRight: '1.5rem' }}>{trip?.custName}

                                    </label>
                                    <div className="d-flex me-auto flex-column">
                                        <div className='bg-success rounded p-1 shadow justify-content-center d-flex' style={{ width: '7rem' }}>
                                            <label className='text-white '>{trip?.custMobile}</label>
                                            <IoIosCall className='text-white ' size={20} />
                                        </div>
                                        {trip?.custTel != trip?.custMobile ?
                                            <div className='bg-info rounded p-1 shadow justify-content-center d-flex my-2' style={{ width: '7rem' }}>
                                                <label className='text-white '>{trip?.custTel}</label>
                                                <IoIosCall className='text-white ' size={20} />
                                            </div> : <></>
                                        }
                                    </div>

                                </div>

                                {
                                    trip?.drvCode == 0 ? <></> :
                                        <>
                                            <hr className='p-0 m-0 py-1 my-1' />
                                            <label className='text-dark iranSansBold'><FaCar className='text-danger' style={{ width: '1.5rem' }} /> اعزام در {dateTimeStr(trip?.sendDate)}</label>
                                            <div className='d-flex'>
                                                <div className='d-flex flex-column' style={{ paddingRight: '1.5rem' }}>
                                                    <label className='text-primary  '>کد {trip?.driverCode} - {trip?.drvName} {trip?.drvFamily}</label>
                                                    <label className='text-primary  ' >{trip?.carType} {trip?.carColor}</label>

                                                </div>
                                                <div className="me-auto">

                                                    <div className='me-auto bg-primary rounded p-1 shadow justify-content-center d-flex' style={{ width: '7rem' }}>
                                                        <label className='text-white '>{trip?.drvMobile}</label>
                                                        <IoIosCall className='text-white ' size={20} />
                                                    </div>
                                                    <div className='me-auto bg-warning rounded p-1 shadow justify-content-center d-flex my-2' style={{ width: '7rem' }}>
                                                        <label className='text-dark iranSansBold'>{trip?.plaque}</label>
                                                    </div>


                                                </div>
                                            </div>

                                        </>
                                }

                                <hr className='p-0 m-0 py-1' />
                                <label className='text-dark' ><MdOutlineTripOrigin className='text-primary' style={{ width: '1.5rem' }} />{trip?.originAddr} [{trip?.originSt}]</label>
                                <label className='text-dark' ><FaCircle className='text-danger' style={{ width: '1.5rem' }} /> {trip?.d1Address}  [{trip?.d1StCode}]</label>
                                {trip?.d2Address == '' ?
                                    <></> :
                                    <label className='text-dark' ><FaCircle className='text-danger' style={{ width: '1.5rem' }} /> {trip?.d2Address}  [{trip?.d2StCode}]</label>
                                }
                                <hr className='p-0 m-0 py-2 ' />

                                {
                                    (trip?.defDesc + trip?.sysDesc + trip?.tripDesc?.trim() != '') ?
                                        <>
                                            <label className='text-danger' ><PiChatTeardropTextBold className='text-danger' style={{ width: '1.5rem' }} /> {trip?.defDesc}  {trip?.sysDesc} {trip?.tripDesc} </label>
                                            <hr className='p-0 m-0 py-1' />

                                        </>
                                        : <></>
                                }

                                <table className="table  table-striped">
                                    <tbody>
                                        <tr>
                                            <td width="50%">زمان رسیدن به مسافر :</td>
                                            <td width="50%">{hhmmss(trip?.arrivedTime)} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%">زمان سوار شدن مسافر :</td>
                                            <td width="50%">{trip?.pugTime} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%"> اتمام سفر : </td>
                                            <td width="50%">{trip?.endTime} </td>
                                        </tr>
                                        <tr>
                                            <td width="50%"> میزان توقف : </td>
                                            <td width="50%">{trip?.stopTime} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%"> تعداد سفر های مشترک : </td>
                                            <td width="50%">{trip?.tripCount} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">مبلغ سفر محاسبه شده : </td>
                                            <td width="50%">{trip?.tripPriceStr} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">مبلغ دریافتی راانده از مسافر : </td>
                                            <td width="50%">{trip?.finalPriceStr} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">مبلغ دریافتی راانده از مسافر : </td>
                                            <td width="50%">{trip?.finalPriceStr} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">کد سفر : </td>
                                            <td width="50%">{trip?.tripCode} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">مسافت : </td>
                                            <td width="50%">{trip?.tripDistance} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">مسیر : </td>
                                            <td width="50%">{trip?.routePathStr} </td>
                                        </tr>
                                        <tr >
                                            <td width="50%">ترافیک : </td>
                                            <td width="50%">{trip?.traffic} دقیقه</td>
                                        </tr>

                                        <tr >
                                            <td width="50%">ترافیک : </td>
                                            <td width="50%">{trip?.traffic} دقیقه</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                            <div className="col-12 col-lg-7 d-none d-lg-block bg-danger vh-100">
                                <MapContainer
                                    className="w-100 h-100"
                                    zoom={12}
                                    center={position}
                                    key={mapSettings.url}

                                    zoomControl={false}
                                    attributionControl={false}
                                    crs={mapSettings?.crs}
                                    tileSize={mapSettings?.tileSize}
                                    scrollWheelZoom={true}>
                                    <TileLayer
                                        url={mapSettings?.url}
                                        tms={mapSettings?.tms}
                                    />
                                    <MapController
                                        onClose={() => { setShow(false) }}
                                        // centerStation={{ lat: params?.lat, lng: params?.lng }}
                                        // polygonStation={params?.stPolygon}
                                        onLocationStation={(locationStation) => {
                                            // setParams(prevState => ({ ...prevState, lat: locationStation?.lat, lng: locationStation?.lng }))
                                        }}
                                        onPolygonStation={(polygonStation) => {
                                            // setParams(prevState => ({ ...prevState, polygonStation: polygonStation }))
                                        }}


                                    />



                                </MapContainer>
                            </div>
                        </div>


                }

            </Modal.Body>


        </Modal>
    </>)
}




function MapController(props) {
    const map = useMap()
    var [Poll, setPoll] = useState(false)
    const [allowCreatePolygon, setAllowCreatePolygon] = useState(false)
    const [polygon, setPolygon] = useState([])
    var [stationLocation, setStationLocation] = useState(undefined)

    const blueOptions = { color: 'blue' }

    var originIcon = new L.Icon({
        iconUrl: require('../assets/drawable/1.png'),
        iconSize: new L.Point(50, 100),
    });

    // useEffect(() => {
    //     if (props?.polygonStation != undefined)

    //         setPolygon(props?.polygonStation)
    //     if (props?.centerStation != undefined) {
    //         if (props?.centerStation?.lat != undefined)
    //             setStationLocation(props?.centerStation)
    //         moveTo(props?.centerStation?.lat, props?.centerStation?.lng)
    //     }
    // }, [map])

    var [center, setCenter] = useState(map.getCenter())

    useEffect(() => {
        var event = map.addEventListener("moveend", (e) => {
            setCenter(map.getCenter())
        })
        return () => {
            map.removeEventListener("moveend", event)
        };

    }, []);

    var flyTo = (lat, lng) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, 16)
    }
    var moveTo = (lat, lng) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, 14, { animate: false })
    }

    useEffect(() => {
        try {
            // console.log('lock')
            // setGetAddressLock(true)
            flyTo(props?.flyTo?.lat, props?.flyTo?.lng)
            // setTimeout(() => {
            //   setGetAddressLock(false)
            // }, 1000)

        } catch (e) { }
    }, [props.flyTo])

    var [route, setRoute] = useState([])
    var purpleOptions = { color: '#F50057', opacity: '0.6', weight: '5' }
    var firstIcon = new L.Icon({
        iconUrl: require('../assets/drawable/1.png'),
        iconSize: new L.Point(50, 100),
    });

    var originIcon = new L.Icon({
        iconUrl: require('../assets/drawable/0.png'),
        iconSize: new L.Point(50, 100),
    });

    var destIcon = new L.Icon({
        iconUrl: require('../assets/drawable/2.png'),
        iconSize: new L.Point(50, 100),
    });
    return <>


        {route.length > 0 ?
            <>
                <Polyline pathOptions={purpleOptions} positions={route} />

                <Marker position={route[0]} icon={firstIcon}  >
                    <Popup>
                        مسافر سوار شده است
                    </Popup>
                </Marker>

                <Marker position={route[route.length - 1]} icon={destIcon} >
                    <Popup>
                        مسافر پیاده شده است

                    </Popup>
                </Marker>
            </>
            : <></>}


        <DivBlock className="position-absolute start-0  p-2" style={{ zIndex: 409 }}>

            <button className="btn btn-light m-2 shadow p-0"
                onClick={() => {
                    props?.onClose()
                }} >
                <CgClose className=" text-hover aPointer  p-2" size={40} />
            </button>
        </DivBlock>
    </>
}