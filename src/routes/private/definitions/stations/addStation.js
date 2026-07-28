
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import loaderModal from "modals/loaderModal";
import axios from "axios";
import Storages from "app/storages";
import { FcSearch } from "react-icons/fc"
import { CgClose, CgMoon, CgSun } from 'react-icons/cg'
import endpoints from "app/endpoints";
import { AxiosPrivate } from "app/axiosPrivate";
import CheckBox from "components/customeTag/checkBox";
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import _ from 'lodash'
import pin from "assets/drawable/pin.png";
import DivBlock from "components/customeTag/divBlock";
import { EditPolygon } from "components/draw/editPolygon";
import AddPolygon from "components/draw/addPolygon";
import { FaArrowLeft } from "react-icons/fa"
import toast from "components/toast";
import CompanyDropDown from "components/dropdowns/companyDropDown";
import LinesDropDown from "components/dropdowns/linesDropDown";
import CitiesDropDown from "components/dropdowns/CitiesDropDown";
import { MapSettingsContext } from "contexts/initialMapSettings";
const fromPin = require('assets/drawable/origin.png')

export default function AddStation(props) {

    var [show, setShow] = useState(false)
    var [params, setParams] = useState(props?.station)
    var [stations, setStations] = useState(props?.stations)
    var [lockField, setLockField] = useState(false)
    var position = [36.31935058, 59.554662]

    useEffect(() => {
        if (show) {
            if (props?.station?.stCode) {
                setLockField(true)
            } else {
                setLockField(false)
                stationCheck()
            }
            setStations(props?.stations)

        }
    }, [show])

    const updateSt = (sendParams) => {
        if (!sendParams?.stCode) {
            toast.Error("کد ایستگاه را وارد نمایید")
            return
        }
        if (!sendParams?.stName) {
            toast.Error("نام ایستگاه را وارد نمایید")
            return
        }
        if (!sendParams?.lat) {
            toast.Error("موقعیت ایستگاه را مشخص کنید")
            return
        }
        if (!sendParams?.lng) {
            toast.Error("موقعیت ایستگاه را مشخص کنید")
            return
        }
        console.log("ssssssss333", sendParams)

        AxiosPrivate.put(endpoints.stations, sendParams)
            .then(res => {
                console.log("ssssssss333", sendParams)

                // console.log(res.data)
                // setShow(false)
                // props?.onClose()
                setStations(prev =>
                    prev.map(item =>
                        item?.stCode == sendParams?.stCode
                            ? { ...item, ...sendParams }
                            : item
                    )
                )
                toast.Success(res?.data?.msg)

            })
    }




    // useEffect(() => {
    //     console.log("statiohs", stations)

    // }, [stations])


    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }))

        } catch (err) {
            console.log(err)
        }
    }

    function handleOnCheck(e) {
        try {
            var value = e.target.checked;
            var name = e.target.name;

            setParams(prevState => ({
                ...prevState,
                [name]: value
            }));
            console.log(value, name);

        } catch (err) {
            console.log(err);
        }

    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    const handleShow = (e) => {
        setShow(true)
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });

    var [msg, setMsg] = useState(undefined)
    var [sendLock, setSendLock] = useState(false)

    var stationCheck = () => {
        AxiosPrivate.get(endpoints.stationCheck, { params: { stCode: params?.stCode } })
            .then((res) => {
                setMsg(res?.data?.msg)

                if (res?.data?.status == 1) {
                    setParams(prevState => ({ ...prevState, stCode: res?.data?.stCode }))
                    setSendLock(false)
                } else {
                    toast.Error(res?.data?.msg)
                    setSendLock(true)
                }
            })
    }

    const { mapSettings } = useContext(MapSettingsContext);


    return (<>
        {newFirstChild}

        <Modal show={show}
            fullscreen={true}
            centered
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0 " dir="rtl">

                <div className="d-flex ">
                    <div className="d-flex flex-column p-3  col-12 col-lg-5 overflow-auto vh-100 aScroll" >
                        <form>
                            <p className="text-danger iranSansBold text-center p-0 m-0">{msg}</p>

                            <div className="col-12 g-2 row ">
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد ایستگاه <label className="text-danger">*</label></label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="کد ایستگاه"
                                        disabled={lockField}
                                        name="stCode"
                                        onBlur={() => {
                                            stationCheck()
                                        }}

                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.stCode || ''}
                                    />
                                </div>
                                <div className="col-9" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >نام ایستگاه <label className="text-danger">*</label></label>
                                    </div>
                                    <input type="text"
                                        className="form-control"
                                        placeholder="نام ایستگاه"
                                        name="stName"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.stName || ''}
                                    />
                                </div>

                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >ایستگاه جایگزین</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="ایستگاه جایگزین"
                                        name="stAlt"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.stAlt || ''}
                                    />
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >شعاع ارسال</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="شعاع ارسال"
                                        name="radius"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.radius || ''}
                                    />
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >سفید تا</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="سفید تا"
                                        name="whiteTo"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.whiteTo || ''}
                                    />
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >زرد تا</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="زرد تا"
                                        name="yellowTo"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.yellowTo || ''}
                                    />
                                </div>

                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >ظرفیت</label>
                                    </div>
                                    <input type="number"
                                        className="form-control"
                                        placeholder="ظرفیت"
                                        name="capacity"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.capacity || ''}
                                    />
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >شرکت</label>
                                    </div>

                                    <CompanyDropDown
                                        onChange={handleOnChange}
                                        value={params?.companyCode}
                                        name="companyCode"
                                    />
                                    {/* <input type="number"
                                        className="form-control"
                                        placeholder="شرکت"
                                        name="companyCode"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.companyCode || ''}
                                    /> */}
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >کد خط</label>
                                    </div>
                                    {/* <input type="number"
                                        className="form-control"
                                        placeholder="کد خط"
                                        name="lineCode"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.lineCode || ''}
                                    /> */}

                                    <LinesDropDown
                                        onChange={handleOnChange}
                                        value={params?.lineCode}
                                        name="lineCode"
                                    />
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >سیاست</label>
                                    </div>
                                    <input type="text"
                                        className="form-control fredoka "
                                        placeholder="سیاست"
                                        dir="ltr"
                                        name="politics"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.politics || ''}
                                    />
                                </div>
                                <div className="col-9" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >توضیح فاکتور سفر</label>
                                    </div>
                                    <input type="text"
                                        className="form-control "
                                        placeholder="توضیح فاکتور سفر"
                                        name="tripFactorDesc"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.tripFactorDesc || ''}
                                    />
                                </div>
                                <div className="col-3" >
                                    <div className="d-flex flex-row align-items-center">
                                        <label className="ps-2" >شعاع سفر آزاد</label>
                                    </div>
                                    <input type="text"
                                        className="form-control "
                                        placeholder="شعاع سفر آزاد"
                                        name="freeServiceDistance"
                                        onChange={handleOnChange}
                                        onKeyDown={handleEnter}
                                        value={params?.freeServiceDistance || ''}
                                    />
                                </div>

                                <div className="col-4" >
                                    <CheckBox title="تماس لغو سفر"
                                        onChange={handleOnCheck}
                                        checked={params?.cancelCall}
                                        name="cancelCall" />
                                </div>
                                <div className="col-4" >
                                    <CheckBox title="لغو خودکار"
                                        onChange={handleOnCheck}
                                        checked={params?.autoCancel}
                                        name="autoCancel" />
                                </div>
                                <div className="col-4" >
                                    <CheckBox title="خروج خودکار"
                                        onChange={handleOnCheck}
                                        checked={params?.autoExit}
                                        name="autoExit" />
                                </div>
                                <div className="col-4" >
                                    <CheckBox title="خارج از شهر"
                                        onChange={handleOnCheck}
                                        checked={params?.outOfCity}
                                        name="outOfCity" />
                                </div>
                                <div className="col-4" >
                                    <CheckBox title="نمایش برای راننده"
                                        onChange={handleOnCheck}
                                        checked={params?.displayForDriver}
                                        name="displayForDriver" />
                                </div>
                                <div className="col-4" >
                                    <CheckBox title="آزاد  سازی خودکار"
                                        onChange={handleOnCheck}
                                        checked={params?.autoFreeService}
                                        name="autoFreeService" />
                                </div>
                                <div className="col-12 d-flex">
                                    <div className="col-4" >
                                        <CheckBox title="زوج و فرد" />
                                    </div>
                                    <div className="col-4 d-flex ">
                                        <p className="px-2">از</p>
                                        <input className="form-control text-center"
                                            placeholder="--:--" />
                                    </div>
                                    <div className="col-4 d-flex">
                                        <p className="px-2">تا</p>
                                        <input className="form-control text-center"
                                            placeholder="--:--"
                                        />
                                    </div>
                                </div>

                                <div className="col-12 d-flex">
                                    <div className="col-4" >
                                        <CheckBox title="طرح ترافیک" />
                                    </div>
                                    <div className="col-4 d-flex ">
                                        <p className="px-2">از</p>
                                        <input className="form-control text-center"
                                            placeholder="--:--" />
                                    </div>
                                    <div className="col-4 d-flex">
                                        <p className="px-2">تا</p>
                                        <input className="form-control text-center"
                                            placeholder="--:--"
                                        />
                                    </div>
                                </div>

                                <div className="col-12 d-flex">
                                    <div className="col-4" >
                                        <label className="ps-2" >ایستگاه شب جایگزین</label>
                                    </div>
                                    <div className="col-4 d-flex ">
                                        <p className="px-2">اول</p>
                                        <input className="form-control text-center"
                                            placeholder="" />
                                    </div>
                                    <div className="col-4 d-flex">
                                        <p className="px-2">دوم</p>
                                        <input className="form-control text-center"
                                            placeholder=""
                                        />
                                    </div>
                                </div>


                            </div>
                        </form>
                        <div className="row g-2 mt-auto ">
                            <div className="col-9">
                                <button className="btn btn-success w-100 "
                                    disabled={sendLock}
                                    onClick={(e) => {
                                        updateSt(params)
                                        console.log(params)
                                    }}>
                                    ثبت
                                </button>
                            </div>
                            <div className="col-3">
                                <button className="btn btn-danger  w-100" onClick={(e) => {
                                    setShow(false)
                                    props?.onClose()
                                }}>
                                    بستن
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="col-12 col-lg-7 d-none d-lg-block bg-danger vh-100">
                        <MapContainer
                            className="w-100 h-100"
                            zoom={12}
                            center={position}
                            zoomControl={false}
                            key={mapSettings.url}

                            attributionControl={false}
                            crs={mapSettings?.crs}
                            tileSize={mapSettings?.tileSize}
                            scrollWheelZoom={true}>
                            <TileLayer
                                url={mapSettings?.url}
                                tms={mapSettings?.tms}
                            />

                            {params?.radius ?
                                params?.lat ?
                                    < Circle
                                        center={{ lat: params?.lat, lng: params?.lng }}
                                        fillColor="blue"

                                        pathOptions={{
                                            color: 'blue',       // رنگ خط دور
                                            weight: 2,           // ضخامت خط دور
                                            fillColor: 'blue',    // رنگ پرشدگی
                                            fillOpacity: 0.1,    // شفافیت پرشدگی (40% مات)
                                            opacity: 0.2   // شفافیت خط دور (80% مات)
                                        }}
                                        radius={params?.radius} />
                                    : <></>
                                : <></>}

                            <MapController
                                stations={stations}
                                onClose={() => { setShow(false) }}
                                centerStation={{ lat: params?.lat, lng: params?.lng }}
                                stCode={params?.stCode}
                                station={params}
                                onLocationStation={(locationStation) => {
                                    setParams(prevState => ({ ...prevState, lat: locationStation?.lat, lng: locationStation?.lng }))
                                }}
                                onPolygonStation={(polygonStation, polygonStationNight) => {
                                    var newParams = { ...params, polygonStation, polygonStationNight }
                                    setParams(newParams)
                                    updateSt(newParams)
                                }}

                                onOtherPolygonClick={(station) => {
                                    setParams(station)
                                }}

                            // params={params}
                            // flyTo={flyTo}
                            // onChangeLocation={(addrInfo) => {
                            //     setTripPrice(undefined)
                            //     setParams(prevState => ({ ...prevState, destAddress: addrInfo.address, destLat: addrInfo.lat, destLng: addrInfo.lng }))
                            // }}
                            />


                        </MapContainer>

                    </div>
                </div>
            </Modal.Body>


        </Modal>
    </>)
}




function MapController(props) {
    const map = useMap()
    var [Poll, setPoll] = useState(false)
    const [allowCreatePolygon, setAllowCreatePolygon] = useState(false)
    const [polygon, setPolygon] = useState([])
    const [polygonNight, setPolygonNight] = useState([])
    var [stationLocation, setStationLocation] = useState(undefined)

    const blueOptions = { color: 'blue' }

    var originIcon = new L.Icon({
        iconUrl: fromPin,
        iconSize: new L.Point(15, 15),
    });

    useEffect(() => {
        if (props?.station?.polygonStation != undefined) {
            setPolygon(props?.station?.polygonStation)
        }
        if (props?.station?.polygonStationNight != undefined) {
            setPolygonNight(props?.station?.polygonStationNight)
        }

        console.log("STATIONB ", props?.station)
        if (props?.centerStation != undefined) {
            if (props?.centerStation?.lat != undefined)
                setStationLocation(props?.centerStation)
            moveTo(props?.centerStation?.lat, props?.centerStation?.lng)
        }
    }, [map])

    var [center, setCenter] = useState(map.getCenter())

    useEffect(() => {
        // getStations()
        console.log("ssssssssssss")
        setStations(props?.stations)
        var event = map.addEventListener("moveend", (e) => {
            setCenter(map.getCenter())
        })
        return () => {
            map.removeEventListener("moveend", event)
        };

    }, []);

    useEffect(() => {
        setStations(props?.stations)

    }, [props?.stations])

    useEffect(() => {
        // getStations()
        // setStations(props?.stations)

        if (props?.station?.polygonStation != undefined)
            setPolygon(props?.station?.polygonStation)

        if (props?.station?.polygonStationNight != undefined)
            setPolygonNight(props?.station?.polygonStationNight)
        if (props?.centerStation != undefined) {
            if (props?.centerStation?.lat != undefined)
                setStationLocation(props?.centerStation)
            // moveTo(props?.centerStation?.lat, props?.centerStation?.lng)
        }
        var event = map.addEventListener("moveend", (e) => {
            setCenter(map.getCenter())
        })
        return () => {
            map.removeEventListener("moveend", event)
        };


    }, [props?.centerStation]);

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

    const searchAddress = (searchAddress) => {
        var params = {
            lat: center.lat,
            lng: center.lng,
            term: searchAddress,
        };
        AxiosPrivate.get(endpoints.search, {
            params: params,
        }).then((res) => {
            console.log(res.data)
            setAddressesResult(res.data)
        })
    };

    var [searchTerm, setSearchTerm] = useState()
    var [addressesResult, setAddressesResult] = useState([])

    // تابعی که می‌خواهید پس از تکمیل تایپ اجرا شود
    const doSomethingAfterUserHasStoppedTyping = (inputValue) => {
        console.log(`کاربر تایپ کردن را تمام کرد: ${inputValue}`);
        searchAddress(inputValue)
        // اینجا کد مورد نظر خود را قرار دهید
    };

    // استفاده از debounce برای تاخیر در اجرای تابع
    const debouncedDoSomething = _.debounce(doSomethingAfterUserHasStoppedTyping, 300);

    useEffect(() => {
        if (searchTerm) {
            debouncedDoSomething(searchTerm);
        }
        // لغو debounce در صورت unmount شدن کامپوننت
        return () => {
            debouncedDoSomething.cancel();
        };
    }, [searchTerm]); // فقط زمانی اجرا می‌شود که مقدار value تغییر کند

    var [stations, setStations] = useState([])
    var [isNightPolygon, setNightPolygon] = useState(false)

    return <>
        {stationLocation ?
            <Marker position={[stationLocation?.lat, stationLocation?.lng]}
                icon={originIcon}
                draggable={false}
                eventHandlers={{
                    dragend: (e) => {
                        console.log(e.target.getLatLng())
                        setStationLocation(e.target.getLatLng())
                        props.onLocationStation(e.target.getLatLng())
                    }
                }} >

            </Marker>
            : <div className="position-absolute bottom-50  d-flex justify-content-center noSelect "
                style={{ zIndex: 409, left: '45%', right: '45%', height: '4rem', paddingTop: '0.3rem' }}>
                <img
                    src={pin}
                    style={{ height: '4rem' }}
                    className="aPointer"
                    onClick={() => {
                        setStationLocation(center)
                        props?.onLocationStation(center)
                        // getAddress()
                    }} />
            </div>}

        <DivBlock className="position-absolute bottom-0  end-0 p-3" style={{ zIndex: 409 }}>
            <div className="d-flex">
                {/* <p className="card iranSansBold p-2 mb-1">{currentAddress?.address}</p> */}
                {
                    stationLocation ?
                        <button className="btn btn-warning  shadow p-2  m-1"
                            onClick={() => {
                                setStationLocation(undefined)
                                props?.onLocationStation(undefined)
                            }}>
                            ویرایش مرکز ایستگاه
                        </button>
                        : <button className="btn btn-success  shadow p-2  m-1"
                            onClick={() => {
                                setStationLocation(center)
                                props?.onLocationStation(center)
                            }}>
                            تـایـیـد مرکز ایستگاه *
                        </button>
                }

                {allowCreatePolygon ?
                    <>
                        <button className="btn btn-success  shadow p-2  m-1"
                            onClick={() => {
                                setAllowCreatePolygon(false);
                                props.onPolygonStation(polygon, polygonNight)
                            }}>
                            تـایـیـد حدود ایستگاه
                        </button>
                        <button className="btn btn-danger  shadow p-2  m-1"
                            onClick={() => {
                                setAllowCreatePolygon(false);
                                props.onPolygonStation([], [])
                            }}>
                            حذف حدود ایستگاه
                        </button>
                    </>
                    :
                    <button className="btn btn-warning  shadow p-2  m-1"
                        onClick={() => {
                            setAllowCreatePolygon(true);
                        }}>
                        ویرایش حدود ایستگاه
                    </button>
                }


            </div>

        </DivBlock>



        {
            stations?.map((item, index) => {
                return <div key={index} style={{ zIndex: 10000 }}>
                    {(props?.stCode != item?.stCode) ?

                        <Polygon

                            positions={isNightPolygon == 1 ? item?.polygonStationNight : item?.polygonStation}
                            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.05, opacity: 0.6, dashArray: '10,5', weight: '3' }}
                            eventHandlers={{
                                click: () => {

                                    // setAllowCreatePolygon(true)
                                }
                            }}
                        >
                            <Popup>
                                {item.stCode + ' ' + item.stName}
                                <button className="btn btn-primary me-3" onClick={() => {
                                    props?.onOtherPolygonClick(item)

                                    map.closePopup()
                                }}>ویرایش</button>
                            </Popup>

                        </Polygon>
                        : <></>}
                </div>
            })
        }


        <AddPolygon
            polygon={isNightPolygon == 1 ? polygonNight : polygon}
            allowDraw={allowCreatePolygon}
            onChange={(p) => {
                // if (Poll)
                if (isNightPolygon == 1)
                    setPolygonNight(p)
                else
                    setPolygon(p)
            }} />
        {
            !allowCreatePolygon ?
                <Polygon
                    positions={isNightPolygon == 1 ? polygonNight : polygon}
                    pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.15, opacity: 0.7, dashArray: '10,0', weight: '6' }}
                    eventHandlers={{
                        click: () => {
                            setAllowCreatePolygon(true)
                        }
                    }}
                />
                : <></>

        }



        <DivBlock className="position-absolute start-0  p-2 d-flex align-items-center " style={{ zIndex: 409 }}>

            <div className="p-2">
                <CitiesDropDown value={0} onChange={(city) => {
                    flyTo(city.centerLat, city.centerLng, 12)
                }} />
            </div>

            <button className="btn btn-light   shadow p-0"
                onClick={() => {
                    props?.onClose()
                }} >
                <CgClose className=" text-hover aPointer  p-2" size={40} />
            </button>
        </DivBlock>


        <DivBlock className="position-absolute end-0  p-2 d-flex align-items-center " style={{ zIndex: 409 }}>

            {
                isNightPolygon == 1 ?
                    <button className="btn btn-light   shadow p-0"
                        onClick={() => {
                            setNightPolygon(0)
                        }} >
                        <CgMoon className=" text-hover aPointer  p-2" size={40} />
                    </button>
                    :
                    <button className="btn btn-light   shadow p-0"
                        onClick={() => {
                            setNightPolygon(1)
                        }} >
                        <CgSun className=" text-hover aPointer  p-2" size={40} />
                    </button>
            }

        </DivBlock>



    </>
}