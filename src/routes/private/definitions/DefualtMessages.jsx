import React, { useState, useEffect } from "react";
import endpoints from "../../../app/endpoints";
import { CgClose,  CgMathPlus } from 'react-icons/cg'
import toast from "../../../components/toast";
import { AxiosPrivate } from "../../../app/axiosPrivate";
import Nav from 'react-bootstrap/Nav';
import loaderModal from "../../../modals/loaderModal";
import ProgressBar from "../../../components/ProgressBar";
import AddDefMsgModal from "../../../modals/AddDefMsg";

export default function DefaultMessages() {
  const [activeTab, setActiveTab] = useState(2); // تنظیم وضعیت تب فعال
  return (
    <>
      <div className="overflow-auto h-100  hideScroll " dir="rtl" >
        <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)} className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={1}><h4 className="iranSansBold px-5">راننده</h4></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={2}><h4 className="iranSansBold px-5">مشتری</h4></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={3}><h4 className="iranSansBold px-5">اپراتور</h4></Nav.Link>
          </Nav.Item>
        </Nav>
        <DefMsg type={activeTab} />
      </div>
    </>
  );
}


const DefMsg = (props) => {
  var [defMsgs, setDefMsgs] = useState([])
  var [loading, setLoading] = useState(true)

  var addDefMsg = (msg, tripStatus) => {
    var loader = loaderModal.load()
    console.log(tripStatus)
    AxiosPrivate.post(endpoints.defMsg, {
      msg,
      msgType: props.type,
      tripStatus
    }).then((res) => {
      toast.Success(res.data.msg)
      getDefMsgs()
    }).finally(() => {
      loaderModal.close(loader)
    })
  }
  var deleteDefMsg = (id) => {
    var loader = loaderModal.load()
    AxiosPrivate.delete(endpoints.defMsg, {
      data: {
        id
      }
    }).then((res) => {
      toast.Success(res.data.msg)
      getDefMsgs()
    }).finally(() => {
      loaderModal.close(loader)
    })
  }

  useEffect(() => {
    console.log(props.type)
    getDefMsgs()
  }, [props?.type])


  var getDefMsgs = () => {
    setLoading(true)
    AxiosPrivate.get(endpoints.defMsg, {
      params: {
        msgType: props.type
      }
    }).then(res => {
      setDefMsgs(res?.data)
    }).finally(() => {
      setLoading(false)

    })
  }

  return <div className="bg-white row g-2  p-0 m-0 p-2 p-md-5">


    {loading ?
      <ProgressBar /> :
      <>{
        defMsgs.map((item, index) => {
          return <div key={index} className="col-6 " >
            <div className="card" title={item.name}>
              <div className="d-flex justify-content-center align-items-center p-2">
                <div>
                  <h4 className="iranSansBold  m-0 p-0 text-truncate" >{item.msg}</h4>
                  <p className=" m-0 p-0 text-truncate opacity-50" >{
                    item?.tripStatus
                  }</p>
                </div>

                <CgClose className="aPointer text-danger card-hover me-auto" size={30} onClick={() => {
                  deleteDefMsg(item.id)
                }} />
              </div>
            </div>
          </div>
        })

      }
        <div className="col-6 " >
          <AddDefMsgModal onClose={(msg, tripStatus) => addDefMsg(msg, tripStatus)}>
            <div className={"btn  w-100 aPointer  p-0   btn-success"}>
              <div className="d-flex justify-content-center align-items-center p-3">
                <p className={"iranSansBold text-center text-white m-0 text-truncate"}>افزودن مورد جدید</p>
                <CgMathPlus className="me-auto  text-white " size={30} />
              </div>
            </div>
          </AddDefMsgModal>
        </div>
      </>
    }


  </div>;
}