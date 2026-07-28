import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { useNavigate } from "react-router-dom";
import mashhadLogo from '../../../assets/drawable/mashhad_taxi_logo.png'
import { useReactToPrint } from 'react-to-print';

import endpoints from "../../../app/endpoints";
import pin from "../../../assets/drawable/pin.png";
import "leaflet-rotatedmarker";
import { AxiosPrivate } from "../../../app/axiosPrivate";
import DivBlock from "../../../components/customeTag/divBlock";
import _ from 'lodash'
import toast from "../../../components/toast";
import MoreInfoKiosk from "../../../modals/kiosk/moreInfoKiosk";
import loaderModal from "../../../modals/loaderModal";
import BillKisok from "../../../modals/kiosk/billKiosk";
import successModal from "../../../modals/successModal";
import BillTripPrint from "../../../components/BillTripPrint";
import SearchAddress from "./entrance/searchAddress";
import { isPointInPolygon } from "../../../helper/locationHelper";
import { MapSettingsContext } from "../../../contexts/initialMapSettings";

function MapController(props) {
  const map = useMap()

  var [frequentAddress, setFrequenAddress] = useState([])
  var [currentAddress, setCurrentAddress] = useState("")

  var getFrequentAddress = () => {
    var parameters = {
      // classCode: 4,
      // lineCode: 1,
      stCode: props?.params?.oStCode,
    }
    AxiosPrivate.get(endpoints.pointIOFrequentAddress, { params: parameters })
      .then((res) => {
        setFrequenAddress(res.data)
      })
  }


  var originIcon = new L.Icon({
    iconUrl: require('../../../assets/drawable/1.png'),
    iconSize: new L.Point(50, 100),
  });

  var [center, setCenter] = useState(map.getCenter())

  useEffect(() => {
    getFrequentAddress()

    var event = map.addEventListener("moveend", (e) => {
      setCenter(map.getCenter())
    })

    return () => {
      map.removeEventListener("moveend", event)
    };
  }, []);

  useEffect(() => {
    getAddress()
  }, [center])

  var flyTo = (lat, lng) => {
    map.flyTo({ lat: lat, lng: lng }, 16)
  }

  useEffect(() => {
    try {
      flyTo(props?.flyTo?.lat, props?.flyTo?.lng)
    } catch (e) { }
  }, [props.flyTo])


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

  return <>
    <DivBlock className="position-absolute start-0 end-0 p-2" style={{ zIndex: 409 }}>
      <div className=" d-flex">
        <div className=" w-100">
          <SearchAddress
            className="form-control shadow "
            center={{ lat: props?.params?.originLat, lng: props?.params?.originLng }}
            calcPriceByRouting={1}
            onSelectAddress={(item) => {
              flyTo(item.lat, item.lng)
            }} />

        </div>
        <div className="m-1" />


      </div>

    </DivBlock>

    {props?.params?.originLat ?
      <Marker position={[props?.params?.originLat, props?.params?.originLng]} icon={originIcon}  >

      </Marker>
      : <></>}
    <div className="position-absolute bottom-50  d-flex justify-content-center noSelect "
      style={{ zIndex: 409, left: '45%', right: '45%', height: '4rem', paddingTop: '0.3rem' }}>
      <img
        src={pin}
        style={{ height: '4rem' }} />

    </div>
    <DivBlock className="position-absolute bottom-0 start-0 end-0 p-3" style={{ zIndex: 409 }}>
      <div>

        <div>
          <div className="col-12 d-flex align-items-center">
            <div className="col" >
              {frequentAddress.map((item, index) => {
                return <button
                  key={index}
                  onClick={(e) => {
                    flyTo(item.lat, item.lng)
                    // setParams(prevState => ({
                    //   ...prevState, destAddress: item.address, destLat: item.lat, destLng: item.lng
                    // }))
                  }} className="btn btn-dark  small py-0 w-auto m-1">{item.title}</button>
              })}
            </div>
          </div>
          <p className="card iranSansBold p-2 mb-1">{currentAddress?.address}</p>
        </div>
        <MoreInfoKiosk
          carClass={props?.carClass}
          onOpen={(closer) => {
            if (!isPointInPolygon([currentAddress?.lat, currentAddress?.lng], props?.mapCityArea)) {
              toast.Error("موقعیت مقصد تحت پوشش نیست")
              flyTo(props?.params?.originLat, props?.params?.originLng)
              closer()
              return
            }
          }}
          onClose={(params) => {
            props?.onComplete({ ...currentAddress, ...params })
          }}>
          <button className="btn btn-primary  shadow p-0 w-100 p-2 mt-0">
            تایید مقصد
          </button>
        </MoreInfoKiosk>
      </div>

    </DivBlock>



  </>
}

export default function Kiosk() {
  var [params, setParams] = useState({})
  var position = [36.31935058, 59.554662]

  useEffect(() => {
    getBasicInfo();
  }, [])

  var [carClass, setCarClass] = useState([])
  var [stations, setStations] = useState([])

  const getBasicInfo = () => {

    var params = {};
    AxiosPrivate.get(endpoints.pointIOBasic, {
      params: params,
    }).then((res) => {
      console.log(res.data)
      if (res?.data?.classList?.length > 0) {
        setParams(prevState => ({ ...prevState, classCode: res?.data?.classList[0]?.classCode }))
      }
      setCarClass(res?.data?.classList)
      setStations(res?.data?.stations)
      if (res?.data?.stations.length > 0)
        setParams(prevState => ({
          ...prevState,
          originLat: res?.data?.stations[0]?.lat
          , originLng: res?.data?.stations[0]?.lng
          , originAddr: res?.data?.stations[0]?.stName
          , lineCode: res?.data?.stations[0]?.lineCode
          , oStCode: res?.data?.stations[0]?.stCode
        }))
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

  var [showBillModal, setShowBillModal] = useState(false)
  var [mapCityArea, setMapCityArea] = useState([])
  var [flyTo, setFlyTo] = useState(undefined)

  var [tripPrice, setTripPrice] = useState()
  var calcPrice = (params) => {
    // if (params?.phoneNumber == '') {
    //   toast.Error("همراه را وارد نمایید")
    //   return;
    // }
    // if (params?.custName == '') {
    //   toast.Error("نام را وارد نمایید")
    //   return;
    // }

    if (!isPointInPolygon([params?.destLat, params?.destLng], mapCityArea)) {
      toast.Error("موقعیت مقصد تحت پوشش نیست")
      setFlyTo(position)
      return
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
      phoneNumber: params?.phoneNumber,
      custName: params?.custName,
      classCode: params?.classCode,
      lineCode: params?.lineCode,
      oStCode: params?.oStCode,
      extraLoad: 0,
      calcPriceByRouting: 1
    }
    var loader = loaderModal.load()
    AxiosPrivate.post(endpoints.calcPrice, parameters).then((res) => {
      setTripPrice({ ...res.data, phoneNumber: params?.phoneNumber })
      setShowBillModal(true)
      console.log(res.data)
    }).finally(() => {
      loaderModal.close(loader);
    })
  }
  var insertWithOutCalcPrice = () => {
    // if (params?.mobile == '') {
    //   toast.Error("همراه را وارد نمایید")
    //   return;
    // }
    // if (params?.custName == '') {
    //   toast.Error("نام را وارد نمایید")
    //   return;
    // }

    var origin = {
      lat: params?.originLat,
      lng: params?.originLng,
      address: params?.originAddr
    }




    var parameters = {
      stopTime: 0,
      addresses: [
        origin
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
      isWithOutDest: 1
    }

    AxiosPrivate.post(endpoints.pointIOTrip, parameters)
      .then((res) => {

        if (res.data.status) {
          setPrintTripCode(res.data?.tripCode)
          setTripPrice(undefined)
          setParams({
            ...params,
            destAddress: '',
            mobile: '',
            custName: ''
          })
        } else {
          toast.Error("راننده ای یافت نشد")
        }
      })

  }

  var insertTrip = () => {

    var parameters = {
      tempTripCode: tripPrice?.tripTempId,
      isWithOutDest: 0
    }

    AxiosPrivate.post(endpoints.pointIOTrip, parameters)
      .then((res) => {

        if (res.data.status) {
          successModal.show("سفر خوش", "سفر شما با موفقیت گرفته شد", () => {
            setPrintTripCode(res.data?.tripCode)
            setTripPrice(undefined)
            setParams({
              ...params,
              destAddress: '',
              mobile: '',
              custName: ''
            })
          })
        } else {
          toast.Error("راننده ای یافت نشد")
        }
      })
  }
  var [printTripCode, setPrintTripCode] = useState()
  const { mapSettings } = useContext(MapSettingsContext);

  return (
    <div className="w-100 vh-100  position-relative d-flex" dir="rtl">
      <div className=" col-12" >
        <MapContainer
          className="w-100 h-100"
          zoom={12}
          center={position}
          zoomControl={false}
          crs={mapSettings?.crs}
          key={mapSettings.url}

          tileSize={mapSettings?.tileSize}
          attributionControl={false}
          scrollWheelZoom={true}>
          <TileLayer
            url={mapSettings?.url}
            tms={mapSettings?.tms}
          />
          <MapController
            params={params}
            carClass={carClass}
            flyTo={flyTo}
            mapCityArea={mapCityArea}
            onComplete={(info) => {
              calcPrice({
                originLat: params?.originLat,
                originLng: params?.originLng,
                originAddr: params?.originAddr,
                lineCode: params?.lineCode,
                oStCode: params?.oStCode,
                destAddress: info.address,
                destLat: info.lat,
                destLng: info.lng,
                classCode: info.classCode,
                custName: info.custName,
                phoneNumber: info.phoneNumber
              })
            }} />

          <Polyline pathOptions={{ color: '#2222cc', opacity: '0.4', weight: '3' }} positions={mapCityArea} />

        </MapContainer>

      </div>


      <BillKisok
        tripInfo={tripPrice}
        show={showBillModal}
        onClose={(accept) => {
          setShowBillModal(false)
          if (accept) {
            insertTrip()
          }

        }} />

      <BillTripPrint
        printTripCode={printTripCode}
        setPrintTripCode={setPrintTripCode} />

    </div >
  );
}

