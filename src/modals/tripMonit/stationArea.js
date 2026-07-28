import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import 'leaflet/dist/leaflet.css';
import _ from 'lodash'
import { CgClose } from 'react-icons/cg'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AxiosPrivate } from "../../app/axiosPrivate";
import endpoints from "../../app/endpoints";
import toast from "../../components/toast";
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapSettingsContext } from "../../contexts/initialMapSettings";
import DivBlock from "components/customeTag/divBlock";

export default function StationArea(props) {
    var [show, setShow] = useState(false)
    var [streets, setStreets] = useState([])
    var [stDetails, setStDetails] = useState({})
    const [polygon, setPolygon] = useState([])
    var position = [36.31935058, 59.554662]

    var getStationDetails = (stCode) => {
        AxiosPrivate.get(endpoints.stationDetails, {
            params: {
                stCode
            }
        }).then(res => {
            setStreets(res?.data?.streets)
            setStDetails(res?.data?.details)
            setPolygon(res?.data?.polygon)
            // console.log('sss', stDetails?.lat, stDetails?.lng)

            // if (res?.data?.status == 1) {
            // toast.Success(res?.data?.msg)
            // setTurns(res?.data?.newTurn)
            // }
        })
    }

    useEffect(() => {
        if (props?.stCode) {
            setShow(true)
            getStationDetails(props?.stCode)
        } else {
            setShow(false)
        }
    }, [props?.stCode])
    const { mapSettings } = useContext(MapSettingsContext);

    return (<>
        <Modal
            show={show}
            centered
            onHide={() => {
                setShow(false)
                setStDetails(false);
                props?.onClose()
            }}
            fullscreen

            className="h-100"
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 m-0 card " dir="rtl">

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
                                        key={mapSettings.url}

                                        attributionControl={false}
                                        crs={mapSettings?.crs}
                                        tileSize={mapSettings?.tileSize}
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            url={mapSettings?.url}
                                            tms={mapSettings?.tms}
                                        />
                                        {
                                            (stDetails?.lat && show) ? <MapController stDetails={stDetails} polygon={polygon}
                                                onClose={() => {
                                                    setShow(false)
                                                }} /> : <></>
                                        }
                                    </MapContainer>


                                </div>

                            </div>

                            {/* کارت دوم */}

                            <div className="card box-2 order-2 order-lg-1 overflow-auto">

                                <h2 className="p-0 m-0 text-center">{stDetails?.stName}</h2>
                                <table className="table  table-striped table-hover rounded m-0 p-0">
                                    <thead >
                                        <tr >
                                            <td className="py-1 iranSansBold small" width="60%">
                                                نام خیابان ها
                                            </td>
                                            <td className="py-1" width="20%">
                                                زوج
                                            </td>
                                            <td className="py-1" width="20%">
                                                فرد
                                            </td>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            streets?.map((item, index) => {

                                                return <tr key={index}>
                                                    <td className="py-1 iranSansBold small" width="10%">
                                                        {item?.streetDesc}
                                                    </td>
                                                    <td className="py-1" width="10%">
                                                        {item?.even}
                                                    </td>
                                                    <td className="py-1" width="10%">
                                                        {item?.odd}
                                                    </td>

                                                </tr>

                                            })
                                        }
                                    </tbody>
                                </table>




                            </div>

                        </div>

                    </div>
                    <div className="position-fixed top-0 start-0 ps-3 pt-3">
                        <button className="btn btn-light m-2 shadow p-0 "
                            onClick={() => {
                                setShow(false)
                            }} >
                            <CgClose className=" text-hover aPointer  p-2" size={40} />
                        </button>
                    </div>
                </div>




            </Modal.Body>

        </Modal>
    </>)
}

const stIcon = (stCode) => {
    return L.divIcon({
        className: "bg-dark text-white rounded text-center iranSansBold ",
        iconSize: [30, 20],
        iconAnchor: [15, 10],
        html: `<span class="icon-text" style="font-size: 14px;">${stCode}</span>`
    })
}
function MapController({ stDetails, polygon, onClose }) {
    const blueOptions = { color: 'blue' }
    var [stations, setStations] = useState([])

    var originIcon = new L.Icon({
        iconUrl: require('../../assets/drawable/1.png'),
        iconSize: new L.Point(50, 100),
    });
    const map = useMap()

    var flyTo = (lat, lng) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, 16)
    }
    var flyTo = (lat, lng, zoom) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, zoom)
    }
    var moveTo = (lat, lng) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, 13, { animate: false })
    }

    useEffect(() => {
        console.log(polygon)
        moveTo(stDetails?.lat ?? 0, stDetails?.lng ?? 0)
        getStations()
    }, [])


    var getStations = () => {
        AxiosPrivate.get(endpoints.stations, {}).then(res => {
            setStations(res.data)
        })
    }

    return <>
        {/* 
        <Marker position={[stDetails?.lat ?? 0, stDetails?.lng ?? 0]}
            icon={originIcon}
        ></Marker> */}

        {
            polygon.length == 0 ? < Circle
                center={[stDetails?.lat ?? 0, stDetails?.lng ?? 0]}
                fillColor="blue"
                radius={stDetails?.radius} />
                : <Polygon
                    positions={polygon}
                    pathOptions={blueOptions} />

        }

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
                                pathOptions={{ color: 'red', fillColor: 'blue', fillOpacity: 0.1, opacity: 0.5, dashArray: '5, 10' }}
                                eventHandlers={{
                                    click: () => {
                                    }
                                }}
                            >

                            </Polygon>
                        </>
                    </div>
                })
                : <></>
        }


    </>
}