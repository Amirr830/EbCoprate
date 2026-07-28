import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polygon, Circle, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { FaArrowLeft, FaArrowUp, FaArrowDown } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { PiPolygonFill } from "react-icons/pi";
import avatar from "assets/drawable/avatar.png"
import endpoints from "app/endpoints";
import "leaflet-rotatedmarker";
import { AxiosPrivate } from "app/axiosPrivate";
import DivBlock from "components/customeTag/divBlock";
import { addDate, hhmm, hhmmss, yyyymmddhhmm } from "helper/dateHelper";
import Input from "components/customeTag/input";
import { IoCall } from "react-icons/io5";
import car_yellow from 'assets/drawable/car_yellow.png'
import car_red from 'assets/drawable/car_red.png'
import car_green from 'assets/drawable/car_green.png'
import car_blue from 'assets/drawable/car_blue.png'
import point_red from 'assets/drawable/next-arrow.png'
import point from 'assets/drawable/point.png'
import start_Point from 'assets/drawable/0.png'
import end_Point from 'assets/drawable/1.png'
import CheckBox from "components/customeTag/checkBox"
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaRoute, FaEye, FaEyeSlash } from "react-icons/fa";
import "react-multi-date-picker/styles/layouts/mobile.css"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { MdDateRange } from "react-icons/md";
import Clustering from "dbscan_gps"
import TripInfo from "modals/TripInfo";
import Storages from "app/storages";
import CitiesDropDown from "components/dropdowns/CitiesDropDown";
import Select from 'react-select';
import { LuMinimize2, LuMaximize2 } from "react-icons/lu";
import { MapSettingsContext } from "contexts/initialMapSettings";
import MapTypeSelector from "components/mapTypeSelector";



const carYellow = new L.Icon({
  iconUrl: car_yellow,
  iconSize: new L.Point(20, 40)
});
const carBlue = new L.Icon({
  iconUrl: car_blue,
  iconSize: new L.Point(20, 40)
});
const carGreen = new L.Icon({
  iconUrl: car_green,
  iconSize: new L.Point(20, 40)
});
const carRed = new L.Icon({
  iconUrl: car_red,
  iconSize: new L.Point(20, 40)
});
const pointIcon = new L.Icon({
  iconUrl: point_red,
  iconSize: new L.Point(15, 15)
});
const pointBlack = new L.Icon({
  iconUrl: point,
  iconSize: new L.Point(10, 10)
});
const startPoint = new L.Icon({
  iconUrl: start_Point,
  iconSize: new L.Point(50, 100)
});
const endPoint = new L.Icon({
  iconUrl: end_Point,
  iconSize: new L.Point(50, 100)
});

const stIcon = (stCode) => {
  return L.divIcon({
    className: "bg-dark text-white rounded text-center iranSansBold ",
    iconSize: [30, 20],
    iconAnchor: [15, 10],
    html: `<span class="icon-text" style="font-size: 14px;">${stCode}</span>`
  })
}

const driverCodeIcon = (code) => {
  return L.divIcon({
    className: "bg-primary text-white rounded text-center iranSansBold ",
    iconSize: [30, 20],
    iconAnchor: [30, 30],
    html: `<span class="icon-text" style="font-size: 14px;">${code}</span>`
  })
}


const driverFakeBadge = () => {
  return L.divIcon({
    className: "bg-danger text-white rounded text-center iranSansBold ",
    iconSize: [30, 20],
    iconAnchor: [-15, -15],
    html: `<span class="icon-text" style="font-size: 14px;">اظهاری</span>`
  })
}


function MapController(props) {
  const map = useMap()
  var navigate = useNavigate()
  var [driversLocation, setDriversLocation] = useState([])
  var [pageMode, setPageMode] = useState()
  var [stType, setStType] = useState(true)
  var [showPopupOnHover, setShowPopupOnHover] = useState(true)
  var [stations, setStations] = useState([])


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
    map.flyTo({ lat: lat, lng: lng }, 14, { animate: false })
  }


  useEffect(() => {
    getStations()
    setPageMode(1)
  }, [])



  useEffect(() => {
    if (pageMode == 2) {
      setDriversLocation([])
      setFilter(undefined)
      // getDriverRoute()
    }
    if (pageMode == 1) {
      // getDriversLocation()
      setDriverPath([])
      setNormalizedDriverPath([])

    }
  }, [pageMode])


  var [watingLoadDrvLocations, setWatingLoadDrvLocations] = useState(false)


  var [refreshTime, setRefreshTime] = useState(30);
  var getDriversLocation = (driverFilter, changeCamera) => {
    if (changeCamera)
      setWatingLoadDrvLocations(true)
    if (driverFilter.driverCode > 0) {
      driverFilter = { ...driverFilter, active: 1, inActive: 1, inTrip: 1, inLine: 1 }
    }
    driverMarker?.current?.closePopup()

    AxiosPrivate.get(endpoints.rDriverLocation,
      {
        params: driverFilter,
        timeout: 120000
      }).then((res) => {
        setDriversLocation(res.data)
        var dataset = res?.data?.map(item => [item.lat, item.lng])

        if (changeCamera)
          if (res?.data?.length == 1) {
            flyTo(res?.data[0].lat, res.data[0].lng)
          }
          else
            showMaxClusterBound(dataset)
      }).finally(() => {
        setWatingLoadDrvLocations(false)
      })
  }

  useEffect(() => {
    if (driversLocation.length == 1) {
      driverMarker?.current?.openPopup()
    }
  }, [driversLocation])

  useEffect(() => {
    if (props?.minimal) {
      setFilter({ active: 1, inActive: 0, inTrip: 0, inLine: 1 })
      getDriversLocation({ active: 1, inActive: 0, inTrip: 0, inLine: 1 }, true)
    }

    map.addEventListener("zoomend", handleZoomEnd)
    return () => {
      map.off('zoomend', handleZoomEnd);
    };

  }, [])

  var [zoomLevel, setZoomLevel] = useState(0)
  var handleZoomEnd = (e) => {
    console.log('ssasgfasdg', e.target.getZoom())
    setZoomLevel(e.target.getZoom())

  }

  var showMaxClusterBound = (dataset) => {
    var clustering = new Clustering(dataset, 5, "km", 2);
    clustering.fit(function (e, clusters) {
      if (e) {
        throw e;
      }
      for (var i = 0; i < clusters.length; i++) {
        let bounds = new L.LatLngBounds();
        console.log(clusters[i])
        for (var j = 0; j < clusters[i].length; j++) {
          bounds.extend(dataset[clusters[i][j]]);
        }
        map.fitBounds(bounds)
      }
    })
  }

  var [driverPath, setDriverPath] = useState([])
  var [nomalizedDriverPath, setNormalizedDriverPath] = useState([])
  var [waitingGetRoute, setWaitingGetRoute] = useState(false)
  var getDriverRoute = (driverFilter) => {
    setWaitingGetRoute(true)
    AxiosPrivate.get(endpoints.rDriverRoute,
      {
        params: driverFilter,
        timeout: 45000

      }).then((res) => {
        setDriverPath(res.data)
        var dataset = res?.data?.map((location) => [location.lat, location.lng])
        setNormalizedDriverPath(dataset)
        let bounds = new L.LatLngBounds();
        res?.data?.forEach((marker) => {
          bounds.extend([marker.lat, marker.lng]);
        });
        map.fitBounds(bounds)
      })
      .finally(() => {
        setWaitingGetRoute(false)
      })
  }

  var getStations = () => {
    // setLoading(true)
    AxiosPrivate.get(endpoints.stations, {
      params: undefined, timeout: 45000
    }).then(res => {
      setStations(res.data)
      // setLoading(false)
    })
  }

  var [showDriverCode, setShowDriverCode] = useState(false)
  var [showStationArea, setShowStationArea] = useState(false)
  var [showStation, setShowStation] = useState(true)
  var [filter, setFilter] = useState(undefined)
  useEffect(() => {
    var r = refreshTime * 1000
    if (r < 15)
      r = 15000
    const interval = setInterval((e) => {
      if (!filter)
        return
      getDriversLocation(filter, false)
    }, r)
    return () => {
      clearInterval(interval);
    };
  }, [filter, refreshTime])

  var [closeMode, setCloseMode] = useState(props?.minimal)

  var driverMarker = useRef()

  return <>
    <div dir="rtl">

      <DivBlock className="position-absolute start-0  p-2 d-flex align-items-center" style={{ zIndex: 409 }}>
        <div className="p-2">

          <CitiesDropDown value={0} onChange={(city) => {
            console.log(city)
            flyTo(city.centerLat, city.centerLng, 12)
          }} />

        </div>

        <MapTypeSelector />

        <button className="btn btn-light shadow p-0 me-2"
          onClick={() => {
            props?.minimal
              ? props?.onClose()
              : navigate(-1)
          }} >
          <FaArrowLeft className=" text-hover aPointer  p-2" size={40} />
        </button>


      </DivBlock>

      {/* <DivBlock className="position-absolute start-0  bottom-0 p-2 d-flex align-items-center" style={{ zIndex: 409 }}>
        <div className=" d-flex">
          <MapTypeSelector />
        </div>

      </DivBlock> */}

      {/* جستجو */}
      <DivBlock className="position-absolute end-0 top-0 p-2 d-flex align-items-center me-1  " style={{ zIndex: 409, maxWidth: "30rem" }}>

        <div className="">

          <div className="w-100 d-flex flex-column bg-light rounded shadow">

            {
              closeMode ?

                <button className="btn btn-light shadow p-0 p-2"
                  onClick={() => {
                    setCloseMode(!closeMode)
                  }} >
                  باز  شود <LuMaximize2 className=" text-hover aPointer" size={15} />
                </button>
                :
                <>
                  <div>
                    <div className="d-flex w-100 p-0 m-0 ">
                      <button
                        className={(pageMode == 2 ? "btn btn-light" : "btn btn-outline-primary disabled  text-primary") + " m-0 p-0 col"}
                        title="جستجو راننده"
                        onClick={() => {
                          setPageMode(1)
                        }} >
                        جستجو راننده <FaSearch className="aPointer p-2" size={40} />
                      </button>

                      <button
                        className={(pageMode == 1 ? "btn btn-light " : "btn btn-outline-primary disabled  text-primary") + " m-0 p-0 col"}
                        title="جستجو مسیر طی شده"
                        onClick={() => {
                          setPageMode(2)
                        }} >
                        نمایش مسیر سفر<FaRoute className="aPointer p-2" size={40} />
                      </button>

                    </div>

                    {
                      pageMode == 1 ? <SearchDriver

                        loading={watingLoadDrvLocations}
                        dataSet={driversLocation}
                        onSearch={(f) => {
                          setFilter(f)
                          getDriversLocation(f, true)
                        }} /> :
                        <SearchPath
                          loading={waitingGetRoute}

                          onSearch={(f) => {
                            getDriverRoute(f)
                            // getDriversLocation({
                            //   active: 1,
                            //   inActive: 1,
                            //   inTrip: 1,
                            //   inLine: 1,
                            //   driverCode: filter?.driverCode
                            // })
                          }}
                        />
                    }

                    <hr />
                    <div className="row p-3 ">

                      <div className="col-6 ">
                        <button
                          className={(showDriverCode ? "btn btn-primary" : "btn btn-outline-primary") + " m-0 p-0"}
                          onClick={() => {
                            setShowDriverCode(!showDriverCode)
                          }} >
                          {showDriverCode
                            ? <FaEye className="aPointer p-2" size={40} />
                            : <FaEyeSlash className="aPointer p-2" size={40} />
                          }
                        </button>
                        <label className="iranSansBold px-2" style={{ width: "5rem" }}>کد خودرو</label>

                      </div>

                      <div className="mt-2 col-6">
                        <button
                          className={(showStation ? "btn btn-primary" : "btn btn-outline-primary") + " m-0 p-0"}
                          onClick={() => {
                            setShowStation(!showStation)
                          }} >
                          {showStation
                            ? <FaEye className="aPointer p-2" size={40} />
                            : <FaEyeSlash className="aPointer p-2" size={40} />
                          }
                        </button>
                        <label className="iranSansBold px-2 " style={{ width: "5rem" }}>ایستگاه ها</label>

                      </div>

                      <div className="mt-2 col-6">
                        <button
                          className={(showStationArea ? "btn btn-primary" : "btn btn-outline-primary") + " m-0 p-0"}
                          onClick={() => {
                            setShowStationArea(!showStationArea)
                          }} >
                          {showStationArea
                            ? <FaEye className="aPointer p-2" size={40} />
                            : <FaEyeSlash className="aPointer p-2" size={40} />
                          }
                        </button>
                        <label className="iranSansBold px-2" style={{ width: "5rem" }}>محدوده ها</label>


                      </div>

                      <div className="mt-2 col-6">
                        <button
                          className={"btn btn-outline-primary m-0 p-0"}
                          onClick={() => {
                            setStType(!stType)
                          }} >
                          {stType
                            ? <FaRegCircle className="aPointer p-2" size={40} />
                            : <PiPolygonFill className="aPointer p-2" size={40} />
                          }
                        </button>
                        <label className="iranSansBold px-2">حالت ایستگاه</label>

                      </div>

                      <div className="mt-2 col-6">
                        <input
                          className={"btn btn-outline-primary m-0 p-0"}
                          style={{ width: '2.7rem', height: '2.7rem' }}
                          value={refreshTime}
                          type="number"
                          onChange={(e) => {
                            setRefreshTime(e.target.value)

                          }}
                        />

                        <label className="iranSansBold px-2">به روز رسانی</label>

                      </div>
                      <div className="col-6 mt-2 ">
                        <button
                          className={(showPopupOnHover ? "btn btn-primary" : "btn btn-outline-primary") + " m-0 p-0"}
                          onClick={() => {
                            setShowPopupOnHover(!showPopupOnHover)
                          }} >
                          {showPopupOnHover
                            ? <FaEye className="aPointer p-2" size={40} />
                            : <FaEyeSlash className="aPointer p-2" size={40} />
                          }
                        </button>
                        <label className="iranSansBold px-2" style={{ width: "5rem" }}>نمایش شناور</label>

                      </div>
                    </div>


                  </div>
                  <button className="btn btn-light shadow p-0"
                    onClick={() => {
                      setCloseMode(!closeMode)
                    }} >
                    بسته شود <LuMinimize2 className=" text-hover aPointer" size={15} />
                  </button>
                </>
            }
          </div>

        </div>



      </DivBlock>


      {
        driversLocation.map((car, index) => {
          return <div key={index} >
            <Marker position={[car?.lat, car?.lng]}
              rotationAngle={car.bearing}
              ref={driverMarker}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openTooltip()
                },
                mouseout: (e) => {
                  e.target.closeTooltip()
                },
                click: (e) => {
                  console.log(car)
                  flyTo(car.lat, car.lng)
                  // setStationLocation(e.target.getLatLng())
                  // props.onLocationStation(e.target.getLatLng())
                }
              }}
              rotationOrigin="center"
              icon={
                car?.status == 0 ? carRed :
                  car?.status == 1 ? carGreen :
                    car?.status == 2 ? carBlue :
                      carYellow
              }>
              <Popup>
                <DriverInfo car={car} />
              </Popup>
              {
                showPopupOnHover ?
                  <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                    <DriverInfo car={car} />
                  </Tooltip> : <></>
              }

            </Marker>
            {
              showDriverCode ?
                <Marker position={[car?.lat, car?.lng]}
                  icon={driverCodeIcon(car.driverCode)}>
                </Marker> : <></>
            }

            {
              !car?.isOrginal ?
                <Marker position={[car?.lat, car?.lng]}
                  icon={driverFakeBadge()}>
                </Marker> : <></>
            }
          </div>
        })
      }

      {
        stations?.map((item, index) => {
          return <div key={index} style={{ zIndex: 10000 }}>

            {

              (filter?.stCode == '' || !filter?.stCode || filter?.stCode == item.stCode)
                ? <>
                  {
                    showStationArea ?
                      stType ?
                        item?.radius ?
                          item?.lat ?
                            <Circle
                              center={{ lat: item?.lat, lng: item?.lng }}
                              fillColor="blue"
                              pathOptions={{ fillOpacity: 0.1, opacity: 0.2 }}

                              radius={item?.radius} >
                              <Popup>
                                {item.stCode + ' ' + item.stName}
                              </Popup>
                            </Circle>
                            : <></>
                          : <></>
                        :
                        <Polygon
                          positions={item?.polygonStation}
                          pathOptions={{ color: 'blue' }}
                          eventHandlers={{
                            click: () => {

                              // setAllowCreatePolygon(true)
                            }
                          }}
                        >
                          <Popup>
                            {item.stCode + ' ' + item.stName}
                          </Popup>
                        </Polygon>
                      : <></>
                  }
                  {showStation ?
                    <Marker position={[item?.lat, item?.lng]}
                      icon={stIcon(item.stCode)}
                      eventHandlers={{
                        dragend: (e) => {
                          // console.log(e.target.getLatLng())
                          // setStationLocation(e.target.getLatLng())
                          // props.onLocationStation(e.target.getLatLng())
                        }
                      }} >

                    </Marker>
                    : <></>}
                </>
                : <></>
            }
          </div>
        })
      }

      {
        driverPath.length > 0 ?
          <>
            < Marker position={[driverPath[0]?.lat, driverPath[0]?.lng]}
              icon={endPoint}>
              <Popup>
                {yyyymmddhhmm(driverPath[0].saveTime)}
              </Popup>
            </Marker>
            < Marker position={[driverPath[driverPath.length - 1]?.lat, driverPath[driverPath.length - 1]?.lng]}
              icon={startPoint}>
              <Popup>
                {yyyymmddhhmm(driverPath[driverPath.length - 1].saveTime)}
              </Popup>
            </Marker>
          </>

          : <></>
      }

      {

        driverPath.map((location, index) => {
          return <div key={index}>
            <Marker position={[location?.lat, location?.lng]}
              rotationAngle={location.bearing + 90}
              opacity={zoomLevel < 16 ? 0 : 1}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup()
                },
                mouseout: (e) => {
                  e.target.closePopup()
                },
              }}
              icon={(index % 2 == 0) ? pointIcon : pointBlack}>
              <Popup>
                {yyyymmddhhmm(location.saveTime)}
              </Popup>
            </Marker>
          </div>
        })
      }

      <Polyline
        positions={nomalizedDriverPath}
        pathOptions={{ color: '#00afff', weight: '6' }}
        smoothFactor={0.2}
        eventHandlers={{
          click: () => {
            // setAllowCreatePolygon(true)
          }
        }}
      >
      </Polyline>
    </div >

  </>
}


export default function DriversLocation({ minimal, onClose }) {

  var position = [Storages.getCities()[0].centerLat, Storages.getCities()[0].centerLng]
  const { mapSettings } = useContext(MapSettingsContext);

  return (
    <div className="d-flex ">


      <div className="col-12">
        <MapContainer
          className="w-100 vh-100"
          zoom={12}
          crs={mapSettings?.crs}
          tileSize={mapSettings?.tileSize}
          center={position}
          zoomControl={false}
          key={mapSettings.url}
          scrollWheelZoom={true}>
          <TileLayer
            url={mapSettings?.url}
            tms={mapSettings?.tms}
          />
          <MapController minimal={minimal} onClose={onClose} />

        </MapContainer>

      </div >

    </div>

  );
}




function SearchDriver(props) {

  var [driverFilter, setDriverFilter] = useState({
    active: 1,
    inActive: 1,
    inTrip: 1,
    inLine: 1
  })

  var onCheckChange = (e) => {
    var checked = e.target.checked
    var name = e.target.name
    setDriverFilter({
      ...driverFilter,
      [name]: checked ? 1 : 0
    })
  }
  var handleDriverFilterChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    setDriverFilter({
      ...driverFilter,
      [name]: value
    })
  }

  var [greenCount, setGreenCount] = useState(0)
  var [redCount, setRedCount] = useState(0)
  var [yellowCount, setYellowCount] = useState(0)
  var [blueCount, setBlueCount] = useState(0)
  useEffect(() => {
    setGreenCount(props?.dataSet?.filter(item => item.status == 1)?.length)
    setRedCount(props?.dataSet?.filter(item => item.status == 0)?.length)
    setYellowCount(props?.dataSet?.filter(item => item.status == 3)?.length)
    setBlueCount(props?.dataSet?.filter(item => item.status == 2)?.length)
  }, [props?.dataSet])
  return <div className="w-100 ">

    <div className=" p-0 row m-0  p-3 " >
      <div className="row p-0 m-0">

        <div className="row p-0 m-0  ">
          <div className="m-0 p-0 col">
            <label className="m-0 p-0" >کد تاکسی : </label>
            <Input
              className="form-control"
              placeholder="کد تاکسی"
              type="number"
              name="driverCode"
              onChange={handleDriverFilterChange}
              onKeyDown={(event) => {
                if (event.key.toLowerCase() === "enter") {
                  props.onSearch(driverFilter)
                }
              }}
            />
          </div>
          <div className="w-auto m-0 p-0 opacity-0">
            ...
          </div>
          <div className="m-0 p-0 col">
            <label className="m-0 p-0" >کد ایستگاه : </label>
            <Input
              className="form-control"
              placeholder="کد ایستگاه"
              type="number"
              name="stCode"
              onChange={handleDriverFilterChange}
              onKeyDown={(event) => {
                if (event.key.toLowerCase() === "enter") {
                  props.onSearch(driverFilter)
                }
              }}
            />
          </div>

        </div>
        <div className="row p-0 m-0 mt-2">
          {/* بخش پک باکس ها */}
          <CheckBox className="col-6 h6" name="active" checked={driverFilter?.active} onChange={onCheckChange} title={<> <img className="ms-3 me-1" src={car_green} style={{ width: "0.8rem", transform: "rotate(90deg)" }} />فعال ({greenCount})</>} />
          <CheckBox className="col-6 h6" name="inActive" checked={driverFilter?.inActive} onChange={onCheckChange} title={<> <img className="ms-3 me-1" src={car_red} style={{ width: "0.8rem", transform: "rotate(90deg)" }} />غیر فعال ({redCount})</>} />
          <CheckBox className="col-6 h6" name="inTrip" checked={driverFilter?.inTrip} onChange={onCheckChange} title={<> <img className="ms-3 me-1" src={car_yellow} style={{ width: "0.8rem", transform: "rotate(90deg)" }} />درحال سفر ({yellowCount})</>} />
          <CheckBox className="col-6 h6" name="inLine" checked={driverFilter?.inLine} onChange={onCheckChange} title={<> <img className="ms-3 me-1" src={car_blue} style={{ width: "0.8rem", transform: "rotate(90deg)" }} />ثبت ایستگاه ({blueCount})</>} />
        </div>
        {
          props?.loading ?
            <div className='justify-content-center d-flex ' >
              <div className="spinner-border" role="status" />
            </div> :
            <button className="btn btn-primary mt-2 col-12 " onClick={(e) => {
              props.onSearch(driverFilter)
            }}>جستجو</button>
        }
      </div>

    </div>



  </div>
}

function SearchPath(props) {

  var [routeFilter, setRouteFilter] = useState({
    startTime: addDate(new Date(), -1 * 60 * 60 * 1000),
    endTime: new Date(),

  })


  var handleOnChange = (e) => {
    var value = e.target.value
    var name = e.target.name
    setRouteFilter({
      ...routeFilter,
      [name]: value
    })
  }
  return <div className="w-100">

    <div className=" p-3  row " >
      <div className="row p-0 m-0 ">
        <div className="col-12 d-flex justify-content-center  align-items-center">
          <h5 className="m-0 p-0 col-3 " >کد تاکسی : <span className="text-danger">*</span></h5>
          <div className="col-9">
            <Input
              className="form-control "
              onKeyDown={(event) => {
                if (event.key.toLowerCase() === "enter") {
                  props.onSearch(routeFilter)
                }
              }}


              type="number"
              name="driverCode"
              onChange={handleOnChange}
            />
          </div>

        </div>

        <div className="col-12 d-flex justify-content-center  align-items-center mt-2 ">
          <h5 className="m-0 p-0 col-3 " >شروع از : <span className="text-danger">*</span> </h5>
          <div className="col-9 p-1 position-relative card">
            <DatePicker
              format="از dddd DD MMMM YYYY ساعت HH:mm"
              className="rmdp-mobile"
              render={(value, openCalendar) => {
                return <div className=" aPointer " onClick={openCalendar}>
                  <div className="d-flex p-2">
                    <MdDateRange size="18" />
                    <span className="iranSansBold noSelect me-3">{value}</span>
                  </div>
                </div>
              }}
              plugins={[
                <TimePicker position="bottom"
                  hideSeconds
                />
              ]}
              onChange={(date) => {
                console.log(date)
                if (date)
                  setRouteFilter({
                    ...routeFilter,
                    startTime: new Date(date.unix * 1000)
                  })
              }}
              value={routeFilter?.startTime || ''}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-left"
            />
          </div>

        </div>
        <div className="col-12 d-flex justify-content-center  align-items-center mt-2">
          <h5 className="m-0 p-0 col-3 " >خاتمه تا : <span className="text-danger">*</span></h5>
          <div className="col-9 p-1 position-relative card">
            <DatePicker
              format="از dddd DD MMMM YYYY ساعت HH:mm"
              className="rmdp-mobile"
              render={(value, openCalendar) => {
                return <div className=" aPointer " onClick={openCalendar}>
                  <div className="d-flex p-2">
                    <MdDateRange size="18" />
                    <span className="iranSansBold noSelect me-3">{value}</span>
                  </div>
                </div>
              }}
              plugins={[
                <TimePicker position="bottom"
                  hideSeconds
                />
              ]}
              onChange={(date) => {
                console.log(date)
                if (date)
                  setRouteFilter({
                    ...routeFilter,
                    endTime: new Date(date.unix * 1000)
                  })
              }}
              value={routeFilter?.endTime || ''}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-left"
            />
          </div>


        </div>
        <div className="col-12 d-flex justify-content-center  align-items-center mt-2">
          <h5 className="m-0 p-0 col-3 " >کد سفر : </h5>
          <div className="col-9">
            <Input
              className="form-control "
              type="number"
              name="tripCode"
              onChange={handleOnChange}
            />
          </div>

        </div>
        <div className="col-12 d-flex justify-content-center  align-items-center mt-3">
          {
            props?.loading ?
              <div className='justify-content-center d-flex ' >
                <div className="spinner-border" role="status" />
              </div> :
              <button className="btn btn-primary mt-2 col-12 " onClick={(e) => {
                props.onSearch(routeFilter)
              }}>جستجو</button>
          }

        </div>
      </div>

    </div>



  </div>
}



function DriverInfo({ car }) {
  return <div className="row justify-content-center align-items-center " dir="rtl" style={{}}>

    <div className="p-2">
      <div className="d-flex align-items-center">

        <div className="d-flex flex-column align-items-center">
          <img src={avatar} className="mb-auto" style={{ width: "4rem" }} />
          <h6 className="text-end iranSansBold" title="کد راننده">{car.driverCode}
          </h6>
        </div>
        <div className="me-3 d-flex flex-column align-items-start">
          <h6 className=" iranSansBold text-end">
            {car?.driverName}
          </h6>
          <h6 className="p-0 m-0 noSelect text-end" title="مشخصات">{car?.carType} {car?.driverPlaque}</h6>
          <div className="d-flex flex-row mt-2">

            <button className="btn btn-outline-success " onClick={() => {
              window.location.href = `tel:${car?.driverMobile}`;
            }}>
              <div className="d-flex justify-content-center align-items-center ">
                <h6 className="text-center p-0 m-0">
                  {car?.driverMobile}
                </h6>
                <IoCall size={20} className="me-2 " />
              </div>
            </button>

            {car.tripCode > 0 ? <TripInfo trip={null}>
              <button className="btn btn-outline-primary " >جزییات سفر</button>
            </TripInfo> : <></>}

          </div>

        </div>



      </div>
      <hr />
      <h6 className="p-0 m-0 noSelect text-center" title="زمان آخرین موقعیت">   {yyyymmddhhmm(car?.saveTime)}</h6>

    </div>



  </div>
}