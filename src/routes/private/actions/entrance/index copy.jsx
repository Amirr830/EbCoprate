import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, Polyline, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { IoMdRefresh } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { useReactToPrint } from 'react-to-print';
import { TiDelete } from "react-icons/ti";
import Clustering from "dbscan_gps"
import { LuSmartphoneNfc } from "react-icons/lu";
import paths from '../../../../app/paths.json'
import { HiDotsVertical } from "react-icons/hi";

import endpoints from "../../../../app/endpoints";
import pin from "../../../../assets/drawable/pin.png";
import "leaflet-rotatedmarker";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import DivBlock from "../../../../components/customeTag/divBlock";
import CheckBox from "../../../../components/customeTag/checkBox";
import { dateTimeSecStr, dateTimeStr, hhmm, hhmmss, yyyymmdd } from "../../../../helper/dateHelper";
import { FaRecycle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { decode, encode } from "@googlemaps/polyline-codec";

import _ from 'lodash'
import toast from "../../../../components/toast";
import CarPlaqueBox from "../../../../modals/entrance/carPlaqueBox";
import TripHistory from "../../../../modals/entrance/tripHistory";
import SearchCar from "../../../../modals/searchCar";
import PhysicalOperations from "../../../../modals/entrance/physicalOperations";
import OnlyLargeScreen from "../../../../components/onlyLargeScreen";
import BillTripPrint from "../../../../components/BillTripPrint";
import SearchAddress from "./searchAddress";
import answerModal from "../../../../modals/answerModal";
import { isPointInPolygon } from "../../../../helper/locationHelper";
import { TbPlugConnected } from "react-icons/tb";
import { MapSettingsContext } from "../../../../contexts/initialMapSettings";
import MapTypeSelector from "../../../../components/mapTypeSelector";
import { CheckAccess } from "../../../../app/checkAccess";
import Dropdown from 'react-bootstrap/Dropdown';
import { setComma } from "../../../../helper/numberHelper";
import Input from "../../../../components/customeTag/input";


function MapController(props) {
  const map = useMap()
  var navigate = useNavigate()
  var [lockGetAddress, setLockGetAddress] = useState(false)
  var purpleOptions = { color: '#F50057', opacity: '0.9', weight: '5' }
  var originIcon = new L.Icon({
    iconUrl: require('../../../../assets/drawable/1.png'),
    iconSize: new L.Point(50, 100),
  });
  var destIcon = new L.Icon({
    iconUrl: require('../../../../assets/drawable/2.png'),
    iconSize: new L.Point(50, 100),
  });
  var [center, setCenter] = useState(map.getCenter())

  useEffect(() => {
    var event = map.addEventListener("moveend", (e) => {
      setCenter(map.getCenter())
    })

    return () => {
      map.removeEventListener("moveend", event)
    };
  }, []);

  // var [isGetAddressLock, setGetAddressLock] = useState(false)
  useEffect(() => {
    // if (!isGetAddressLock)
    if (props?.route.length == 0)
      getAddress()

  }, [center])



  var flyTo = (lat, lng) => {
    map.flyTo({ lat: lat, lng: lng }, 16)
  }

  useEffect(() => {
    try {
      // console.log('lock')
      // setGetAddressLock(true)
      flyTo(props?.flyTo?.lat, props?.flyTo?.lng)
      // setTimeout(() => {
      //   setGetAddressLock(false)
      // }, 1000)

    } catch (e) { }
  }, [props.flyTo])

  var [currentAddress, setCurrentAddress] = useState("")
  const getAddress = () => {
    var params = {
      lat: center.lat,
      lng: center.lng,
    };
    AxiosPrivate.get(endpoints.loc2add, {
      params: params,
    }).then((res) => {
      setCurrentAddress(res.data)
    })
  };

  useEffect(() => {
    if (props?.route.length > 1)
      // showMaxClusterBound(props?.route)
      flyTo(props?.params?.destLat, props?.params?.destLng)
    console.log(props?.route)
  }, [props?.route])

  var showMaxClusterBound = (dataset) => {
    var clustering = new Clustering(dataset, 5, "km", 2);
    clustering.fit(function (e, clusters) {
      if (e) {
        throw e;
      }
      for (var i = 0; i < clusters.length; i++) {
        let bounds = new L.LatLngBounds();
        for (var j = 0; j < clusters[i].length; j++) {
          bounds.extend(dataset[clusters[i][j]]);
        }
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    })
  }


  var isInside = (lat, lng, polygon) => {
    // بررسی اینکه کلیک داخل محدوده است یا نه
    const isInside = polygon.some((_, i, arr) => {
      const p1 = arr[i];
      const p2 = arr[(i + 1) % arr.length];
      return (
        ((p1[1] > lng) !== (p2[1] > lng)) &&
        lat < ((p2[0] - p1[0]) * (lng - p1[1])) / (p2[1] - p1[1]) + p1[0]
      );
    });

    if (isInside) {
      return true;
    } else {
      return false;
    }
  }

  return <>
    {props?.params?.originLat ?
      <Marker position={[props?.params?.originLat, props?.params?.originLng]} icon={originIcon}  >
        <Popup>
          مسافر سوار شده است
        </Popup>
      </Marker>
      : <></>}


    {props?.route.length == 0 ?
      <div className="position-absolute bottom-50  d-flex justify-content-center noSelect "
        style={{ zIndex: 409, left: '45%', right: '45%', height: '4rem', paddingTop: '0.3rem' }}>
        <img
          src={pin}
          style={{ height: '4rem' }} />

      </div> : <></>
    }
    {props?.route.length == 0 ?
      <DivBlock className="position-absolute bottom-0 start-0 end-0 p-3" style={{ zIndex: 409 }}>
        <div>
          <p className="card iranSansBold p-2 mb-1">{currentAddress?.address}</p>
          {/* {console.log('ssssss', currentAddress?.address)} */}
          <button className="btn btn-primary  shadow p-0 w-100 p-2 mt-0"
            onClick={() => {
              props.onChangeLocation(currentAddress)

            }} >
            تایید آدرس
          </button>
        </div>

      </DivBlock>
      : <></>
    }
    <DivBlock className="position-absolute start-0  p-2" style={{ zIndex: 409 }}>
      <div className=" d-flex">

        <button className="btn btn-light shadow p-0 "
          style={{ height: '2.5rem', width: '2.5rem' }}
          onClick={() => {
            navigate(-1)
          }} >
          <FaArrowLeft className=" text-hover aPointer  p-2" size={40} />
        </button>
      </div>
    </DivBlock>
    <DivBlock className="position-absolute end-0  p-2" style={{ zIndex: 409 }}>
      <div className=" d-flex">
        <MapTypeSelector />
      </div>
    </DivBlock>

    {props?.route.length > 0 ?
      <>
        <Polyline pathOptions={purpleOptions} positions={props?.route} />
        <Marker position={[props?.params?.destLat, props?.params?.destLng]} icon={destIcon}  >
          <Popup>
            مقصد
          </Popup>
        </Marker>
      </> : <></>
    }
  </>
}

export default function Entrance() {
  var [params, setParams] = useState({ calcPriceByRouting: true, printBill: true, advancePeyment: '50000' })
  var position = [36.31935058, 59.554662]
  var navigate = useNavigate()

  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name
    setParams({
      ...params,
      [name]: value
    })
  }

  const handleEnter = (event) => {
    if (event.key.toLowerCase() == "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  const afterMobileEnterClick = (event) => {
    if (event.key.toLowerCase() == "enter") {
      insertTrip(false)
      event.preventDefault();
    }
  };

  useEffect(() => {
    getBasicInfo();
    searchAddressRef?.current?.focus()
  }, [])

  var [carClass, setCarClass] = useState([])
  var [stations, setStations] = useState([])
  var [mapCityArea, setMapCityArea] = useState([])
  const bounds = [
    [36.127488586951756, 58.99986498984382], // South-West (lat, lng)
    [36.520957138930505, 60.53384572115833], // North-East (lat, lng)
  ];
  const getBasicInfo = () => {

    var params = {};
    AxiosPrivate.get(endpoints.pointIOBasic, {
      params: params,
    }).then((res) => {
      if (res?.data?.classList?.length > 0) {
        setParams(prevState => ({ ...prevState, classCode: res?.data?.classList[0]?.classCode }))
      }

      setCarClass(res?.data?.classList)
      setStations(res?.data?.stations)

      setMapCityArea(res?.data?.mapCityArea.map((item, index) => ([item?.lat, item?.lng])))
      if (res?.data?.stations.length > 0)
        setParams(prevState => ({
          ...prevState,
          originLat: res?.data?.stations[0]?.lat
          , originLng: res?.data?.stations[0]?.lng
          , originAddr: res?.data?.stations[0]?.stName
          , lineCode: res?.data?.stations[0]?.lineCode
          , oStCode: res?.data?.stations[0]?.stCode
        }))
    })
  };

  var [loadingCalcPrice, setLoadingCalcPrice] = useState(false)

  var [tripPrice, setTripPrice] = useState()

  var calcPrice = (params) => {


    //آدرس مقصد حتما باید وارد شود
    if (params?.destAddress == '') {
      return;
    }

    if (!params?.destAddress) {
      return;
    }


    var origin = {
      lat: params?.originLat,
      lng: params?.originLng,
      address: params?.originAddr
    }
    var dest = {
      lat: params?.destLat,
      lng: params?.destLng,
      address: params?.destAddress
    }
    var parameters = {
      stopTime: 0,
      addresses: [
        origin, dest
      ],
      phoneNumber: params?.mobile,
      custName: params?.custName,
      classCode: params?.classCode,
      lineCode: params?.lineCode,
      oStCode: params?.oStCode,
      plaque: params?.plaque,
      driverCode: params?.driverCode,
      smartCode: params?.smartCode,
      carCode: params?.carCode,
      extraLoad: params?.extraLoad,
      calcPriceByRouting: params?.calcPriceByRouting ? 1 : 0,
      distance: params?.offlineDistance,
      duration: params?.offlineDuration,
      disabledPeople: params?.disabledPeople,
      traffic: params?.offlineTraffic
    }

    console.log('ssssssssssssssssssssssssssssssss', parameters)
    setLoadingCalcPrice(true)
    AxiosPrivate.post(endpoints.calcPrice, parameters).then((res) => {
      setParams(prevState => ({
        ...prevState,
        driverCode: res?.data?.sugDrvCode,
        smartCode: res?.data?.sugSmartCode,
        carCode: res?.data?.sugCarCode,
        p2: res?.data?.p2,
        p3: res?.data?.p3,
        ph: res?.data?.ph,
        pIran: res?.data?.pIran,
        plaque: res?.data?.plaqueStr,
        drv3Code: res?.data?.drv3Code,
        trafficStr: '15 nrdri'
      }))
      setTripPrice(res.data)
      var routePath = res?.data?.route?.routePath;
      setRoute(decode(routePath, 5))
    }).finally(() => {
      setLoadingCalcPrice(false)
    })

  }

  var [frequentAddress, setFrequenAddress] = useState([])

  useEffect(() => {
    getFrequentAddress()
  }, [params?.oStCode, params?.classCode])

  var getFrequentAddress = () => {
    console.log(params)

    var parameters = {
      classCode: params?.classCode,
      lineCode: params?.lineCode,
      stCode: params?.oStCode,
    }
    AxiosPrivate.get(endpoints.pointIOFrequentAddress, { params: parameters })
      .then((res) => {
        setFrequenAddress(res.data)
      })
  }

  var insertTrip = (isWithOutDest) => {
    console.log('sssssssssssssss', tripPrice)
    var summary = ""
    try {
      summary = tripPrice?.route?.legs[0]?.summary
    } catch (e) {

    }
    var parameters = {
      tempTripCode: tripPrice?.tripTempId,
      plaque: params?.plaque,
      isWithOutDest: isWithOutDest,
      routePathStr: summary,
      carCode: params?.carCode,
      driverCode: params?.driverCode,
      smartCode: params?.smartCode,
      oStCode: params?.oStCode,
      classCode: params?.classCode,
      customerName: params?.custName,
      customerPhone: params?.mobile,
    }
    console.log(parameters)
    // return
    // setPrintTripCode(tripCode)
    setTripPrice(undefined)
    setRoute([])

    setParams({
      ...params,
      destAddress: '',
      mobile: '',
      custName: ''
    })

    // searchAddressRef?.current?.focus();
    AxiosPrivate.post(endpoints.pointIOTrip, parameters)
      .then((res) => {

        if (res.data.status) {
          console.log(params)
          setLastDriverSend(params?.drv3Code)
          setPrintTripCode(res?.data?.tripCode)
          setTripPrice(undefined)
          setParams({
            ...params,
            destAddress: '',
            mobile: '',
            custName: '',
            driverCode: '',
            p2: '',
            ph: '',
            p3: '',
            pIran: '',
            plaque: ''
          })
          setResetSearchTurn(!resetSearchTurn)
          searchAddressRef?.current?.focus();
        } else {
          if (res?.data?.statusCode == -1) {
            var newParams = {
              ...params,
              plaque: undefined,
              driverCode: undefined,
              smartCode: undefined,
              carCode: undefined,
            }
            setParams(newParams)
            calcPrice(newParams)
          }
          toast.Error(res?.data?.msg)

        }
      })
  }

  useEffect(() => {
    // اضافه کردن رویداد گوش دهنده به document
    const handleKeyDown = (event) => {
      // کد مورد نظر شما برای اجرا هنگام فشردن کلید
      if (event.ctrlKey && event.keyCode === 113) {
        event.preventDefault();
        insertTrip(false)
        return
      }
      // F2
      if (event.keyCode === 113) {
        event.preventDefault();
        setShowCarSearch(true)
        return
      }


      //F8
      if (event.keyCode === 119) {
        event.preventDefault();
        navigate(paths.private.reports.tripHistory)
        return
      }


    };

    document.addEventListener('keydown', handleKeyDown);
    // تابع پاکسازی که هنگام حذف کامپوننت اجرا می‌شود
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  var add2Queue = (carCode, smartCode, driverCode, stCode) => {
    if (stCode == undefined || stCode == '') {
      toast.Error("ایستگاه انتخاب نشده است")
      return
    }

    if (driverCode == undefined || driverCode == '') {
      toast.Error("کد راننده را وارد نمایید")
      return
    }

    AxiosPrivate.post(endpoints.pointIODriver2St,
      {
        driverCode,
        smartCode,
        carCode,
        stCode
      })
      .then((res) => {
        if (res?.data?.status == 1) {
          toast.Success(res.data.message)
        } else {
          toast.Error(res.data.message)
        }
        setRefreshTurn(!refreshTurn)
      })
  }

  var turnOverRef = useRef();
  var [route, setRoute] = useState([])

  var [lastDriverSend, setLastDriverSend] = useState('')
  var [showCarSearch, setShowCarSearch] = useState(false)
  var [flyTo, setFlyTo] = useState(undefined)
  var [refreshTurn, setRefreshTurn] = useState(true)
  var [resetSearchTurn, setResetSearchTurn] = useState(true)
  var [printTripCode, setPrintTripCode] = useState()
  var mobileRef = useRef()
  var searchAddressRef = useRef()

  useEffect(() => {
    turnOverRef.current.addEventListener("scroll", () => {
      var timeout = undefined;
      if (timeout)
        clearTimeout(timeout)
      // clearTimeout(scrollableDiv.scrollTimeout); // ریست کردن تایمر قبلی
      timeout = setTimeout(() => {
        turnOverRef.current.scrollTo({ top: 0, behavior: "smooth" }); // اسکرول نرم به بالا
      }, 5000);
      return clearTimeout(timeout)
    })
  }, [turnOverRef])




  var requestForUpdateRFID = (smartCode, stCode) => {
    answerModal.show("آیا شناسه کارت ورود تغییر یابد؟", () => {
      AxiosPrivate.put(endpoints.pointIORFID, {
        smartCode, stCode
      })
        .then(res => {
          console.log(res.data)
          toast.Success(res.data.msg)
        })
    }, () => { })
  }
  const { mapSettings } = useContext(MapSettingsContext);

  const [tileKey, setTileKey] = useState(0); // برای تغییر key و اجبار به re-render

  useEffect(() => {
    if (mapSettings?.url) {
      setTileKey((prevKey) => prevKey + 1); // تغییر key برای re-render TileLayer
    }
  }, [mapSettings?.url]);


  var [clock, setClock] = useState(dateTimeStr(new Date()))
  useEffect(() => {
    var updateTimer = () => {
      var time = new Date()
      setClock(dateTimeStr(time))
    }
    var interval = setInterval(updateTimer, 1000)

    return () => {
      // 👇️ clear timeout when the component unmounts
      clearInterval(interval)
    };
  })


  return (<OnlyLargeScreen>
    <div className="w-100 vh-100  position-relative d-flex overflow-hidden" dir="rtl">
      <div className="m-0 p-0 d-flex flex-column  col-7 vh-100">
        {/* header */}
        <div className="flex-shrink-0">
          <div className="row g-2 p-0 m-0 p-2 pt-0" style={{ background: "#CFD8DC" }}>
            <div className="d-flex justify-content-center col-12">
              <label className="opacity-75 txt-danger " >آخرین خودروی اعزام شده : </label>
              <label className="text-danger ms-auto iranSansBold px-2" >{lastDriverSend}</label>

              <label className="iranSansBold px-1 text-dark text-center position-absolute ">
                {clock}
              </label>
            </div>
            <div className="col-4 d-flex position-relative flex-grow-1">
              <select
                className="form-control text-center p-0 m-0 px-2"
                onChange={(e) => {
                  var item = stations.find(s => s.stCode == e.target.value)
                  setParams(prevState => ({
                    ...prevState,
                    originLat: item?.lat
                    , originLng: item?.lng
                    , originAddr: item?.stName
                    , lineCode: item?.lineCode
                    , oStCode: item?.stCode
                  }))
                }}

                value={params.oStCode ? params.oStCode : -1}
                defaultValue={params.oStCode}
                name="oStCode">

                {stations?.map((item, index) => {
                  return (<option
                    value={item?.stCode}
                    key={index}
                    className="text-end"
                  >
                    {item?.stCode} - {item?.stName}
                  </option>)
                })}
              </select>

              <IoIosArrowDown className="position-absolute" style={{ top: 5, left: 10 }} />

            </div>

            <div className="col-3 d-flex align-items-center flex-grow-1">


              <div className="position-relative col d-flex " >
                {carClass.length > 2 ?
                  <div className="position-relative col " >
                    <select
                      className="form-control text-center  p-0 m-0 px-2"
                      onChange={(e) => {
                        var item = carClass.find(s => s.stCode == e.target.value)
                        console.log(item)
                        var newParams = { ...params, classCode: e.target.value }
                        setParams(newParams)

                        calcPrice(newParams)
                      }}
                      value={params.classCode ? params.classCode : -1}
                      defaultValue={0}
                      name="classCode">

                      {carClass?.map((item, index) => {

                        return (<option
                          value={item?.classCode}
                          key={index}
                          className="text-end"
                        >
                          {item?.className}
                        </option>)

                      })}
                    </select>
                    <IoIosArrowDown className="position-absolute" style={{ top: 10, left: 10 }} />
                  </div>

                  : carClass?.map((item, index) => {
                    return (<button
                      value={item?.classCode}
                      key={index}
                      onClick={(e) => {
                        var newParams = { ...params, classCode: e.target.value }
                        setParams(newParams)
                        calcPrice(newParams)
                      }}
                      className={params.classCode == item?.classCode ?
                        "text-center btn btn-danger p-0 m-0 col opacity-info" :
                        "text-center btn btn-outline-secondary p-0 m-0 col opacity-50"}
                    >
                      {item?.className}
                    </button>)
                  })}


              </div>


            </div>
            <div className="col-2 flex-grow-1">
              <TripHistory
                stCode={params.oStCode}
                carClass={params?.classCode}
                lineCode={params.lineCode}
                onClose={() => {
                  setTimeout(() => {
                    searchAddressRef?.current?.focus()

                  }, 500)
                }}>
                <button className="btn btn-primary w-100 p-0 m-0 " >سفرهای رفته</button>
              </TripHistory>

            </div>

            <div className="col-2 flex-grow-1">
              <SearchCar
                lineNum={params?.lineCode}
                show={showCarSearch}
                onSelect={(person) => {
                  console.log("sssssssssss", person)

                  add2Queue(person?.carCode,
                    person?.smartCode,
                    person?.driverCode,
                    params?.oStCode)
                  searchAddressRef?.current?.focus()
                }}
                onClose={() => {
                  setShowCarSearch(false)
                  setTimeout(() => {
                    searchAddressRef?.current?.focus()

                  }, 500)
                }}
              >
                <button className="btn btn-primary w-100 p-0 m-0 " >ثبت دستی <span className="fredoka opacity-50 " style={{ fontSize: '12px' }}>(F2)</span></button>
              </SearchCar>

            </div>

            <div className="w-auto ">
              <Dropdown className='' >
                <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {CheckAccess(15) ?
                    <Dropdown.Item onClick={(e) => {
                      navigate(paths.private.reports.tripHistory)
                    }} >
                      <span className='ps-5 fredoka'>(F8)</span>گزارش سفرها
                    </Dropdown.Item> : <></>
                  }

                  <SearchCar
                    lineNum={params?.lineCode}
                    onClose={() => {
                      setShowCarSearch(false)
                      setTimeout(() => {
                        searchAddressRef?.current?.focus()

                      }, 500)
                    }}
                    onSelect={(person) => {
                      requestForUpdateRFID(person?.smartCode, params?.oStCode)
                    }}
                  >
                    <Dropdown.Item>
                      <span className='ps-5 fredoka' ></span>ثبت کارت
                    </Dropdown.Item>
                  </SearchCar>

                  <PhysicalOperations>

                    <Dropdown.Item onClick={(e) => {
                      navigate(paths.private.reports.driverLocation)

                    }} > <span className='ps-5 fredoka'></span>عملیات میدانی
                    </Dropdown.Item>
                  </PhysicalOperations>


                </Dropdown.Menu>
              </Dropdown>



            </div>

          </div>

        </div>

        {/* driver turns */}
        <div className="flex-shrink-1 flex-grow-1 a-scroll overflow-x-hidden " ref={turnOverRef}>
          <DriverTurns
            reset={resetSearchTurn}
            classCode={params?.classCode}
            stCode={params?.oStCode}
            onSelect={(driver) => {
              console.log(driver)
              var newParams = {
                ...params,
                driverCode: '',
                plaque: '',
                p2: '',
                p3: '',
                pIran: '',
                ph: '',
              }
              if (driver)
                newParams = {
                  ...params,
                  driverCode: driver?.driverCode,
                  plaque: driver?.plaque,
                  p2: driver?.p2,
                  p3: driver?.p3,
                  pIran: driver?.pIran,
                  ph: driver?.ph,
                  smartCode: driver?.smartCode,
                  carCode: driver?.carCode,
                }
              setParams(newParams)
              calcPrice(newParams)

            }}
            afterBlur={() => {
              searchAddressRef?.current?.focus()
            }} />

        </div>
        {/* footer */}
        <div className="flex-shrink-0">
          {/* فرم ورود اطلاعات */}
          <div>
            <div className="p-2">
              <form className="g-2 row mx-0 " >
                <div className="col-12 d-flex align-items-center">
                  <label className="small opacity-50 " style={{ width: '4rem' }}>منتخب : </label>
                  <div className="col" >
                    {frequentAddress.map((item, index) => {
                      return <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault()
                          setFlyTo(item)
                          var newParams = {
                            ...params,
                            destAddress: item.fullAddress,
                            destLat: item.lat,
                            destLng: item.lng,
                            offlineDistance: item.distance,
                            offlineDuration: item?.duration,
                            offlineTraffic: item?.traffic

                          }
                          setParams(newParams)
                          calcPrice(newParams)
                        }} className="btn btn-outline-danger small py-0 w-auto m-1">{item.title}</button>
                    })}
                  </div>
                </div>

                <div className="col-8 d-flex align-items-center position-relative" >
                  <label className="small opacity-50 " style={{ width: '4rem' }}>مقصد : </label>
                  <SearchAddress
                    className="col form-control  p-0 m-0 px-2 border-secondary"
                    center={{ lat: params?.originLat, lng: params?.originLng }}
                    value={params?.destAddress}
                    oStCode={params.oStCode ? params.oStCode : -1}
                    calcPriceByRouting={params?.calcPriceByRouting}
                    ref={searchAddressRef}
                    onSelectAddress={(item) => {
                      var newParams = {
                        ...params,
                        destLat: item?.lat,
                        destLng: item?.lng,
                        destAddress: (item?.address?.includes(item?.title) ? '' : item?.title) + ' ' + item?.address,
                        offlineDistance: item?.distance,
                        offlineDuration: item?.duration,
                        offlineTraffic: item?.traffic
                      }
                      setParams(newParams)
                      setFlyTo({ lat: item.lat, lng: item.lng })
                      setTripPrice(undefined)
                      setRoute([])
                      calcPrice(newParams)
                      mobileRef?.current?.focus()
                    }} />

                </div>

                <div className="col-4 d-flex align-items-center ">
                  <label className="small opacity-50 " style={{ width: '4rem' }}>همراه : </label>
                  <input type="number"
                    onChange={readChange}
                    onKeyDown={afterMobileEnterClick}
                    className="col form-control p-0 m-0 px-2 border-secondary"
                    name="mobile"
                    maxLength={15}
                    ref={mobileRef}
                    value={params?.mobile}
                    placeholder="همراه" />
                </div>

                <div className="col-4 d-flex align-items-center">
                  <label className="small opacity-50 " style={{ width: '4rem' }}>کد در خط : </label>
                  <input type="number"
                    onChange={readChange}
                    disabled
                    value={params?.driverCode}
                    name="driverCode"
                    onKeyDown={handleEnter}
                    className="col form-control  p-0 m-0 px-2 "
                    placeholder="کد در خط" />
                </div>


                <div className="col-4 d-flex align-items-center ">
                  <label className="small opacity-50 " style={{ width: '4rem' }}>شماره پلاک : </label>


                  <CarPlaqueBox onChange={(plaque) => {
                    console.log(plaque)
                    setParams(
                      prevState => ({ ...prevState, plaque: plaque.pIran + " - " + plaque.p3 + " " + plaque.pChar + " " + plaque.p2 }))
                  }}>
                    <p className=" form-control text-center col p-0 m-0 w-100 border-secondary ">
                      {(params?.plaque == '' || params?.plaque == undefined) ? '-' : params?.plaque}
                    </p>
                  </CarPlaqueBox>
                </div>

                <div className="col-4 d-flex align-items-center">
                  <label className="small opacity-50 " style={{ width: '4rem' }}>نام مهمان : </label>
                  <input type="text"
                    onChange={readChange}
                    value={params?.custName}
                    name="custName"
                    onKeyDown={handleEnter}
                    className="col form-control  p-0 m-0 px-2 border-secondary"
                    placeholder="نام مهمان" />
                </div>
                <div className="col-8 d-flex align-items-center">
                </div>
                <div className="col-4 d-flex align-items-center d-none">
                  <label className="small opacity-50 " style={{ width: '4.2rem' }}>پیش پرداخت : </label>
                  <Input
                    thousandSeparator
                    type="text"
                    className="col form-control  p-0 m-0 px-2 border-secondary"
                    placeholder="پیش پرداخت"
                    name="advancePeyment"
                    onKeyDown={handleEnter}
                    onChange={readChange}
                    value={params?.advancePeyment || ''}
                  />
                  <label className="small opacity-50 px-2" style={{ width: '2rem' }}>تومان</label>

                </div>

                <div className="mt-3"></div>

                <div className="d-flex">
                  <CheckBox className="col" title="چاپ قبض" checked={params?.printBill} onChange={(e) => {
                    setParams(prevState => ({ ...prevState, printBill: e.target.checked }))
                  }} />

                  <CheckBox
                    className="col"
                    title="محاسبه نرخ با مسیریابی" checked={params?.calcPriceByRouting} onChange={(e) => {
                      setParams(prevState => ({ ...prevState, calcPriceByRouting: e.target.checked }))
                    }}
                  />

                  <CheckBox className="col" title="اضافه بار" checked={params?.extraLoad} onChange={(e) => {
                    var newParams = { ...params, extraLoad: e.target.checked }
                    setParams(newParams)
                    calcPrice(newParams)
                  }} />
                  <CheckBox className="col" title="معلولین" checked={params?.disabledPeople} onChange={(e) => {
                    var newParams = { ...params, disabledPeople: e.target.checked }
                    setParams(newParams)
                    calcPrice(newParams)
                  }} />
                </div>




                <div className="col-12 d-flex  mt-5" >
                  <div className="col-8 align-items-center">
                    <h1 className="text-center col-12 text-danger iranSansBold" title="کرایه" >{tripPrice?.priceStr ? tripPrice?.priceStr : tripPrice?.priceDesc}</h1>
                    {tripPrice?.route?.legs?.length > 0 ?
                      <p className="p-0 m-0 text-center text-primary px-2 col-12">{tripPrice?.route?.legs[0]?.summary}</p> : <></>}

                  </div>
                  <div className="col-4">
                    <div className=" col-12 d-flex justify-content-center" >
                      <p className="p-0 m-0 text-end opacity-75 col-6" >مسافت : </p>
                      <p className="p-0 m-0 text-end text-primary px-2 iranSansBold col-6">{tripPrice?.route?.distanceStr}</p>
                    </div>
                    <div className=" col-12 d-flex justify-content-center" >
                      <p className="p-0 m-0 text-end opacity-75 col-6" >مدت زمان سفر : </p>
                      <p className="p-0 m-0 text-end text-primary px-2 iranSansBold col-6">{tripPrice?.route?.durationStr}</p>
                    </div>
                    <div className=" col-12 d-flex justify-content-center" >
                      <p className="p-0 m-0 text-end opacity-75 col-6" >ترافیک محاسبه شده : </p>
                      <p className="p-0 m-0 text-end text-primary px-2 iranSansBold col-6">{tripPrice?.route?.trafficStr}</p>
                    </div>

                  </div>

                </div>


              </form>
            </div>
            <div className="p-3 row g-2">
              {tripPrice ? <>
                <div className=" col-10 " >
                  <button className="btn btn-success w-100 " onClick={() => {
                    insertTrip(false)
                  }}>ثبت</button>
                </div>

                <div className=" col-2 " >
                  <button className="btn btn-danger w-100 " onClick={() => {
                    setTripPrice(undefined)
                    setRoute([])
                    setParams({
                      ...params,
                      destAddress: '',
                      mobile: '',
                      custName: '',
                      driverCode: '',
                      p2: '',
                      ph: '',
                      p3: '',
                      pIran: '',
                      plaque: ''
                    })
                  }}>لغو</button>
                </div>
              </> :
                (!loadingCalcPrice ?
                  <div className="row g-2">

                    <div className=" col-11">

                      <button className="btn btn-warning w-100"
                        onClick={() => {
                          insertTrip(true)
                        }}>ارسال بدون مقصد</button>
                    </div>

                    <div className="col-1">
                      <button className="btn btn-danger w-100" onClick={() => {
                        setTripPrice(undefined)
                        setRoute([])
                        setParams({
                          ...params,
                          destAddress: '',
                          mobile: '',
                          custName: '',
                          plaque: '',
                          driverCode: '',
                          extraLoad: false,
                        })
                        console.log(params)
                        searchAddressRef?.current?.focus();
                      }}><FaRecycle size={25} /></button>
                    </div>

                  </div>
                  :
                  <button className="btn btn-primary w-100 " disabled>
                    <div className="spinner-border " role="status">
                      <span className="sr-only"></span>
                    </div>
                  </button>)
              }


            </div>
          </div>
        </div>
      </div>


      <div className=" col-5" >
        <MapContainer
          className="w-100 h-100"
          zoom={12}
          center={position}

          zoomControl={false}
          attributionControl={false}
          crs={mapSettings?.crs}
          tileSize={mapSettings?.tileSize}
          maxBounds={bounds}
          maxZoom={18}
          key={tileKey} // تغییر key باعث re-render می‌شود

          // fitBounds={mashhadPolygon}
          scrollWheelZoom={true}
        >
          <TileLayer
            key={tileKey} // تغییر key باعث re-render می‌شود

            url={mapSettings?.url}
            tms={mapSettings?.tms}
          />

          {/* <Polyline pathOptions={{ color: '#2222cc', opacity: '0.4', weight: '3' }} positions={mapCityArea} /> */}

          <MapController
            params={params}
            flyTo={flyTo}
            route={route}
            onChangeLocation={(addrInfo) => {
              setTripPrice(undefined)
              setRoute([])
              var newParams = { ...params, destAddress: addrInfo.address, destLat: addrInfo.lat, destLng: addrInfo.lng }
              setParams(newParams)
              calcPrice(newParams)
            }} />

        </MapContainer>
      </div>

      <BillTripPrint
        printTripCode={printTripCode}
        setPrintTripCode={setPrintTripCode}
        printEnable={params?.printBill}
        onAfterPrint={() => {
          console.log('finished print')
          searchAddressRef?.current?.focus();
        }}
      />

    </div >

  </OnlyLargeScreen >
  );
}

function DriverTurns(props) {
  var [turns, setTurns] = useState([])
  var [driverCode, setDriverCode] = useState()
  var [driverName, setDriverName] = useState()
  var [carType, setCarType] = useState()
  var [driverCodeSelected, setSelectDriver] = useState()
  const getTurn = (pageNumber) => {

    console.log({
      classCode: props?.classCode,
      driverCode: driverCode,
      driverName: driverName,
      carType: carType,
      pageNumber: pageNumber,
      stCode: props?.stCode
    })

    AxiosPrivate.get(endpoints.pointIOTurn, {
      params: {
        classCode: props?.classCode,
        driverCode: driverCode,
        driverName: driverName,
        carType: carType,
        pageNumber: pageNumber,
        stCode: props?.stCode
      },
    }).then((res) => {
      setTurns(res.data)
    })

  };

  const removeTurn = (driverCode) => {
    AxiosPrivate.delete(endpoints.pointIOTurn, {
      data: {
        driverCode: driverCode
      },
    }).then((res) => {
      getTurn(0)
      props?.afterBlur()
    })

  };

  useEffect(() => {
    setDriverCode('')
    setDriverName('')
    setCarType('')

  }, [props?.reset])

  useEffect(() => {
    getTurn(0)
    var interval = setInterval(() => {
      getTurn(0)
    }, 5000)
    return ((e) => {
      clearInterval(interval)
    })
  }, [props?.classCode, props?.stCode, driverCode, driverName, carType, props?.reset])


  // تابعی که می‌خواهید پس از تکمیل تایپ اجرا شود
  const doSomethingAfterUserHasStoppedTyping = (inputValue) => {
    console.log(`کاربر تایپ کردن را تمام کرد: ${inputValue}`);
    // searchAddress(inputValue)
    getTurn(0)
    // اینجا کد مورد نظر خود را قرار دهید
  };

  // استفاده از debounce برای تاخیر در اجرای تابع
  const debouncedDoSomething = _.debounce(doSomethingAfterUserHasStoppedTyping, 300);

  useEffect(() => {
    if (driverCode) {
      debouncedDoSomething(driverCode);
    }
    // لغو debounce در صورت unmount شدن کامپوننت
    return () => {
      debouncedDoSomething.cancel();
    };
  }, [driverCode]); // فقط زمانی اجرا می‌شود که مقدار value تغییر کند

  return <>
    <table className="table table-striped table-hover rounded m-0 p-0 mx-2 ">
      <thead className="position-sticky top-0" >
        <tr >
          <td className="py-1 iranSansBold small" width="5%">
            <button className="btn m-0 p-1 px-2 btn-success">
              <FaSearch />
            </button>
          </td>
          <td className="py-1" width="10%">
            <input
              type="number"
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  getTurn(0)
                }
              }}
              value={driverCode}

              onChange={(e) => { setDriverCode(e.target.value) }}
              className="form-control p-0 m-0 small px-2"
              placeholder="کد در خط" />
          </td>
          <td className="py-1" width="10%">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  getTurn(0)
                }
              }}
              name="carType"
              value={carType}
              onChange={(e) => { setCarType(e.target.value) }}
              className="form-control p-0 m-0 small px-2"
              placeholder="نوع خودرو" />
          </td>
          <td className="py-1" width="20%">

            <input
              type="text"
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  getTurn(0)
                }
              }}
              value={driverName}

              name="driverName"
              onChange={(e) => { setDriverName(e.target.value) }}
              className="form-control p-0 m-0 small px-2"
              placeholder=" نام راننده" />
          </td>
          <td className="py-1" width="15%">
            پلاک
          </td>
          <td className="py-1" width="7%">
            نوع
          </td>
          <td className="py-1" width="10%">
            شیفت
          </td>
          <td className="py-1" width="10%">
            گروه
          </td>
          <td className="py-1" width="10%">
            ورود به صف
          </td>
          <td className="py-1" width="3%">
            <div className="bg-info text-center card text-dark opacity-75">
              {turns.length}

            </div>

          </td>

        </tr>
      </thead>
      <tbody>
        {turns?.map((item, index) => {
          return <tr
            key={index} className={" aPointer  " + (item?.isShift == 0 ? " table-warning " : "")
            }
            onClick={() => {
              if (item.driverCode == driverCodeSelected) {
                setSelectDriver(undefined)
                props?.onSelect(undefined)
              } else {
                setSelectDriver(item.driverCode)
                props?.onSelect(item)
              }
              props?.afterBlur()
            }}
          >
            <td className="py-0 small">
              {item?.turn}
            </td>
            <td className="py-0 small">
              {item?.drv3Code}
            </td>
            <td className="py-0 small">
              {item?.carType}
            </td>
            <td className="py-0  small">
              {item?.driverName}
            </td>
            <td className="py-0  small">
              {item?.plaque}
            </td>
            <td className="py-0  small">
              {item?.driverType}
            </td>
            <td className="py-0  small">
              {item?.shiftName}
            </td>
            <td className="py-0  small">
              {item?.groupName}
            </td>

            <td className="py-0 small" >
              {hhmmss(item?.registerTime)}
            </td>
            <td className="py-0 small" >
              <TiDelete className="aPointer text-hover" title="حذف "
                size={20}
                onClick={(e) => {
                  answerModal.show("ثبت ایستگاه حذف شود؟", () => {
                    removeTurn(item?.driverCode)
                    props?.onSelect(undefined)

                  }, () => {
                    props?.afterBlur()

                  })
                  e.stopPropagation()
                }} />
            </td>

          </tr>
        })}


      </tbody>
    </table>


  </ >
}



const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <div className='btn btn-outline-primary text-hover  justify-content-center align-items-center d-flex p-0 ' style={{ width: '1.7rem', height: '1.7rem' }}>
      <HiDotsVertical size={25}
        style={{ height: '100%' }} />
    </div>

  </a>
));

