import React, { useState, useEffect } from "react";
import endpoints from "../../../../app/endpoints";
import { CgClose } from 'react-icons/cg'
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import answerModal from "../../../../modals/answerModal";
import MapStatic from "../../../../components/customeTag/mapStatic";
import AddDuplicateAddress from "./addDuplicateAddress";
import { MdEdit } from "react-icons/md";

export default function DuplicateAddress() {
  var [duplicateAddresses, setDuplicateAddress] = useState([])

  var getDuplicateAddress = () => {

    AxiosPrivate.get(endpoints.duplicateAddress + "/" + streetName).then((res) => {
      setDuplicateAddress(res.data)
    })
  }
  var removeDuplicateAddress = (dCode) => {
    answerModal.show("آیا این آدرس مشابه حذف شود؟", () => {
      AxiosPrivate.delete(endpoints.duplicateAddress + "/"
        + dCode, { data: { dCode: dCode } })
        .then((res) => {
          getDuplicateAddress()
        })
    }, undefined)

  }

  useEffect(() => {
    getDuplicateAddress()
  }, [])

  var [streetName, setStreetName] = useState("")
  return (
    <>
      <div className="h-100 d-flex flex-column " dir="rtl" >

        <div className="col-12 row gx-2 py-3">

          <div className="col-12 col-md-6">
            <input className="form-control shadow  border-secondary   "
              placeholder="عنوان خیابان"
              value={streetName}
              onChange={(e) => { setStreetName(e.target.value) }}
            />
          </div>

          <div className='col-12 col-md-6  row gx-2'>
            <div className='col-6'>

              <button className='col-12 btn btn-warning '
                onClick={() => {
                  getDuplicateAddress()
                }} >جستجو</button>

            </div>
            <AddDuplicateAddress
              onClose={() => {
                getDuplicateAddress()
              }}
            >
              <div className='col-6'>

                <button className='col-12 btn btn-success '
                  onClick={() => {
                  }} >افزودن مورد جدید +</button>
              </div>

            </AddDuplicateAddress>

          </div>

        </div>
        <div className='position-sticky bottom-0 overflow-y-auto overflow-x-hidden a-scroll g-2 row'>

          {duplicateAddresses?.map((item, index) => {
            return <div className="col-12 " key={index} >

              <div className="card ">
                <div className=" d-flex flex-row p-0 m-0 align-items-center position-relative">
                  <div className="ms-auto px-3">


                    <h3 className="iranSansBold mt-2 col-12">{item?.streetName}</h3>
                    <h4 className="col-12 opacity-75">{item?.zoneName} </h4>
                    <div className="">

                      {/* <AddDuplicateAddress
                        item={item}
                        onClose={() => {
                          getDuplicateAddress()
                        }}>
                        <button className="btn btn-outline-primary">
                          <MdEdit className="ms-2"
                          />
                          ویرایش
                        </button>

                      </AddDuplicateAddress> */}
                      <button className="btn btn-outline-danger mx-2" onClick={() => {
                        removeDuplicateAddress(item?.id)
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


