import React, { useState, useEffect } from "react";
import endpoints from "../../../app/endpoints";
import { CgClose } from 'react-icons/cg'
import { AxiosPrivate } from "../../../app/axiosPrivate";
import answerModal from "../../../modals/answerModal";
import MapStatic from "../../../components/customeTag/mapStatic";
import AddFrequentAddress from "../../../modals/addFrequentAddress";
import { MdEdit } from "react-icons/md";

export default function FrequentDests() {
  var [frequentAddress, setFrequentAddress] = useState([])

  var getFrequentAddress = () => {

    AxiosPrivate.get(endpoints.pointIOFrequentAddress).then((res) => {
      setFrequentAddress(res.data)
    })
  }
  var removeFrequentAddress = (frequentCode) => {
    answerModal.show("آیا این مقصد پر تکرار حذف شود؟", () => {
      AxiosPrivate.delete(endpoints.pointIOFrequentAddress, { data: { frequentCode: frequentCode } })
        .then((res) => {
          getFrequentAddress()
        })
    }, undefined)

  }

  useEffect(() => {
    getFrequentAddress()
  }, [])


  return (
    <>
      <div className="h-100 d-flex flex-column " dir="rtl" >

        <div className="col-12 top-0 mb-3 ">
          <AddFrequentAddress
            onClose={() => {
              getFrequentAddress()
            }}
          >
            <button className="btn btn-primary w-100 h-100 p-3  "><h3 className="iranSansBold">+ افزودن آدرس جدید</h3></button>
          </AddFrequentAddress>
        </div>
        <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll g-2 row'>

          {frequentAddress?.map((item, index) => {
            return <div className="col-12 col-lg-6" key={index} >

              <div className="card ">
                <div className=" d-flex flex-row p-0 m-0 align-items-center position-relative">
                  <div className="ms-auto px-3">


                    <h3 className="iranSansBold mt-2 col-12">{item?.title}</h3>
                    <label className=" col-12">{item?.fullAddress} </label>
                    <label className="col-12 pb-2 ">{item?.stCode} </label>
                    <div className="">


                      <AddFrequentAddress
                        item={item}
                        onClose={() => {
                          getFrequentAddress()
                        }}>
                        <button className="btn btn-outline-primary">
                          <MdEdit className="ms-2"
                          />
                          ویرایش
                        </button>

                      </AddFrequentAddress>
                      <button className="btn btn-outline-danger mx-2" onClick={() => {
                        removeFrequentAddress(item?.frequentCode)
                      }}>
                        <CgClose className="ms-2"
                        />
                        حذف
                      </button>
                    </div>
                  </div>
                  <MapStatic
                    lat={item?.lat}
                    lng={item?.lng} />


                </div>
              </div>


            </div>
          })}



        </div>
      </div>


    </>
  );
}

function Card(props) {

  return
}


