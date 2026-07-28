import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';

export default function OsmMap(props) {
    const center = props.center || [36.297, 59.606]; // مختصات مرکز نقشه (به عنوان مثال: مشهد)
    const zoom = props.zoom || 13; // سطح زوم اولیه
    return <MapContainer
        crs={L.CRS.EPSG4326}
        tileSize={256}
        props

    >
        <TileLayer
            // url="https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            // url="	https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            // url="https://bpms.mashhad.ir/favageoserver/gwc/service/tms/1.0.0/osm%3Aosm@EPSG:4326@png/{z}/{x}/{y}.png"
            url="https://sditile2.mashhad.ir/geoserver/gwc/service/tms/1.0.0/MashhadBaseMap1401@EPSG:4326@png/{z}/{x}/{y}.png"
            tms={true}
        // url="http://mt0.google.com/vt/lyrs=m@176103410&hl=fa-BR&x={x}&y={y}&z={z}&s=Galileo&scale=1&traffic=1"
        />

        {props?.children}
    </MapContainer>
}