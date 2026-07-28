import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import 'react-image-crop/dist/ReactCrop.css'
import { CgClose } from 'react-icons/cg'
import endpoints from "../../../../app/endpoints";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import _ from 'lodash'
import pin from "../../../../assets/drawable/pin.png";
import DivBlock from "../../../../components/customeTag/divBlock";

import toast from "../../../../components/toast";
import { MapSettingsContext } from "../../../../contexts/initialMapSettings";
import SearchAddress from "../../../../routes/private/actions/entrance/searchAddress";

export default function AddDuplicateAddress(props) {

    var [show, setShow] = useState(false)
    var position = [36.31935058, 59.554662]

    const handleShow = (e) => {
        setShow(true)
    };

    var [params, setParams] = useState(undefined)
    useEffect(() => {
        if (show) {
            if (props?.item) {
                setParams(props?.item)
            } else {
                setParams(undefined)
            }
        } else {
            setParams(undefined)
        }
    }, [show])

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });
    const { mapSettings } = useContext(MapSettingsContext);

    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="xl"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header  p-0" dir="rtl">
                <MapContainer
                    className="w-100 card"
                    style={{ minHeight: '90vh' }}
                    zoom={12}
                    center={position}
                    zoomControl={false}
                    attributionControl={false}
                    key={mapSettings.url}

                    crs={mapSettings?.crs}
                    tileSize={mapSettings?.tileSize}
                    scrollWheelZoom={true}>
                    <TileLayer
                        url={mapSettings?.url}
                        tms={mapSettings?.tms}
                    />
                    <MapController
                        params={params}
                        onClose={() => {
                            setShow(false)
                            props.onClose()
                        }}
                    />


                </MapContainer>
            </Modal.Body>


        </Modal>
    </>)
}




function MapController(props) {
    const map = useMap()

    var [center, setCenter] = useState(map.getCenter())
    var [selectStList, setSelectedStList] = useState([])

    useEffect(() => {
        if (props?.params) {
            setSelectedStList(props?.params?.stCode?.split(','))
            setZoneName(props?.params?.zoneName)
            setStreetName(props?.params?.streetName)
            moveTo(props?.params?.lat, props?.params?.lng)
        }


    }, [props?.params])

    useEffect(() => {
        var event = map.addEventListener("moveend", (e) => {
            setCenter(map.getCenter())
        })
        return () => {
            map.removeEventListener("moveend", event)
        };
    }, []);

    var flyTo = (lat, lng) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, 16)
    }
    var moveTo = (lat, lng) => {
        if (lat == undefined) return
        map.flyTo({ lat: lat, lng: lng }, 14, { animate: false })
    }

    useEffect(() => {
        try {
            flyTo(props?.flyTo?.lat, props?.flyTo?.lng)
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
            setAddressesResult(res.data)
        })
    };

    useEffect(() => {
        getAddress()
    }, [center])

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


    var [zoneName, setZoneName] = useState()
    var [streetName, setStreetName] = useState()
    var [stCode, setStCode] = useState()

    var AddDuplicateAddress = () => {
        if (!streetName) {
            toast.Error('عنوان خیابان را وارد نمایید')
            return
        }
        if (!zoneName) {
            toast.Error('عنوان محله را وارد نمایید')
            return
        }


        var params = {
            streetName: streetName,
            zoneName: zoneName,
            lat: center?.lat,
            lng: center?.lng
        }

        AxiosPrivate.post(endpoints.duplicateAddress, params)
            .then((res) => {
                toast.Success(res?.data?.msg)
                props.onClose()
            })
    }
    return <>
        <div className="position-absolute bottom-50  d-flex justify-content-center noSelect "
            style={{ zIndex: 409, left: '45%', right: '45%', height: '4rem', paddingTop: '0.3rem' }}>
            <img
                src={pin}
                style={{ height: '4rem' }}
                className="aPointer"
            />
        </div>


        <DivBlock className="position-absolute bottom-0 start-0 end-0 p-3" style={{ zIndex: 409 }}>
            <div>
                <div className="row g-2">
                    <div className="col-6 pt-2">
                        <input className="form-control shadow mb-2 border-secondary "
                            placeholder="عنوان خیابان"
                            value={streetName}
                            onChange={(e) => { setStreetName(e.target.value) }}
                        />
                    </div>
                    <div className="col-6 pt-2">
                        <input className="form-control shadow mb-2 border-secondary "
                            placeholder="عنوان محله"
                            value={zoneName}
                            onChange={(e) => { setZoneName(e.target.value) }}
                        />
                    </div>

                </div>

                <p className="card iranSansBold p-2 mb-1 border-secondary">{currentAddress?.address}</p>
                <button className="btn btn-primary  shadow p-0 w-100 p-2 mt-0"
                    onClick={() => {
                        AddDuplicateAddress()
                    }} >
                    افزودن آدرس مشابه
                </button>
            </div>

        </DivBlock >
        <DivBlock className="position-absolute start-0 end-0 p-2" style={{ zIndex: 409 }}>
            <div className=" d-flex">
                <SearchAddress
                    className="col form-control px-2 border-secondary"
                    center={{ lat: center?.lat, lng: center?.lng }}
                    calcPriceByRouting={true}
                    onSelectAddress={(item) => {
                        flyTo(item.lat, item.lng)
                    }} />
                <div className="m-1" />

                <button className="btn btn-light shadow p-0  border-secondary"
                    style={{ height: '2.5rem', width: '2.5rem' }}
                    onClick={() => {
                        props?.onClose()
                    }} >
                    <CgClose className=" text-hover aPointer  p-2" size={40} />
                </button>
            </div>

        </DivBlock>


    </>
}