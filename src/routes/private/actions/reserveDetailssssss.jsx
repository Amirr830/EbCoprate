import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { useLocation, useNavigate } from "react-router-dom";

import "leaflet-rotatedmarker";
import { IoMdArrowRoundBack } from "react-icons/io";
import { dateTimeStr } from "../../../helper/dateHelper";
import { FaMapLocationDot } from "react-icons/fa6";
import { CgDetailsMore } from "react-icons/cg";
import { MapSettingsContext } from "../../../contexts/initialMapSettings";

function MapController(props) {
    const map = useMap()
    var navigate = useNavigate()

    var origin = new L.Icon({
        iconUrl: require('../../../assets/drawable/0.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(50, 100)
    });


    var dest1 = new L.Icon({
        iconUrl: require('../../../assets/drawable/1.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(50, 100)
    });


    var dest2 = new L.Icon({
        iconUrl: require('../../../assets/drawable/2.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(50, 100)
    });


    useEffect(() => {
        var markers = [
            {
                lat: props?.reserve?.oLat,
                lng: props?.reserve?.oLng
            },
            {
                lat: props?.reserve?.d1Lat,
                lng: props?.reserve?.d1Lng
            },
            {
                lat: props?.reserve?.d2Lat,
                lng: props?.reserve?.d2Lng
            },

        ]

        let bounds = new L.LatLngBounds();

        // loop through the markers and extend the bounds
        markers.forEach((marker) => {
            bounds.extend([marker.lat, marker.lng]);
        });

        map.fitBounds(bounds)

    }, [])

    return <>
        <DivBlock className="position-absolute start-0" style={{ zIndex: 409 }}>

            <button className="btn btn-light m-2 shadow p-0"
                onClick={() => {
                    navigate(-1)
                }} >
                <IoMdArrowRoundBack className=" text-hover aPointer  p-2" size={40} />
            </button>
        </DivBlock>
        <DivBlock className="position-absolute end-0 d-block d-lg-none" style={{ zIndex: 409 }}>

            <button className="btn btn-light m-2 shadow p-0"
                onClick={() => {
                    props.showDetails()
                }} >
                <CgDetailsMore className=" text-hover aPointer  p-2" size={40} />
            </button>
        </DivBlock>


        <Marker position={{ lat: props?.reserve?.oLat, lng: props?.reserve?.oLng }}
            icon={origin}>
            <Popup>
                مبدا
            </Popup>
        </Marker>
        <Marker position={{ lat: props?.reserve?.d1Lat, lng: props?.reserve?.d1Lng }}
            icon={dest1}>
            <Popup>
                مقصد
            </Popup>
        </Marker>
        {/* <Marker position={{ lat: props?.reserve?.d2Lat, lng: props?.reserve?.d2Lng }}
            icon={dest2}>
            <Popup>
                 2مقصد
            </Popup>
        </Marker> */}


    </>
}


// function useMapFitBounds(markers) {
//     const [center, setCenter] = useState([0, 0]); // the initial center
//     const [zoom, setZoom] = useState(13); // the initial zoom

//     useEffect(() => {
//         // create a LatLngBounds object
//         let bounds = new L.LatLngBounds();

//         // loop through the markers and extend the bounds
//         markers.forEach((marker) => {
//             bounds.extend([marker.lat, marker.lng]);
//         });

//         // get the center and zoom from the bounds
//         const newCenter = bounds.getCenter();
//         const newZoom = L.CRS.EPSG3857.getBoundsZoom(bounds);

//         // update the state
//         setCenter(newCenter);
//         setZoom(newZoom);
//     }, [markers]); // update the center and zoom when the markers change

//     return { center, zoom }; // return the center and zoom
// }



export default function ReserveDetails(props) {
    const { mapSettings } = useContext(MapSettingsContext);

    var [showMap, setShowMap] = useState(false)
    var navigate = useNavigate()
    var location = useLocation()
    return (
        <div className="row  m-0 p-0" dir="rtl">
            <div className="col-12 col-lg-4  bg-light vh-100  position-absolute end-0 p-2" style={{ zIndex: showMap ? 999 : 1001 }}>

                <div className="col-12 d-flex mb-2 d-block  d-lg-none  " >
                    <button className=" btn btn-light  p-0 col-1"
                        onClick={() => {
                            setShowMap(true)
                        }} >
                        <FaMapLocationDot className=" text-hover aPointer  p-2" size={40} />
                    </button>
                    <p className="mx-auto iranSansBold  my-auto">جزییات</p>
                    <button className=" btn btn-light  p-0 col-1"
                        onClick={() => {
                            navigate(-1)

                        }} >
                        <IoMdArrowRoundBack className=" text-hover aPointer  p-2" size={40} />
                    </button>
                </div>

                <hr className='m-0 my-1 mb-3 d-block d-lg-none' />

                <div className="row col-12 p-2 m-0">


                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3"  >
                            وضعیت :
                        </label>
                        <label className="iranSansBold col-9" >
                            {location?.state?.statusStr}
                        </label>
                    </div>

                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3"  >
                            نام :
                        </label>
                        <label className="iranSansBold col-9" >
                            {location?.state?.customerName}
                        </label>
                    </div>

                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3"  >
                            همراه :
                        </label>
                        <label className="iranSansBold col-9" >
                            {location?.state?.mobile}
                        </label>
                    </div>

                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            مبلغ :
                        </label>
                        <label className="iranSansBold text-danger  col-9" >
                            {location?.state?.priceStr}
                        </label>
                    </div>

                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            ساعت درخواست :
                        </label>
                        <label className="iranSans col-9" >
                            {dateTimeStr(location?.state?.reqTime)}
                        </label>
                    </div>

                    <div className='d-flex ' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            ساعت رزرو :
                        </label>
                        <label className="iranSans col-9" >
                            {dateTimeStr(location?.state?.reserveTime)}
                        </label>
                    </div>

                    <hr className='m-0 my-1' />

                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            مبدا :
                        </label>
                        <label className="iranSansBold text-primary  col-9" >
                            {location?.state?.oAddress}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            مقصد :
                        </label>
                        <label className="iranSansBold  text-danger col-9" >
                            {location?.state?.d1Address}
                        </label>
                    </div>
                    <hr className='m-0 my-1' />
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            توقف :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.stopTime}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            رفت و برگشت :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.isBackToOrigin}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            بار اضافه :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.moreLoad}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            تعداد همراه :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.escortCount}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            مبلغ اضافه :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.extraFare}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            توضیحات :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.desc}
                        </label>
                    </div>
                    <hr className='m-0 my-1' />

                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            نام راننده :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.driverName}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            کد راننده :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.driverCode}
                        </label>
                    </div>
                    <div className='d-flex' >
                        <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                            شماره همراه راننده :
                        </label>
                        <label className="iranSansBold   col-9" >
                            {location?.state?.driverMobile}
                        </label>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-8 m-0 p-0  position-absolute start-0" style={{ zIndex: 1000 }}>
                <MapContainer
                    className="w-100 vh-100 "
                    zoom={13}
                    crs={mapSettings?.crs}
                    tileSize={mapSettings?.tileSize}
                    key={mapSettings.url}

                    zoomControl={false}
                    scrollWheelZoom={true}>
                    <TileLayer
                        url={mapSettings?.url}
                        tms={mapSettings?.tms}
                    />
                    <MapController reserve={location?.state}
                        showDetails={() => {
                            setShowMap(false)
                        }} />
                </MapContainer>
            </div>

        </div>
    );
}

function DivBlock(props) {
    var divRef = useRef()
    useEffect(() => {
        L.DomEvent.disableClickPropagation(divRef.current)
    }, [divRef])
    var div = React.cloneElement(<div ref={divRef}>{props?.children}</div>, props)
    console.log(div)
    return div;
}