import React, { useEffect, useMemo,  useRef} from "react";
import L, { polygon } from "leaflet";
import { map, TileLayer, FeatureGroup, Polygon, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import pinb from './../../assets/drawable/1.png'
import { useState } from "react";


export const EditPolygon = (props) => {
    var [polygon, setPolygon] = useState([])
    useEffect(() => {
        setPolygon(props.polygon)
    }, [props.polygon])

    const blueOptions = { color: 'red' }

    const icon = L.icon({
        iconSize: [10, 10],
        iconUrl: pinb
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

        props?.edited(polygon)
    }

    var canRemoveMarker = true

    return (
        <>

            <Polygon positions={polygon} pathOptions={blueOptions} />
            {
                polygon.map((position, index) => {
                    return <div key={index}
                    >

                        <Marker
                            position={bitween(position, polygon[index == polygon.length - 1 ? 0 : index + 1])}
                            icon={icon}
                            draggable={true}
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
        </>

    );
}