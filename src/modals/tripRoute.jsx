import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import { IoArrowBack } from "react-icons/io5"

import { CgClose } from 'react-icons/cg'
import { decode, encode } from "@googlemaps/polyline-codec";

import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import _ from 'lodash'
import DivBlock from "../components/customeTag/divBlock";

import ProgressBar from "../components/ProgressBar";


import { MapSettingsContext } from "../contexts/initialMapSettings";


export default function TripRoute(props) {
    var [show, setShow] = useState(false)
    var position = [36.31935058, 59.554662]
    var [isLoading, setLoading] = useState(false)
    var [route, setRoute] = useState([])


    useEffect(() => {
        if (show) {
            console.log(props?.data?.path)
            if (props?.data?.path)

                setRoute(decode(props?.data?.path, 5))
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
                            <div className="col-12  vh-100">
                                <MapContainer
                                    className="w-100 vh-100"
                                    center={position}
                                    zoom={13}
                                    zoomControl={false}
                                    key={mapSettings.url}

                                    crs={mapSettings?.crs}
                                    tileSize={mapSettings?.tileSize}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer
                                        url={mapSettings?.url}
                                        tms={mapSettings?.tms}
                                    />
                                    <MapController route={route} onClose={() => {
                                        setShow(false)
                                    }} />
                                </MapContainer>

                            </div>
                        </div>


                }

            </Modal.Body>


        </Modal>
    </>)
}




function MapController({ route, onClose }) {
    const map = useMap()
    // var location = useLocation()


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
    var carYellow = new L.Icon({
        iconUrl: require('../assets/drawable/car_yellow.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 40)
    });

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
    var purpleOptions = { color: '#F50057', opacity: '0.6', weight: '5' }


    return <>

        <DivBlock className="position-absolute" style={{ zIndex: 409 }}>
            <button className="btn btn-light m-2 shadow p-0"
                onClick={() => {
                    //close modal
                    onClose()
                }} >
                <IoArrowBack className=" text-hover aPointer  p-2" size={40} />
            </button>
        </DivBlock>

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


        {/* {carsLocation.map((location, index) => {
      return <Marker position={{ lat: location?.lat, lng: location?.lng }}
        rotationAngle={location.bearing}
        rotationOrigin="center"
        icon={carYellow}>
        <Popup>
          salam
        </Popup>
      </Marker>
    })} */}
    </>
}
