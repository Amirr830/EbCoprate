import React, { useContext, useEffect, useRef, useState } from "react";
import { AxiosPrivate } from '../../../app/axiosPrivate';
import endpoints from "../../../app/endpoints";
import CardLabel from "../../../components/customeTag/cardLabel";
import CheckBox from "../../../components/customeTag/checkBox";
import noPic from "./../../../assets/drawable/no_pic.png"
import expired from "./../../../assets/drawable/expired.png"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { MdDateRange } from "react-icons/md";
import Icon from "react-multi-date-picker/components/icon"
import "react-multi-date-picker/styles/layouts/mobile.css"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { addDate } from "../../../helper/dateHelper";
import dashboardContext from "../../../contexts/dashboardContext";
import toast from "../../../components/toast";
import loaderModal from "../../../modals/loaderModal";
import answerModal from "../../../modals/answerModal";
import { FaPlus } from "react-icons/fa6";

export default function News(props) {
  var [news, setNews] = useState([])

  var getNews = (reset) => {
    AxiosPrivate.get(endpoints.news, {
      params: { offset: reset ? 0 : news.length }
    })
      .then(res => {
        setLoadLastRecord((res.data.length == 0 ? true : false))
        if (reset) {
          setNews(res.data)
        } else {
          setNews([...news, ...res.data])
        }
      }).finally(() => {
        setLoading(false)
      })
  }

  var addNews = () => {
    var loader = loaderModal.load()
    AxiosPrivate.post(endpoints.news, params).then(res => {
      if (res?.data?.status == 1) {
        toast.Success(res?.data?.msg)
        setNewsCode(undefined)
        setParams(initParams)
      }
    }).finally(() => {
      loaderModal.close(loader);
      getNews(true)
    })
  }
  var updateNews = () => {
    var loader = loaderModal.load()
    AxiosPrivate.put(endpoints.news, params).then(res => {
      if (res?.data?.status == 1) {
        toast.Success(res?.data?.msg)
        setNewsCode(undefined)
        setParams(initParams)
      }
    }).finally(() => {
      loaderModal.close(loader);
      getNews(true)

    })
  }
  var deleteNews = () => {
    answerModal.show("آیا این خبر حذف شود؟", () => {
      var loader = loaderModal.load()
      AxiosPrivate.delete(endpoints.news, { data: params }).then(res => {
        if (res?.data?.status == 1) {
          toast.Success(res?.data?.msg)
          setNewsCode(undefined)
          setParams(initParams)
        }
      }).finally(() => {
        loaderModal.close(loader);

        getNews(true)
      })
    }, () => { })
  }

  var initParams = {
    id: '',
    title: '',
    content: '',
    picUrl: '',
    webLinkUrl: '',
    startDate: new Date(),
    endDate: addDate(new Date(), 1000 * 60 * 60 * 24),
    forDrivers: '',
    forOperators: '',
    forCustomers: '',
    priority: 1,
    insertUser: '',
    insertDate: '',
    editUser: '',
    editDate: '',
    startCode: 1,
    endCode: 999999,
  }
  var [params, setParams] = useState(initParams)
  var [newsCode, setNewsCode] = useState(undefined)

  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    setParams({
      ...params,
      [name]: value
    })
  }

  var onCheckChangeType = (e) => {
    var checked = e.target.checked
    var name = e.target.name
    setParams({
      ...params,
      forDrivers: 0,
      forCustomers: 0,
      forOperators: 0,
      [name]: checked ? 1 : 0
    })
  }

  var onCheckChange = (e) => {
    var checked = e.target.checked
    var name = e.target.name
    setParams({
      ...params,
      [name]: checked ? 1 : 2
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

  var divScrollRef = useRef()

  var [isLoadLastRecord, setLoadLastRecord] = useState(false);

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

  var [isLoad, setLoading] = useState(true)

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
      getNews(false)
    }
  }, [isLoad])
  var [showAdd, setShowAdd] = useState(false);

  return (
    <>

      <div className="position-relative overflow-hidden  h-100" dir="rtl">

        <div className={"position-absolute  col-12 col-lg-4 end-0 card overflow-y-auto  top-0 bottom-0 aScroll" + (showAdd ? " d-block" : " d-none d-lg-block")} style={{ backgroundColor: '#F5F5F5' }}>
          <div className="row p-4 g-2 ">

            <CardLabel className="col-12"
              label="دریافت کنندگان">

              <div className="row">
                <CheckBox className="col-4" title="راننده" checked={params?.forDrivers == 1} name="forDrivers" onChange={onCheckChangeType} />
                <CheckBox className="col-4" title="مشتری" checked={params?.forCustomers == 1} name="forCustomers" onChange={onCheckChangeType} />
                <CheckBox className="col-4" title="اپراتور" checked={params?.forOperators == 1} name="forOperators" onChange={onCheckChangeType} />
              </div>
            </CardLabel>

            <div className="p-1 position-relative card">
              <DatePicker
                format="از dddd DD MMMM YYYY ساعت HH:mm"
                className="rmdp-mobile"
                render={(value, openCalendar) => {
                  return <div className=" aPointer " onClick={openCalendar}>
                    <div className="d-flex p-2">
                      <MdDateRange size="25" />
                      <span className="iranSansBold small noSelect me-3">{value}</span>
                    </div>
                  </div>
                }}
                plugins={[
                  <TimePicker position="bottom"
                    hideSeconds
                  />
                ]}
                onChange={(date) => {
                  console.log(date)
                  if (date)
                    setParams({
                      ...params,
                      startDate: new Date(date.unix * 1000)
                    })
                }}
                value={params?.startDate || ''}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-left"
              />
            </div>

            <div className="p-1 position-relative card">
              <DatePicker
                className="rmdp-mobile"
                format="تا dddd DD MMMM YYYY ساعت HH:mm"
                minDate={params?.startDate}
                render={(value, openCalendar) => {
                  console.log(value)
                  return <div className=" aPointer " onClick={openCalendar}>
                    <div className="d-flex p-2">
                      <MdDateRange size="25" />
                      <span className="iranSansBold small noSelect me-3">{value}</span>
                    </div>
                  </div>
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
                      endDate: new Date(date.unix * 1000)
                    })
                }}
                value={params?.endDate || ''}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-left"
              />
            </div>

            {console.log('ssss', params)}
            <div className='col-6'>
              <input type="text"
                className=" form-control text-primary"
                placeholder="از کد "
                value={params?.startCode}
                name="startCode"
                onChange={readChange}
                onKeyDown={handleEnter} />
            </div>

            <div className='col-6'>
              <input type="text"
                className=" form-control text-primary"
                placeholder="تا کد"
                value={params?.endCode}
                name="endCode"
                onChange={readChange}
                onKeyDown={handleEnter} />
            </div>

            <div className='col-12'>

              <input type="text"
                className=" form-control text-primary"
                placeholder="عنوان"
                name="title"
                value={params?.title}
                onChange={readChange}
                onKeyDown={handleEnter} />
            </div>

            <div className='col-12 '>

              <textarea
                className=" form-control text-primary"
                placeholder="متن"
                name="content"
                value={params?.content}
                rows="5"
                onChange={readChange}
                onKeyDown={handleEnter} />

            </div>

            <div className='col-12 '>
              <CheckBox title="نمایش در بدو ورود به برنامه" checked={params?.priority == 1} name="priority" onChange={onCheckChange} />
            </div>

            <div className='col-12'>

              <input type="text"
                className=" form-control text-primary"
                placeholder="لینک تصویر"
                name="picUrl"
                value={params?.picUrl}

                onChange={readChange}
                onKeyDown={handleEnter} />
            </div>

            <div className='col-12'>

              <input type="text"
                className=" form-control text-primary"
                placeholder="لینک ارجاع"
                name="webLinkUrl"
                value={params?.webLinkUrl}

                onChange={readChange}
                onKeyDown={handleEnter} />
            </div>
            {newsCode ?

              <div className='col-12 mt-4 row g-2 '>
                <div className="col-4">
                  <button className=" btn btn-danger w-100" onClick={() => {
                    deleteNews()
                    setShowAdd(!showAdd)
                  }}>حذف</button>
                </div>
                <div className="col-4">
                  <button className=" btn btn-primary w-100" onClick={() => {
                    updateNews()
                    setShowAdd(!showAdd)
                  }} >ویرایش</button>
                </div>
                <div className="col-4">
                  <button className=" btn btn-warning w-100 " onClick={() => {
                    setNewsCode(undefined)
                    setParams(initParams)
                    setShowAdd(!showAdd)
                  }} >انصراف</button>
                </div>


              </div>
              :
              <div className='col-12 mt-4 row g-2'>

                <div className="col-6 col-lg-12">

                  <button className=" btn btn-success col-12" onClick={() => {
                    console.log(params)
                    addNews()
                    setShowAdd(!showAdd)
                  }} >افزودن</button>
                </div>
                <div className="col-6 d-block d-lg-none">

                  <button className=" btn btn-warning  col-12" onClick={() => {

                    setShowAdd(!showAdd)
                  }} >انصراف</button>
                </div>

              </div>}

          </div>
        </div>

        <div className={"row g-2 position-absolute start-0 top-0 bottom-0  col-12 col-lg-8 overflow-y-auto aScroll" + (showAdd ? " d-none d-lg-block" : " d-block")} ref={divScrollRef}>
          <button className="btn btn-success position-sticky top-0 d-block d-lg-none" style={{ zIndex: "1000" }} onClick={() => {
            setShowAdd(!showAdd)
          }}>
            <FaPlus /> افزودن
          </button>
          {
            news.map((item, index) => {
              return <div>
                <div key={index} className="card p-0 m-0 card-hover" onClick={() => {
                  setNewsCode(item?.id);
                  setParams(item)
                  setShowAdd(!showAdd)
                }}>
                  <div className="d-flex row p-0 m-0 position-relative ">
                    {item.isExpire == 1 ?
                      <img className="m-0 p-0  position-absolute opacity-75"
                        style={{ maxHeight: '7rem', maxWidth: '7rem', rotate: '60deg' }}
                        src={expired} /> : <></>}

                    <img className="m-0 p-0  rounded col-12 col-md-3 "
                      style={{ maxHeight: '10rem', objectFit: 'cover' }}
                      src={item.picUrl ? item.picUrl : noPic} />

                    <div className="col-12 col-md-9 p-2 "  >
                      <div className="row ">
                        <div className="col-12 d-flex">
                          <h4 className="iranSansBold">{item?.title}</h4>
                          <label className=" me-auto "></label>
                          {item?.forOperators == 1 ? <label className="card small p-0 m-0 px-2 text-center mx-1 text-white opacity-75 iranSansBold bg-primary" style={{ height: '1.8rem' }}>اپراتور</label> : <></>}
                          {item?.forDrivers == 1 ? <label className="card small p-0 m-0 px-2 text-center mx-1 text-white opacity-75 iranSansBold bg-danger" style={{ height: '1.8rem' }}>راننده</label> : <></>}
                          {item?.forCustomers == 1 ? <label className="card small p-0 m-0 px-2 text-center mx-1 text-white opacity-75 iranSansBold bg-success" style={{ height: '1.8rem' }}>مسافر</label> : <></>}

                        </div>
                        <p className=" col-12 ">{item?.content}</p>
                        {item.webLinkUrl ?
                          <a className="aPointer text-hover text-start  position-absolute bottom-0 start-0 w-auto" target="_blank" href={item.webLinkUrl}>توضیحات بیشتر</a>
                          : <></>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })
          }
          {(isLoad && !isLoadLastRecord) ?
            <div className='justify-content-center d-flex py-5' >
              <div className="spinner-border" role="status" />
            </div> : <></>
          }

          <div style={{ height: '5rem' }} />

        </div>

      </div>
    </>
  );
}
