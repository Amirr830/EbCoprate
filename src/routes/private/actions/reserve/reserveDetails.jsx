import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import 'leaflet/dist/leaflet.css';
import _, { find } from 'lodash'
import { MapSettingsContext } from "../../../../contexts/initialMapSettings";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CgDetailsMore } from "react-icons/cg";
import { dateTimeStr } from "../../../../helper/dateHelper";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
export default function ReserveDetails(props) {

    var [show, setShow] = useState(false)
    const { mapSettings } = useContext(MapSettingsContext);

    var [showMap, setShowMap] = useState(false)
    var [location, setLocation] = useState()
    useEffect(() => {
        if (show) {
            console.log("ffffffffff", props?.data)
            setLocation(props?.data)
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

    return (<>
        {newFirstChild}
        <Modal show={show}
            centered
            fullscreen={true}

            onHide={() => {
                setShow(false)
            }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  m-0 p-0 card p-3 " dir="rtl">
                <div className="row  m-0 p-0 vh-100 overflow-hidden">
                    <div className="col-12 col-lg-4  bg-light position-absolute end-0 p-2 m-0" style={{ zIndex: showMap ? 999 : 1001 }}>

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
                                    setShow(false)
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
                                    {location?.statusStr}
                                </label>
                            </div>

                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3"  >
                                    نام :
                                </label>
                                <label className="iranSansBold col-9" >
                                    {location?.customerName}
                                </label>
                            </div>

                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3"  >
                                    همراه :
                                </label>
                                <label className="iranSansBold col-9" >
                                    {location?.mobile}
                                </label>
                            </div>

                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    مبلغ :
                                </label>
                                <label className="iranSansBold text-danger  col-9" >
                                    {location?.priceStr}
                                </label>
                            </div>

                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    ساعت درخواست :
                                </label>
                                <label className="iranSans col-9" >
                                    {dateTimeStr(location?.reqTime)}
                                </label>
                            </div>

                            <div className='d-flex ' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    ساعت رزرو :
                                </label>
                                <label className="iranSans col-9" >
                                    {dateTimeStr(location?.reserveTime)}
                                </label>
                            </div>

                            <hr className='m-0 my-1' />

                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    مبدا :
                                </label>
                                <label className="iranSansBold text-primary  col-9" >
                                    {location?.oAddress}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    مقصد :
                                </label>
                                <label className="iranSansBold  text-danger col-9" >
                                    {location?.d1Address}
                                </label>
                            </div>
                            <hr className='m-0 my-1' />
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    توقف :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.stopTime}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    رفت و برگشت :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.isBackToOrigin}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    بار اضافه :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.moreLoad}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    تعداد همراه :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.escortCount}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    مبلغ اضافه :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.extraFare}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    توضیحات :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.desc}
                                </label>
                            </div>
                            <hr className='m-0 my-1' />

                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    نام راننده :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.driverName}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    کد راننده :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.driverCode}
                                </label>
                            </div>
                            <div className='d-flex' >
                                <label className="opacity-50 iranSans ms-2 noSelect col-3" >
                                    شماره همراه راننده :
                                </label>
                                <label className="iranSansBold   col-9" >
                                    {location?.driverMobile}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8 m-0 p-0  position-absolute start-0 top-0 overflow-hidden vh-100" style={{ zIndex: 1000 }}>
                        <MapContainer
                            className="w-100  vh-100 "
                            zoom={13}
                            crs={mapSettings?.crs}
                            tileSize={mapSettings?.tileSize}
                            zoomControl={false}
                            key={mapSettings.url}

                            scrollWheelZoom={true}>
                            <TileLayer
                                url={mapSettings?.url}
                                tms={mapSettings?.tms}
                            />
                            <MapController reserve={location}
                                close={() => {
                                    setShow(false)
                                }}
                                showDetails={() => {
                                    setShowMap(false)

                                }} />
                        </MapContainer>
                    </div>

                </div>
            </Modal.Body>

        </Modal>
    </>)
}
function MapController(props) {
    const map = useMap()

    var origin = new L.Icon({
        iconUrl: require('../../../../assets/drawable/0.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(50, 100)
    });


    var dest1 = new L.Icon({
        iconUrl: require('../../../../assets/drawable/1.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(50, 100)
    });


    var dest2 = new L.Icon({
        iconUrl: require('../../../../assets/drawable/2.png'),
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
                    props?.close()
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

function DivBlock(props) {
    var divRef = useRef()
    useEffect(() => {
        L.DomEvent.disableClickPropagation(divRef.current)
    }, [divRef])
    var div = React.cloneElement(<div ref={divRef}>{props?.children}</div>, props)
    console.log(div)
    return div;
}