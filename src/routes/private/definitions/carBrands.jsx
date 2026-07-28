import React, { useEffect, useState } from "react";
import { CgClose } from 'react-icons/cg'
import toast from "../../../components/toast";

export default  function CarBrands() {

  var [carBrands, setCarBrands] = useState([]);
  var getCarBrands = () => {
    setCarBrands([
      { title: 'پیکان', id: 1 }
      , { title: 'پراید', id: 2 }
      , { title: 'پژو ', id: 3 }
      , { title: 'سمند', id: 4 }
      , { title: 'ون', id: 5 }
    ])
  }

  useEffect(() => {
    getCarBrands()
  }, [])
  return (
    <>
      <div className="container overflow-hidden" dir="rtl" >
        <div className="row g-2 ">
          {carBrands.map((item, index) => {
            return <div className="col-12 col-sm-6 col-md-4 col-lg-3  " key={index} >
              <div className="card d-flex py-2 flex-row justify-content-center align-items-center">
                <h2 className="text-center  w-100">{item.title}</h2>
                <CgClose className="text-danger aPointer mx-2" size={25} onClick={() => {
                  toast.Error('با موفقیت حذف شد')
                }} />
              </div>
            </div>


          })}
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 aPointer  " onClick={() => {
            toast.Success('با موفقیت افزوده شد')
          }}>
            <div className="card d-flex py-2 flex-row justify-content-center align-items-center bg-warning">
              <h2 className="text-center  w-100">افزودن نوع جدید</h2>

            </div>
          </div>
        </div>
      </div>

    </>
  );
}


