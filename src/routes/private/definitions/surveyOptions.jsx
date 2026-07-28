import React, { useState, useEffect } from "react";
import endpoints from "../../../app/endpoints";

import { CgClose, CgMathPlus } from 'react-icons/cg'
import toast from "../../../components/toast";

import { AxiosPrivate } from "../../../app/axiosPrivate";
import answerModal from "../../../modals/answerModal";

import Nav from 'react-bootstrap/Nav';
import { MdEdit } from "react-icons/md";
import AddSurveyOption from "../../../modals/AddSurveyOption";
import loaderModal from "../../../modals/loaderModal";
import ProgressBar from "../../../components/ProgressBar";
import { MdArchive, MdUnarchive } from "react-icons/md";
import CheckBox from "../../../components/customeTag/checkBox";

export default function SurveyOptions() {
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


  const [activeTab, setActiveTab] = useState(2); // تنظیم وضعیت تب فعال

  // کامپوننت‌های مربوط به هر تب
  const renderTabContent = () => {
    switch (activeTab) {
      case 'positive':
        return <Options type="2" />;
      case 'negative':
        return <Options type="1" />;
      default:
        return <Options type="2" />;
    }
  };

  return (
    <>
      <div className="overflow-auto h-100  hideScroll" dir="rtl" >
        <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)} className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={2}><h4 className="iranSansBold px-5">نکات مثبت</h4></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={1}><h4 className="iranSansBold px-5">نکات منفی</h4></Nav.Link>
          </Nav.Item>
        </Nav>
        <Options type={activeTab} />


      </div>
    </>
  );
}


const Options = (props) => {
  var [options, setOptions] = useState([])
  var [loading, setLoading] = useState(true)

  var addOption = (name, id) => {
    var loader = loaderModal.load()
    AxiosPrivate.put(endpoints.surveyOptions, {
      name,
      id,
      type: props.type
    }).then((res) => {
      toast.Success(res.data.msg)
      getOptions()
    }).finally(() => {
      loaderModal.close(loader)
    })
  }
  var archiveOption = (id) => {
    var loader = loaderModal.load()
    AxiosPrivate.delete(endpoints.surveyOptions, {
      data: {
        id
      }
    }).then((res) => {
      toast.Success(res.data.msg)
      getOptions()
    }).finally(() => {
      loaderModal.close(loader)
    })
  }

  useEffect(() => {
    console.log(props.type)
    getOptions()
  }, [props?.type])


  var getOptions = () => {
    setLoading(true)
    AxiosPrivate.get(endpoints.surveyOptions, {
      params: {
        type: props.type
      }
    }).then(res => {
      setOptions(res?.data)
    }).finally(() => {
      setLoading(false)

    })
  }
  var [showArchiveEnable, setShowArchiveEnable] = useState(false)

  return <div className="bg-white row g-2  p-0 m-0 p-2 p-md-5">


    {loading ?
      <ProgressBar /> :
      <>{
        options.map((item, index) => {
          if (showArchiveEnable || (!showArchiveEnable && item.isArchive == 0)) {
            return <div key={index} className="col-6 " >
              <div className="card" title={item.name}>
                <div className="d-flex justify-content-center align-items-center p-3">
                  <p className="iranSansBold text-center m-0  text-truncate" >{item.name}</p>
                  {
                    item?.isArchive == 1 ? <>
                      <MdUnarchive className="aPointer text-primary card-hover me-auto" size={30} onClick={() => {
                        addOption(item?.name, item?.id)
                      }} />
                    </> : <>
                      <AddSurveyOption params={item} onClose={(name) => addOption(name, item?.id)}>
                        <MdEdit className="aPointer  me-auto card-hover mx-2" size={30} />
                      </AddSurveyOption >
                      <MdArchive className="aPointer text-danger card-hover" size={30} onClick={() => {
                        archiveOption(item.id)
                      }} />
                    </>
                  }

                </div>
              </div>
            </div>
          }

        })

      }
        <div className="col-6 " >
          <AddSurveyOption onClose={(name) => addOption(name, null)}>
            <div className={"btn  w-100 aPointer  p-0 " + (props.type == 2 ? " btn-success" : " btn-danger")}>
              <div className="d-flex justify-content-center align-items-center p-3">
                <p className={"iranSansBold text-center text-white m-0 text-truncate"}>افزودن مورد جدید</p>
                <CgMathPlus className="me-auto  text-white " size={30} />
              </div>
            </div>
          </AddSurveyOption>

        </div>
        <CheckBox
          title="گزینه های ارشیو شده نمایش داده شود"
          className="mt-5"
          checked={showArchiveEnable} onChange={(e) => {
            setShowArchiveEnable(e.target.checked)
          }} />
      </>
    }


  </div>;
}