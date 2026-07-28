import { color } from "@mui/system";
import React, { createContext, useEffect, useRef, useState } from "react";
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { AxiosPrivate } from "../app/axiosPrivate";
import endpoints from "../app/endpoints";
import mashhadLogo from '../assets/drawable/mashhad_taxi_logo_.png'
import qr from '../assets/drawable/qr.png'
import NumberReader from "../helper/numberReader";
import loaderModal from "../modals/loaderModal";
import PrintContent from "./print";

export default function BillTripPrint(props) {
    var [print, setPrint] = useState({})

    var contentToPrint = useRef()
    const handlePrint = useReactToPrint({
        documentTitle: "Print This Document",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => {
            console.log(codeReader)
            setReader(!sreader)
            props?.onAfterPrint()

        },
        removeAfterPrint: true,
    });

    var [sreader, setReader] = useState(true);
    useEffect(() => {
        if (codeReader)
            NumberReader(codeReader)
    }, [sreader])
    var [codeReader, setCodeReader] = useState()
    var getPrintData = (tripCode) => {
        var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.pointIOPrint, { params: { tripCode } })
            .then((res) => {
                setPrint(res.data)

                loaderModal.close(loader)

                if (props?.printEnable) {
                    setTimeout(() => {
                        handlePrint(null, () =>
                            contentToPrint.current
                        );
                    }, 200)

                    setCodeReader(res.data.drv3Code)
                } else {
                    NumberReader(res.data.drv3Code)
                }
                props?.setPrintTripCode(undefined)
            })
    }

    useEffect(() => {
        if (props?.printTripCode) {
            getPrintData(props?.printTripCode)
        }
    }, [props?.printTripCode])



    return <div className="d-none position-fixed">

        <div ref={contentToPrint} className="printContent d-flex row m-0 p-0 align-items-center justify-content-center" width='8cm' style={{ width: '8cm' }} dir="rtl">
            <div className="row m-0 p-0">

                <img className=" m-0 p-0" src={mashhadLogo} style={{ width: '4rem', height: '4rem' }} />
                <div className="row col m-0 p-0 flex-grow-1">
                    <label className="col-12 text-center iranSansBold pt-1 text-black" style={{ fontSize: '10px' }}>{print?.stName}</label>

                    <div className="col-12 d-flex justify-content-center align-items-center p-0 m-0 text-black">
                        <label className="col-12 text-center iranSansBold text-black"
                            style={{ borderStyle: 'solid', borderWidth: '3px' }}>ویژه مسافر</label>
                    </div>
                    <label className="col-12 text-center iranSansBold text-black" style={{ fontSize: '10px' }} >{print?.tripTimeStr}</label>

                </div>
                <img className=" m-0 p-0" src={qr} style={{ width: '4rem', height: '4rem' }} />
            </div>
            <div className="col-12 iranSansBold mx-2 border border-dark mt-1" />

            <div className="col-12 d-flex justify-content-center align-items-center mt-1">

                <h6 className="w-auto text-end iranSansMedium text-black " >کد تاکسی : </h6>
                <h4 className="w-auto iranSansBold ms-auto text-black">{print?.drv3Code}</h4>
                <h6 className="w-auto text-end iranSansMedium text-black" >{print?.carTypeStr}</h6>
            </div>
            <div className="col-12 d-flex">

                <h6 className="w-auto text-end ms-auto iranSansMedium text-black">{print?.plaqueStr}</h6>
                <label className="w-auto text-end text-truncate iranSansMedium text-black" >{print?.drvName}</label>
            </div>

            <div className="col-12">
                <label className="col-12 text-center iranSansBold card mx-2 w-auto border border-dark text-black" >{print?.drvMobile}</label>
            </div>

            <div className="d-flex col-12">

                <label className=" text-end  text-black" style={{ width: '3.3rem' }}> مبدا :</label>
                <label className=" text-end iranSansBold pb-1 text-black col" >{print?.originAddress}</label>
            </div>

            {
                (print?.priceStr?.length > 0) ? <>
                    <div className="d-flex col-12">
                        <label className=" text-end text-black" style={{ width: '3.3rem' }}> مقصد :</label>
                        <label className=" text-end iranSansBold text-black text col" >{print?.destAddress}</label>
                    </div>
                    <div className="d-flex col-12">
                        <label className="text-end pt-1 text-black" style={{ width: '3.3rem' }}> مسیر :</label>
                        <label className="text-end iranSansBold text-black col" >{print?.routeStr}</label>
                    </div>

                    <div className="col-12  mx-2 border border-dark mt-1" />



                    <div className="my-1 text-black" style={{ boborderStyle: 'solid', borderWidth: '0.5px 0px', color: '#000000' }} />
                    <label className="col-12 text-center iranSansBold text-black" style={{ fontSize: '14px' }}>بهای خدمات راننده</label>

                    <h1 className="col-12 text-center iranSansBold text-black" >{print?.priceStr}</h1>
                    {
                        print?.extraFare > 0 ?
                            <div style={{ background: '#00000015' }}>
                                <div className="col-12 d-flex align-items-center justify-content-center " >

                                    <label className="iranSansBold text-black text-center" style={{ fontSize: '10px' }}>درصد هوشمند سازی : </label>
                                    <label className="text-center iranSansBold text-black me-auto" style={{ fontSize: '18px' }}>{print?.extraFareStr}</label>

                                </div>
                                <div className="col-12  mx-2 border border-dark mt-1 opacity-50" />

                                <div className="col-12 d-flex align-items-center justify-content-center " >

                                    <label className="iranSansBold text-black text-center" style={{ fontSize: '10px' }}>کرایه نهایی : </label>
                                    <label className="text-center iranSansBold text-black me-auto" style={{ fontSize: '18px' }}>{print?.totalPriceStr}</label>

                                </div>


                            </div>
                            : <></>
                    }
                    <div className="col-12  mx-2 border border-dark mt-1" />

                    <label className="col-12 text-center iranSansBold text-black mt-1" style={{ fontSize: '10px' }}>{print?.priceDesc}</label>

                </> :
                    <>
                    </>
            }



            <div className="col-12  mx-2 border border-dark mt-1 " />
            <label className="col-12 text-center iranSansBold text-black" style={{ fontSize: '10px' }}>{print?.moreDesc}</label>


        </div>

    </div>





}