import { Modal } from "react-bootstrap";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import DivBlock from "components/customeTag/divBlock";
import { CgClose } from "react-icons/cg";
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { MapSettingsContext } from "contexts/initialMapSettings";
import Storages from "app/storages";
import pin from "assets/drawable/pin.png";

import gold from 'assets/drawable/gold.png'
import silver from 'assets/drawable/silver.png'
import bronze from 'assets/drawable/bronze.png'
import { IoIosCall } from "react-icons/io";
import { dateTimeStr, hhmm, hhmmss, withoutTZ, yyyymmdd, yyyymmddhhmm } from 'helper/dateHelper';
import { FaCircle, FaInfoCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import ProgressBar from "components/ProgressBar";
import { decode, encode } from "@googlemaps/polyline-codec";
import AddStation from "routes/private/definitions/stations/addStation";
import SearchAddress from "routes/private/actions/entrance/searchAddress";
import MapTypeSelector from "components/mapTypeSelector";


export default function TripEditOrigin(props) {
    var [show, setShow] = useState(false)

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

    var [position, setPosition] = useState([36.31935058, 59.554662])
    const { mapSettings } = useContext(MapSettingsContext);

    var [trip, setTrip] = useState({})
    var [isLoading, setLoading] = useState(false)

    var getTripDetails = (tripCode) => {
        setLoading(true)
        console.log(tripCode)
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

        if (show) {
            var tripCode = props?.tripCode;
            getTripDetails(tripCode)
        }
    }, [show])


    return (<>
        {newFirstChild}

        <Modal show={show}
            centered

            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-0 m-0 bg-white" style={{ height: '85vh' }} dir="rtl">

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
                        <div style={{ position: 'relative', width: '100%', height: '100%', padding: 0 }}>
                            <MapContainer
                                className="w-100 h-100"
                                key={mapSettings.url}
                                zoom={12}
                                center={position}
                                zoomControl={false}
                                attributionControl={false}
                                crs={mapSettings?.crs}
                                tileSize={mapSettings?.tileSize}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    url={mapSettings?.url}

                                    tms={mapSettings?.tms}
                                />
                                <MapController path={trip?.path} trip={trip} close={() => { setShow(false) }} />
                            </MapContainer>


                        </div>

                }


            </Modal.Body>

        </Modal>
    </>)

}

const stIcon = (stCode) => {
    return L.divIcon({
        className: "bg-dark text-white rounded text-center iranSansBold opacity-75 ",
        iconSize: [30, 20],

        iconAnchor: [15, 10],
        html: `<span class="icon-text" style="font-size: 14px;">${stCode}</span>`
    })
}

function MapController({ path, trip, close }) {

    var [route, setRoute] = useState([])

    const map = useMap()
    var [center, setCenter] = useState(map.getCenter())
    var [originAddress, setOriginAddress] = useState("")


    useEffect(() => {
        getStations()
        flyTo(trip?.fromLat, trip?.fromLng)
        setOriginAddress(trip?.originAddr)
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
        console.log('sssssssss', path)

        if (path)
            setRoute(decode(path, 5))

    }, [path])
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
    var updateOrigin = () => {
        console.log({ newLat: center.lat, newLng: center.lng, tripCode: trip.tripCode })
        AxiosPrivate.put(endpoints.tripEditOrigin, { newLat: center.lat, newLng: center.lng, tripCode: trip.tripCode, newAddress: originAddress }).then(res => {

        })
        close();
    }

    var carYellow = new L.Icon({
        iconUrl: require('assets/drawable/car_yellow.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 40)
    });

    var firstIcon = new L.Icon({
        iconUrl: require('assets/drawable/1.png'),
        iconSize: new L.Point(50, 100),
    });

    var originIcon = new L.Icon({
        iconUrl: require('assets/drawable/0.png'),
        iconSize: new L.Point(50, 100),
    });

    var destIcon = new L.Icon({
        iconUrl: require('assets/drawable/2.png'),
        iconSize: new L.Point(50, 100),
    });
    var purpleOptions = { color: '#F50057', opacity: '0.6', weight: '5' }

    return <>
        <DivBlock className="position-absolute end-0 top-50  p-2 d-flex align-items-center" style={{ zIndex: 409 }}>
            <div className=" d-flex">
                <MapTypeSelector />
            </div>

        </DivBlock>
        {trip?.fromLat > 0 ? <Marker position={[trip?.fromLat, trip?.fromLng]} icon={firstIcon}>
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
            <></>}

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

        {
            stations?.length > 0 ?
                stations?.map((item, index) => {
                    return <div key={index} style={{ zIndex: 10000 }}>
                        <>
                            <Marker position={[item?.lat, item?.lng]}
                                icon={stIcon(item.stCode)}

                                eventHandlers={{
                                    dragend: (e) => {

                                    }
                                }} >

                            </Marker>
                            <Polygon

                                positions={item?.polygonStation}
                                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1, opacity: 0.7 }}
                                eventHandlers={{
                                    click: () => {
                                    }
                                }}
                            >
                                {/* <Popup>
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
                                </Popup> */}

                            </Polygon>
                        </>
                    </div>
                })
                : <></>
        }


        <DivBlock className="position-absolute start-0 end-0 p-2" style={{ zIndex: 409 }}>
            <div className=" row g-2">

                <div className=" col-12">
                    <SearchAddress
                        className="form-control shadow "
                        center={{ lat: trip?.fromLat, lng: trip?.fromLng }}
                        calcPriceByRouting={1}
                        onSelectAddress={(item) => {
                            flyTo(item.lat, item.lng)
                        }} />

                </div>



            </div>

        </DivBlock>

        <div className="position-absolute bottom-50  d-flex justify-content-center noSelect "
            style={{ zIndex: 409, left: '45%', right: '45%', height: '4rem', paddingTop: '0.3rem' }}>
            <img
                src={pin}
                style={{ height: '4rem' }} />
        </div>

        <DivBlock className="position-absolute bottom-0 start-0 end-0 p-3" style={{ zIndex: 409 }}>
            <div className=" row g-2">

                <div className='col-12 '>
                    <input type="text"
                        className="form-control"
                        placeholder="آدرس کامل مبدا"
                        name="custTel"
                        value={originAddress}
                        onChange={(e) => {
                            setOriginAddress(e.target.value)
                        }}
                    />
                </div>
                <div className='col-12  '>
                    <button className="btn btn-primary  shadow p-0 col-8 p-2 mt-0"
                        onClick={() => {
                            updateOrigin()
                        }}>
                        ویرایش مبدا
                    </button>
                    <button className="btn btn-danger  shadow p-0 col-4 p-2 mt-0"
                        onClick={() => {
                            close()
                        }}>
                        انصراف
                    </button>
                </div>
            </div>
        </DivBlock>
    </>
}