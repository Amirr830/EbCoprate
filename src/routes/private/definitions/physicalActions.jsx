import React, { useEffect, useState } from "react";
import { AxiosPrivate } from "../../../app/axiosPrivate";
import endpoints from "../../../app/endpoints";
import PhysicalActionModal from "../../../modals/physicalActionModal";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "../../../components/toast";

export default function PhysicalActions() {

  var [phAct, setPhAct] = useState([])
  useEffect(() => {
    getPhysicalActions()
  }, [])

  var getPhysicalActions = () => {
    AxiosPrivate.get(endpoints.physicalAction, { params: { stCode: 0 } })
      .then((res) => {
        setPhAct(res?.data)
      })
  }

  var deletePhysicalAction = (actionCode) => {
    AxiosPrivate.delete(endpoints.physicalAction, { data: { actionCode } })
      .then((res) => {
        getPhysicalActions()
      })
  }




  return (
    <>
      <div className="row g-2 mt-3">
        {
          phAct.map((item, index) => {
            return <div className="col-3 " key={index}
            >
              <div className="card  p-2 " style={{ height: '7rem' }}>
                <div className="d-flex col-12">

                  <h3 className="iranSansBold text-primary text-truncate">{item?.title}</h3>
                  <IoMdCloseCircleOutline className="me-auto aPointer text-hover " size={30}
                    onClick={() => {
                      deletePhysicalAction(item?.actionCode)
                    }}
                  />
                </div>
                <p className="m-0 p-0 text-truncate col-12" >{item?.stCode} - {item?.stName}</p>
                <label className="text-truncate opacity-50 col-12 text-end aPointer"
                  dir="ltr"
                  title={item?.actionUrl}
                  onClick={(e) => {
                    navigator.clipboard.writeText(item?.actionUrl);
                    toast.Info("آدرس کپی شد")
                  }}>{item?.actionUrl}</label>
              </div>
            </div>
          })
        }

        <PhysicalActionModal onClose={() => {
          getPhysicalActions();
        }}>
          <div className="col-3 ">
            <button className="btn  btn-primary col-12  p-2 text-center " style={{ height: '7rem' }}>
              <h4 className="iranSansBold">تعریف عملیات جدید + </h4>
            </button>
          </div>

        </PhysicalActionModal>

      </div >
    </>

  );
}

