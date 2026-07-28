import React, { createContext, useEffect, useState } from 'react';
import L from 'leaflet'
import Storages from '../app/storages';


const mapSettingsOptions = {
  OSM: {
    url: Storages.getTileServer(),
    crs: L.CRS.EPSG3857,
    tileSize: 256,
    tms: false,
  },
  MASHHAD: {
    // url: "https://sditile2.mashhad.ir/geoserver/gwc/service/tms/1.0.0/Newosm%3ANewosm@EPSG:4326@png/{z}/{x}/{y}.png",
    // url: "https://sditile2.mashhad.ir/geoserver/gwc/service/tms/1.0.0/MashhadBaseMap1401@EPSG:4326@png/1.0.0/{z}/{x}/{y}.png",
    // url: "https://sditile2.mashhad.ir/geoserver/gwc/service/tms/1.0.0/MashhadBaseMap1401@EPSG:900913@png/1.0.0/{z}/{x}/{y}.png",
    url: "https://basemap.mashhad.ir/geoserver/gwc/service/tms/1.0.0/MashhadBaseMap1401@EPSG:900913@png/{z}/{x}/{y}.png",
    crs: L.CRS.EPSG900913,
    tileSize: 256,
    tms: true,

  },
};





// ایجاد Context
export const MapSettingsContext = createContext();

// Provider Component
export const MapSettingsProvider = ({ children }) => {
  var defMap = mapSettingsOptions?.MASHHAD

  if (process.env.REACT_APP_DEF_MAP == 'OSM') {
    defMap = mapSettingsOptions?.OSM
  }


  const [mapSettings, setMapSettings] = useState(defMap);
  const changeMapSettings = (mapType) => {
    setMapSettings(mapSettingsOptions[mapType]);
  };

  useEffect(() => {
    if (Storages?.getDefaultMap())
      setMapSettings(Storages?.getDefaultMap() ? defMap : Storages?.getDefaultMap())
  }, [])

  return (<>{
    mapSettings
      ? <MapSettingsContext.Provider value={{ mapSettings, changeMapSettings }}>
        {children}
      </MapSettingsContext.Provider>
      : <></>
  }
  </>);
};