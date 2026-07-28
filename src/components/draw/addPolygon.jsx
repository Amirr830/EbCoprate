import React, { useEffect, useState } from "react";
import { EditControl, Polygon, useMap, Marker } from "react-leaflet";
import L, { polygon } from "leaflet";
import square from 'assets/drawable/square.png'
import squareGray from 'assets/drawable/square-gray.png'

export default function AddPolygon(props) {

    var map = useMap()

    var [polygon, setPolygon] = useState([])
    useEffect(() => {
        if (props.allowDraw) {
            setPolygon(props?.polygon)
        }
    }, [props.allowDraw])

    useEffect(() => {
        if (props.allowDraw) {
            map.on('click', (e) => {
                // setPolygon(prevState => [...prevState, e.latlng])
                console.log(polygon)
                setPolygon(prev => {
                    const newPolygon = [...prev, e.latlng]
                    console.log(prev)
                    if (props?.polygon?.length == 0) {
                        onEdit(newPolygon)
                        return newPolygon
                    } else {
                        return prev
                    }
                })
            })
        } else {
            map.off('click')
            props.onChange(polygon)
            setPolygon([])
        }
    }, [props.allowDraw])

    const icon = L.icon({
        iconSize: [20, 20],
        iconUrl: square
    });

    const iconCenter = L.icon({
        iconSize: [20, 20],
        iconUrl: squareGray,
        opacity: 0.5

    });

    var equal = (a, b) => {
        if (a.lat == b.lat && a.lng == b.lng) {
            return true
        } else return false
    }

    var bitween = (a, b) => {
        return { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 }
    }

    var onEdit = (polygon) => {
        setPolygon(polygon)
        props?.onChange(polygon)
    }
    var [canAddPoint, setCanAddPoint] = useState(true)
    var canRemoveMarker = true

    return (
        <div>
            {polygon ?
                <Polygon positions={polygon}
                    pathOptions={{ color: 'blue', fillColor: 'red', fillOpacity: 0.15, opacity: 0.7, dashArray: '10,0', weight: '5' }}
                />
                : <></>}
            {
                polygon?.map((position, index) => {
                    return <div key={index}
                    >

                        <Marker
                            position={bitween(position, polygon[index == polygon.length - 1 ? 0 : index + 1])}
                            icon={iconCenter}
                            draggable={true}
                            opacity={0.6}
                            eventHandlers={{
                                dragend: (e) => {
                                    var index = polygon.indexOf(position)
                                    var newPolygon = [...polygon.slice(0, index + 1), { ...e.target.getLatLng() }, ...polygon.slice(index + 1, polygon.length)]
                                    console.log(polygon, newPolygon)
                                    onEdit(newPolygon)
                                }
                            }} />

                        <Marker
                            position={position}
                            icon={icon}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    var index = polygon.indexOf(position)
                                    var newPolygon = [...polygon]
                                    newPolygon[index] = { ...e.target.getLatLng() }
                                    onEdit(newPolygon)
                                },

                                dragstart: (e) => {
                                    canRemoveMarker = false
                                    map.off('click')
                                },
                                mouseup: (e) => {
                                    if (canRemoveMarker) {
                                        var newPolygon = [...polygon.filter(position => !equal(position, e.target.getLatLng()))]
                                        onEdit(newPolygon)
                                    }
                                    canRemoveMarker = true
                                },
                            }}
                        />
                    </div>
                })
            }
        </div>)


}