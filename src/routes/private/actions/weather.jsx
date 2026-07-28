import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { IoMdArchive } from "react-icons/io";

import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { AxiosPrivate } from "../../../app/axiosPrivate";
import endpoints from "../../../app/endpoints";
import loaderModal from "../../../modals/loaderModal";
import toast from "../../../components/toast";
import CheckBox from "../../../components/customeTag/checkBox";
import { yyyymmddhhmm } from "../../../helper/dateHelper";
import answerModal from "../../../modals/answerModal";
export default function Weather() {
  var [params, setParams] = useState()
  const navigate = useNavigate();



  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    console.log(name, value)
    setParams({
      ...params,
      [name]: value
    })
  }

  var readCheckChange = (e) => {
    var name = e.target.name
    setParams({
      ...params,
      grade: name
    })
  }


  const handleEnter = (event) => {
    if (event.key.toLowerCase() == "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };


  var [weCo, setWeCo] = useState([])


  var getWeCo = (reset) => {
    AxiosPrivate.get(endpoints.weatherCondition, {
      params: { offset: reset ? 0 : weCo.length }
    })
      .then(res => {
        setLoadLastRecord((res.data.length == 0 ? true : false))
        if (reset) {
          setWeCo(res.data)
        } else {
          setWeCo([...weCo, ...res.data])
        }
      }).finally(() => {
        setLoading(false)
      })
  }

  var initParams = {
    startStCode: '',
    endStCode: '',
    startTime: undefined,
    archiveTime: undefined,
    grade: 0
  }

  var addWeCo = () => {
    var loader = loaderModal.load()
    AxiosPrivate.post(endpoints.weatherCondition, params)
      .then(res => {
        if (res?.data?.status == 1) {
          toast.Success(res?.data?.msg)
          setWeCo(undefined)
          setParams(initParams)
        }
      }).finally(() => {
        loaderModal.close(loader);
        getWeCo(true)
      })
  }

  var archiveWeCo = (wId) => {
    var loader = loaderModal.load()
    AxiosPrivate.put(endpoints.weatherCondition, { wId })
      .then(res => {
        if (res?.data?.status == 1) {
          toast.Success(res?.data?.msg)
        } else {
          toast.Error(res?.data?.msg)
        }
      }).finally(() => {
        loaderModal.close(loader);
        getWeCo(true)

      })
  }

  var divScrollRef = useRef()

  var [isLoadLastRecord, setLoadLastRecord] = useState(false);
  var [isLoad, setLoading] = useState(true)

  useEffect(() => {
    var infiniteScroll = divScrollRef.current
    if (infiniteScroll) {
      infiniteScroll.addEventListener("scroll", onScroll);
      // Clean-up
      return () => {
        infiniteScroll.removeEventListener("scroll", onScroll);
      };
    }
  }, [])


  const onScroll = () => {

    if (divScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = divScrollRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

      if (isNearBottom) {
        console.log("Reached bottom", isLoadLastRecord);
        // DO SOMETHING HERE
        setLoading(true)
      }
    }
  };

  useEffect(() => {
    if (isLoad && !isLoadLastRecord) {
      getWeCo(false)
    }
  }, [isLoad])
  return (
    <>

      <div>

        <div className="col-12 row g-2" >
          <div className='col-6 col-md-3 col-lg-3 d-flex justify-content-center align-items-center'>
            <input type="number"
              className="form-control col"
              placeholder="از ایستگاه"
              name="fromStCode"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>
          <div className='col-6 col-md-3 col-lg-3 d-flex justify-content-center align-items-center'>

            <input type="number"
              className="form-control col"
              placeholder="تا ایستگاه"
              name="toStCode"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>
          <div className='col-6 col-md-3 col-lg-3 d-flex overflow-hidden align-items-center '>
            <DatePicker
              format="YYYY/MM/DD HH:mm"
              inputClass='form-control '
              placeholder="از ساعت"
              className="rmdp-mobile"
              containerStyle={{
                width: "100%"
              }}
              plugins={[
                <TimePicker position="bottom"
                  hideSeconds
                />
              ]}
              onChange={(date) => {
                if (date)
                  setParams({
                    ...params,
                    startTime: new Date(date.unix * 1000)
                  })
              }}
              value={params?.startTime || ''}
              calendar={persian}
              locale={persian_fa}
            />
          </div>
          <div className='col-6 col-md-3 col-lg-3 d-flex overflow-hidden align-items-center'>
            <DatePicker
              format="YYYY/MM/DD HH:mm"
              className="rmdp-mobile"

              placeholder="تا ساعت"
              inputClass='form-control'
              containerStyle={{
                width: "100%"
              }}
              plugins={[
                <TimePicker position="bottom"
                  hideSeconds
                />
              ]}
              onChange={(date) => {
                if (date)
                  setParams({
                    ...params,
                    archiveTime: new Date(date.unix * 1000)
                  })
              }}
              value={params?.archiveTime || ''}
              calendar={persian}
              locale={persian_fa}
            />
          </div>
          <div className='col-12 col-lg-3 d-flex justify-content-center align-items-center' >
            <div className="card w-100 ">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '2.2rem' }}>
                <CheckBox title="وضعیت نارنجی" onChange={readCheckChange} checked={params?.grade == 1} name="1" />
                <CheckBox title="وضعیت قرمز" onChange={readCheckChange} checked={params?.grade == 2} name="2" />
              </div>
            </div>
          </div>

          <div className='col-12 col-lg-9 d-flex justify-content-center align-items-center'>
            <input type="text"
              className="form-control col"
              placeholder="توضیحات"
              name="desc"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>
          <button className="btn btn-primary col-12 me-auto" onClick={(e) => {
            addWeCo()
          }}>افزودن</button>
        </div>


        <div className="row g-2 overflow-y-auto aScroll mt-3" ref={divScrollRef}>
          {
            weCo?.map((item, index) => {
              return <div key={index}>
                <div className="card ">
                  <div className="d-flex align-items-center ">
                    <div className="row g-1 p-2 align-items-center w-100 justify-content-center">
                      <h5 className="col-12 col-lg-3 iranSansBold  p-0 m-0">{item?.desc}</h5>

                      <div className="col-6 col-md-4 col-lg-3">
                        <p className="p-0 m-0 iranSansBold small "><span className="opacity-50 " style={{ width: '6rem' }} >از : </span> {yyyymmddhhmm(item?.startTime)}</p>
                        <p className="p-0 m-0 iranSansBold small"><span className="opacity-50 " style={{ width: '6rem' }} >تا : </span>  {yyyymmddhhmm(item?.archiveTime)}</p>
                      </div>
                      <div className="col-6 col-md-4 col-lg-3">
                        <p className="p-0 m-0 iranSansBold small"><span className="opacity-50 " style={{ width: '6rem' }} >از ایستگاه : </span>{item?.fromStCode}</p>
                        <p className="p-0 m-0 iranSansBold small"><span className="opacity-50 " style={{ width: '6rem' }} >تا ایستگاه : </span>{item?.toStCode}</p>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <p className="iranSansBold small text-danger p-0 m-0">{item?.grade == 1 ? "وضعیت نارنجی" : "وضعیت قرمز"}</p>
                      </div>
                    </div>
                    <IoMdArchive className="text-danger aPointer card-hover w-auto mx-2" size={30} onClick={(e) => {
                      answerModal.show("آیا این وضعیت آرشیو شود؟", () => {
                        archiveWeCo(item?.wId)

                      })
                    }} />
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>

    </>
  );
}



