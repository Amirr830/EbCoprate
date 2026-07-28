import { cloneElement, useEffect, useRef } from "react"
import L from 'leaflet'
export default function DivBlock(props) {
    var divRef = useRef()
    useEffect(() => {
        L.DomEvent.disableClickPropagation(divRef.current)
    }, [divRef])
    var div = cloneElement(<div ref={divRef}>{props?.children}</div>, props)
    return div;
}