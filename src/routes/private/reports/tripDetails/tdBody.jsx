import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import DivBlock from "../../../../components/customeTag/divBlock";
import { CgClose } from "react-icons/cg";
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { MapSettingsContext } from "../../../../contexts/initialMapSettings";
import Storages from "../../../../app/storages";

import gold from '../../../../assets/drawable/gold.png'
import silver from '../../../../assets/drawable/silver.png'
import bronze from '../../../../assets/drawable/bronze.png'
import { IoIosCall } from "react-icons/io";
import { dateTimeStr, hhmm, hhmmss, withoutTZ, yyyymmdd, yyyymmddhhmm } from '../../../../helper/dateHelper';
import { FaCircle, FaInfoCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import endpoints from "../../../../app/endpoints";
import ProgressBar from "../../../../components/ProgressBar";
import { decode, encode } from "@googlemaps/polyline-codec";
import AddStation from "routes/private/definitions/stations/addStation";
import MapTypeSelector from "components/mapTypeSelector";
import { IoEye, IoEyeOff, IoInformation } from "react-icons/io5";
import toast from "components/toast";
import TripPriceDetails from "./tripPriceDetails";

export default function TdBody({ tripCode, onClose }) {

    var [position, setPosition] = useState([36.31935058, 59.554662])
    const { mapSettings } = useContext(MapSettingsContext);

    var [trip, setTrip] = useState({})
    var [isLoading, setLoading] = useState(false)

    var getTripDetails = (tripCode) => {
        setLoading(true)
        AxiosPrivate.get(endpoints.tripDetails, {
            params: { tripCode: tripCode }
        }).then(res => {
            setTrip(res?.data)
            setPosition([res?.data?.initLat, res?.data?.initLng])
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        getTripDetails(tripCode)
    }, [])



    return (<>

        {
            isLoading ?
                <>
                    <div className=" d-flex justify-content-center align-items-center h-75"  >
                        <ProgressBar />
                        <h2 className="mx-2">
                            در حال دریافت اطلاعات ...
                        </h2>
                    </div>
                </> :
                <div className="start-0 end-0 d-flex  " dir="rtl">
                    <div className='d-flex position-fixed p-0 m-0 start-0 end-0 mx-3 '
                        style={{ bottom: '1rem', top: '1rem' }} >


                        <div className="d-flex flex-column flex-lg-row w-100 h-100 gap-2" >

                            {/* کارت اول */}
                            <div className="card box-1 order-1 order-lg-2 overflow-auto" >


                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <MapContainer
                                        className="w-100 h-100"
                                        zoom={12}
                                        center={position}
                                        zoomControl={false}
                                        attributionControl={false}
                                        key={mapSettings.url}

                                        crs={mapSettings?.crs}
                                        tileSize={mapSettings?.tileSize}
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            url={mapSettings?.url}
                                            tms={mapSettings?.tms}
                                        />
                                        <MapController path={trip?.path} trip={trip} />
                                    </MapContainer>

                                    {/* {!trip?.path || trip.path.length === 0 ? (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // رنگ تیره با شفافیت
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: 'white',
                                                fontSize: '3rem',
                                                zIndex: 1000,
                                            }}
                                        >
                                            مسیر موجود نیست
                                        </div>
                                    ) : null} */}
                                </div>

                            </div>

                            {/* کارت دوم */}

                            <div className="card box-2 order-2 order-lg-1 overflow-auto">
                                <TripInfo trip={trip} />

                            </div>

                        </div>
                        {/* 
                <div className="row w-100 m-0 p-0 g-2">
                    <div className="col-12 col-lg-6 p-1 card  flex-grow-1">
                        <div className="">
                            asfas
                        </div>
                    </div>
                    <div className=" col-12 col-lg-6 p-1 card flex-grow-2">
                        <div className="">
                        </div>
                    </div>
                </div> */}

                    </div>
                    <div className="position-fixed top-0 start-0 ps-3 pt-3">
                        <button className="btn btn-light m-2 shadow p-0 "
                            onClick={() => {
                                onClose()
                            }} >
                            <CgClose className=" text-hover aPointer  p-2" size={40} />
                        </button>
                    </div>
                </div>
        }
    </>)
}

function TripInfo({ trip }) {
    return <div className="d-flex flex-column p-3 overflow-auto vh-100 aScroll p-3" >




        <h5 className={trip?.status == 6 ? 'text-danger iranSansBold'
            : trip?.status == 1 ? 'text-success iranSansBold'
                : 'text-warning iranSansBold'}>{trip?.statusStr}
            {
                trip?.passengerStar == 3 ?
                    <img src={gold} className={"m-0 p-0"}
                        style={{ height: '1.5rem', width: '1.5rem' }} />
                    : trip.passengerStar == 2 ?
                        <img src={silver} className={"m-0 p-0"}
                            style={{ height: '1.5rem', width: '1.5rem' }} />
                        : trip?.passengerStar == 1 ?
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
        {
            trip?.addresses?.map((item, index) => {
                return < label className='text-dark' key={index} title={item?.opName + ' ' + yyyymmddhhmm(item?.insertTime)} onClick={() => {
                    toast.Info(item?.opName + ' ' + yyyymmddhhmm(item?.insertTime))
                }}>
                    <MdOutlineTripOrigin className='text-primary' style={{ width: '1.5rem' }} />{item?.fullAddress}
                </label>

            })

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
                    <td width="50%">زمان متوجه شدن :</td>
                    <td width="50%">{trip?.seenTime} </td>
                </tr>
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
                    <td width="50%">مبلغ با مسیریاب : </td>
                    <td width="50%">
                        <div className="d-flex">
                            {trip?.calcPriceStr}
                            <TripPriceDetails
                                tripCode={trip?.tripCode}>
                                <div className="bg-primary aPointer me-auto card" title="جزییات قیمت">
                                    <IoInformation className=" mx-1 text-white" />

                                </div>
                            </TripPriceDetails>

                        </div>
                    </td>
                </tr>

                <tr >
                    <td width="50%">مبلغ دریافتی راننده از مسافر : </td>
                    <td width="50%">{trip?.finalPriceStr} </td>
                </tr>

                <tr >
                    <td width="50%">کد سفر : </td>
                    <td width="50%">{trip?.tripCode} </td>
                </tr>
                <tr >
                    <td width="50%">مسافت محاسبه شده : </td>
                    <td width="50%">{trip?.calcDistanceStr} </td>
                </tr>
                <tr >
                    <td width="50%">مدت سفر محاسبه شده : </td>
                    <td width="50%">{trip?.durationStr} </td>
                </tr>
                <tr >
                    <td width="50%">مدت ترافیک محاسبه شده : </td>
                    <td width="50%">{trip?.trafficStr} </td>
                </tr>
                <tr >
                    <td width="50%">مسیر : </td>
                    <td width="50%">{trip?.routePathStr} </td>
                </tr>
                <tr >
                    <td width="50%">مسافت حرکت راننده : </td>
                    <td width="50%">{trip?.distanceTaxiMeterStr} </td>
                </tr>
                <tr >
                    <td width="50%"> مدت حرکت راننده : </td>
                    <td width="50%">{trip?.durationTaxiMeterStr} </td>
                </tr>
                <tr >
                    <td width="50%"> مدت توقف راننده : </td>
                    <td width="50%">{trip?.stopTimeTaxiMeterStr} </td>
                </tr>


            </tbody>

        </table>
    </div >
}
const stIcon = (stCode) => {
    return L.divIcon({
        className: "bg-dark text-white rounded text-center iranSansBold opacity-50 ",
        iconSize: [30, 20],

        iconAnchor: [15, 10],
        html: `<span class="icon-text" style="font-size: 14px;">${stCode}</span>`
    })
}
const addressIcon = (stCode) => {
    return L.divIcon({
        className: "bg-dark text-white rounded text-center iranSansBold",
        iconSize: [20, 20],

        iconAnchor: [15, 15],
        html: `<span class="icon-text" style="font-size: 14px;">${stCode}</span>`
    })
}
const addressIcon2 = (stCode) => {
    return L.divIcon({
        className: "bg-primary text-white rounded text-center iranSansBold",
        iconSize: [20, 20],

        iconAnchor: [15, 15],
        html: `<span class="icon-text" style="font-size: 14px;">${stCode}</span>`
    })
}

function MapController({ path, trip }) {

    var [route, setRoute] = useState([])
    var [routeNeshan, setRouteNeshan] = useState([])
    var [routeDriver, setRouteDriver] = useState([])

    const map = useMap()
    var [center, setCenter] = useState(map.getCenter())

    useEffect(() => {
        getStations()

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

        if (trip?.pathNeshan)
            setRouteNeshan(decode(trip?.pathNeshan, 5))

    }, [trip?.pathNeshan])

    useEffect(() => {

        if (trip?.pathDriver)
            setRouteDriver(decode(trip?.pathDriver, 5))

    }, [trip?.pathDriver])
    useEffect(() => {

        let bounds = new L.LatLngBounds();
        console.log('sssssssss', route.length)
        if (route.length > 0) {
            route.forEach((marker) => {
                bounds.extend([marker[0], marker[1]]);
            });

            map.fitBounds(bounds)
        }

    }, [route])

    var [stations, setStations] = useState([])

    var getStations = () => {
        AxiosPrivate.get(endpoints.stations, {}).then(res => {
            setStations(res.data)
        })
    }

    var carYellow = new L.Icon({
        iconUrl: require('../../../../assets/drawable/car_yellow.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 40)
    });

    var firstIcon = new L.Icon({
        iconUrl: require('../../../../assets/drawable/1.png'),
        iconSize: new L.Point(50, 100),
    });

    var originIcon = new L.Icon({
        iconUrl: require('../../../../assets/drawable/0.png'),
        iconSize: new L.Point(50, 100),
    });

    var destIcon = new L.Icon({
        iconUrl: require('../../../../assets/drawable/2.png'),
        iconSize: new L.Point(50, 100),
    });
    var pinkOptions = { color: '#0059ffff', opacity: '0.9', weight: '5' }
    var orangOptions = { color: '#000000ff', opacity: '0.9', weight: '5' }

    var [showStations, setShowStations] = useState(false)
    return <>

        <DivBlock className="position-absolute end-0  p-2 d-flex align-items-center" style={{ zIndex: 409 }}>
            <div className=" d-flex">
                <MapTypeSelector />
            </div>
            <div className=" d-flex me-2">
                {
                    showStations ?
                        <button className="btn btn-light" onClick={() => {
                            setShowStations(false)
                        }}>
                            عدم نمایش ایستگاه
                        </button>

                        : <button className="btn btn-light" onClick={() => {
                            setShowStations(true)
                        }}>
                            نمایش ایستگاه

                        </button>
                }
            </div>
        </DivBlock>

        {/* {trip?.fromLat > 0 ? <Marker position={[trip?.fromLat, trip?.fromLng]} icon={firstIcon}  >
            <Popup>
                مسافر سوار شده است
            </Popup>
        </Marker> :
            <></>
        }
        {trip?.toLat > 0 ? <Marker position={[trip?.toLat, trip?.toLng]} icon={destIcon}  >
            <Popup>
                مسافر سوار شده است
            </Popup>
        </Marker> :
            <></>} */}




        {routeNeshan.length > 0 ?
            <>
                <Polyline pathOptions={pinkOptions} positions={routeNeshan} >
                    <Popup>
                        مسیریاب
                    </Popup>
                </Polyline>

                {
                    trip?.addresses?.length == 0 ? <>
                        < Marker position={routeNeshan[0]} icon={addressIcon2(1)} />
                        <Marker position={routeNeshan[routeNeshan.length - 1]} icon={addressIcon2(2)} />
                    </> : <></>
                }

            </>
            : <></>}

        {routeDriver.length > 0 ?
            <>
                <Polyline pathOptions={orangOptions} positions={routeDriver} >
                    <Popup>
                        راننده
                    </Popup>
                </Polyline>

                <Marker position={routeDriver[0]} icon={addressIcon(1)}   >
                    <Popup>
                        شروع راننده
                    </Popup>
                </Marker>

                <Marker position={routeDriver[routeDriver.length - 1]} icon={addressIcon(2)} >
                    <Popup>
                        خاتمه راننده
                    </Popup>
                </Marker>
            </>
            : <></>}


        {
            trip?.addresses?.map((item, index) => {
                return <Marker position={[item?.lat, item?.lng]} icon={addressIcon2(index + 1)} >
                    <Popup>
                        {item?.fullAddress}
                    </Popup>
                </Marker>
            })

        }
        {
            stations?.length > 0 && showStations ?
                stations?.map((item, index) => {
                    return <div key={index} style={{ zIndex: 10000 }}>
                        <>
                            {/* <Marker position={[item?.lat, item?.lng]}
                                icon={stIcon(item.stCode)}

                                eventHandlers={{
                                    dragend: (e) => {

                                    }
                                }} >

                            </Marker> */}
                            <Polygon

                                positions={item?.polygonStation}
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.03, opacity: 0.4 }}
                                eventHandlers={{
                                    click: () => {
                                    }
                                }}
                            >
                                <Popup>
                                    {item.stCode + ' ' + item.stName}
                                    <AddStation
                                        station={item}
                                        stations={stations}
                                        onClose={() => {
                                            getStations()
                                        }}
                                    >

                                        <button className="btn btn-primary me-3" >ویرایش</button>
                                    </AddStation>
                                </Popup>

                            </Polygon>
                        </>
                    </div>
                })
                : <></>
        }



    </>
}