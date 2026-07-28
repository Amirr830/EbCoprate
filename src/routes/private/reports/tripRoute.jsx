import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { IoArrowBack } from "react-icons/io5"
import { useLocation, useNavigate } from "react-router-dom";
import Storages from "../../../app/storages";
import endpoints from "../../../app/endpoints";
import "leaflet-rotatedmarker";
import DivBlock from "../../../components/customeTag/divBlock";
import { decode, encode } from "@googlemaps/polyline-codec";
import { AxiosPrivate } from "../../../app/axiosPrivate";
import { MapSettingsContext } from "../../../contexts/initialMapSettings";


function MapController(props) {
    const map = useMap()
    var navigate = useNavigate()
    var location = useLocation()
    var [carsLocation, setCarsLocaion] = useState([])
    var [route, setRoute] = useState([])


    useEffect(() => {
        console.log(location.state.path)
        if (location.state.path)
            setRoute(decode(location.state.path, 5))

    }, [location])

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
        iconUrl: require('../../../assets/drawable/car_yellow.png'),
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 40)
    });

    var firstIcon = new L.Icon({
        iconUrl: require('../../../assets/drawable/1.png'),
        iconSize: new L.Point(50, 100),
    });

    var originIcon = new L.Icon({
        iconUrl: require('../../../assets/drawable/0.png'),
        iconSize: new L.Point(50, 100),
    });

    var destIcon = new L.Icon({
        iconUrl: require('../../../assets/drawable/2.png'),
        iconSize: new L.Point(50, 100),
    });
    var purpleOptions = { color: '#F50057', opacity: '0.6', weight: '5' }


    return <>

        <DivBlock className="position-absolute" style={{ zIndex: 409 }}>
            <button className="btn btn-light m-2 shadow p-0"
                onClick={() => {
                    navigate(-1)
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


export default function TripRoute() {
    const { mapSettings } = useContext(MapSettingsContext);

    var position = [36.39, 59.56]
    return (
        <div >

            <MapContainer
                className="w-100 vh-100"
                center={position}
                key={mapSettings.url}

                zoom={13}
                zoomControl={false}
                crs={mapSettings?.crs}
                tileSize={mapSettings?.tileSize}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url={mapSettings?.url}
                    tms={mapSettings?.tms}
                />
                <MapController />
            </MapContainer>


        </div >
    );
}