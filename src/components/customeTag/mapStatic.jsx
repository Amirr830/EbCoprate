import React from 'react';
import pin from '../../assets/drawable/pin.png'
function MapStatic(props) {
    function latLngToTile(lat, lng) {
        // lng = lng - 0.001
        var zoom = 15
        // تبدیل مختصات lat و lng به شماره تایل در OpenStreetMap
        const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
        const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
        const tileUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
        console.log(tileUrl)
        return tileUrl;
    }



    return (
        <div style={{
            backgroundImage: `url(${latLngToTile(props?.lat, props?.lng)})`,
            width: '150px',
            height: '150px',
            boxShadow: '0 0 15px 20px white inset',
            borderRadius: '50px',
            backgroundSize: 'contain',
            opacity: '0.7'
        }}
            className="d-flex justify-content-center align-items-center">

            <img src={pin} style={{ width: '40px' }} />
        </div>
    );
}

export default MapStatic;