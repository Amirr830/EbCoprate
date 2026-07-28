import React, { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { AxiosPrivate } from "../../../app/axiosPrivate";
import endpoints from "../../../app/endpoints";
import dashboardContext from "../../../contexts/dashboardContext";
import { yyyymmdd } from "../../../helper/dateHelper";
import { setComma } from "../../../helper/numberHelper";
import Input from "../../../components/customeTag/input";
import AddPayment2Driver from "../../../modals/addPayment2Driver";
import Options from "../../../components/options";
import toast from "../../../components/toast";
import answerModal from "../../../modals/answerModal";

export default function Payment2Driver(props) {
  var [docs, setDocs] = useState([])
  var [params, setParams] = useState()



  useEffect(() => {
    getPaymentList()
  }, [])

  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    setParams({
      ...params,
      [name]: value
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


  var context = useContext(dashboardContext)
  var divScrollRef = useRef()
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

  var [showAddModal, setShowAddModal] = useState(undefined)
  var [isLoad, setLoading] = useState(true)
  var [listCount, setListCount] = useState(0);
  var [sumAmount, setSumAmount] = useState(0);

  const onScroll = () => {

    if (divScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = divScrollRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

      if (isNearBottom) {
        if (listCount > docs.length) {
          console.log("Reached bottom");
          // DO SOMETHING HERE
          setLoading(true)
        }
      }
    }
  };

  useEffect(() => {
    if (docs.length > 50)
      setLoading(false)
    if (isLoad) {
      getPaymentList(false)
    }
  }, [isLoad])

  var getPaymentList = (reset) => {
    AxiosPrivate.get(endpoints.payment2Driver,
      {
        params: {
          offset: reset ? 0 : docs.length,
          ...params
        }
      }).then((res) => {
        setListCount(res.data.listCount)
        setSumAmount(res.data.sumAmount)

        if (reset) {
          setDocs(res.data.list)
        } else {
          setDocs([...docs, ...res.data.list])
        }
      }).finally(() => {
        setLoading(false)
      })

  }
  var deleteTransaction = (mId) => {
    console.log(mId)
    answerModal.show("آیا این رکورد حذف شود؟", () => {
      AxiosPrivate.delete(endpoints.financial, {
        data: {
          mId: mId
        }
      }).then((res) => {
        toast.Success(res?.data?.msg)
        getPaymentList(true)
      })
    }, () => {

    })

  }

  return (
    <>
      <div className=' h-100 d-flex flex-column'>
        <div className="d-flex row g-1">
          <form className="col-12 col-lg-10 p-2">

            <div className="row g-2">

              <div className='col-6 col-md-4 col-lg-3'>
                <input type="text"
                  className=" form-control"
                  placeholder="شماره فیش"
                  name="docNo"
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>

              <div className='col-6 col-md-4 col-lg-3'>
                <Input type="number"
                  className=" form-control"
                  placeholder="کد در خط"
                  name="driverCode"
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>

              <div className='col-6 col-md-4 col-lg-3'>
                <Input type="number"
                  className=" form-control"
                  placeholder="کد خودرویی"
                  name="carCode"
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>



              <div className='col-6 col-md-4 col-lg-3'>
                <Input type="number"
                  className=" form-control"
                  placeholder="کد کاربر ثبت کننده"
                  name="userCode"
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>

              <div className='col-6 col-md-4 col-lg-3'>
                <Input type="number"
                  className=" form-control"
                  placeholder="از مبلغ"
                  name="fromAmount"
                  value={params?.fromAmount}
                  thousandSeparator
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>
              <div className='col-6 col-md-4 col-lg-3'>
                <Input type="number"
                  className=" form-control"
                  placeholder="تا مبلغ"
                  name="toAmount"
                  value={params?.toAmount}
                  thousandSeparator
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>
              <div className='col-6 col-md-4 col-lg-3'>
                <DatePicker
                  inputClass='form-control'
                  containerStyle={{
                    width: "100%"
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  placeholder="از تاریخ"
                  onKeyDown={handleEnter}
                  onChange={(date) => {
                    console.log(date)
                    if (date)
                      setParams({
                        ...params,
                        fromDate: new Date(date.unix * 1000)
                      })
                  }}
                  value={params?.fromDate || ''}
                  calendarPosition="bottom-left"
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3'>
                <DatePicker
                  inputClass='form-control'
                  containerStyle={{
                    width: "100%"
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  placeholder="تا تاریخ"
                  onKeyDown={handleEnter}
                  onChange={(date) => {
                    console.log(date)
                    if (date)
                      setParams({
                        ...params,
                        toDate: new Date(date.unix * 1000)
                      })
                  }}
                  value={params?.toDate || ''}
                  calendarPosition="bottom-left"
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3'>
                <input type="text"
                  className=" form-control"
                  placeholder="شرح"
                  name="desc"
                  onChange={readChange}
                  onKeyDown={handleEnter} />
              </div>

            </div>
          </form>
          <div className="col-12 col-lg-2 p-2 ">
            <div className="row g-2">

              <button className="btn btn-warning" onClick={() => {
                getPaymentList(true)
              }}>
                جستجو
              </button>
              <button className="btn btn-primary " onClick={() => {
                setShowAddModal({})
              }}>
                افزودن
              </button>

            </div>

          </div>
        </div>
        <div className="d-flex pe-2 py-2">
          <label className="iranSansBold opacity-50" >تعداد :</label>
          <label className="ps-5 iranSansBold" >{listCount}</label>
          <label className="iranSansBold opacity-50" >جمع کل : </label>
          <label className="iranSansBold text-primary" >{setComma(sumAmount)} ریال</label>

        </div>
        <div className='position-sticky h-100 bottom-0 overflow-auto a-scroll' ref={divScrollRef}>

          <hr className="p-0 m-0" />
          <div className="d-flex pe-2 position-sticky top-0 bg-light">
            <label className="col-1 bg-light" style={{ width: '5rem' }}>شماره</label>
            <label className="col-1 bg-light" style={{ width: '8rem' }}>مبلغ</label>
            <label className="col-1 bg-light" style={{ width: '6rem' }}>تاریخ ثبت</label>
            <label className="col-1 bg-light" style={{ width: '6rem' }}>تاریخ واریز</label>
            <label className="col-1 bg-light" style={{ width: '8rem' }}>راننده</label>
            <label className="col-1 bg-light" style={{ width: '5rem' }}>کد درخط</label>
            <label className="col-1 bg-light" style={{ width: '25rem' }}>شرح</label>
            <label className="col-1 bg-light" style={{ width: '5rem' }}>کد خودرویی</label>
            <label className="col-1 bg-light" style={{ width: '8rem' }}>پلاک</label>
            <label className="col-1 bg-light" style={{ width: '8rem' }}>کد سفر</label>
            <label className="col-1 bg-light" style={{ width: '8rem' }}>نام کاربر</label>
          </div>
          <div className="d-flex noSelect row g-2" >

            {
              //  (item?.docType == 1 ? '#F8BBD0' : '#C8E6C9')
              docs.map((item, index) => {
                return <>
                  <Options
                    options={
                      <div className="card p-2 col-10 col-md-6 col-lg-4" style={{ maxWidth: '20rem' }}>
                        <span className="text-small iranSansBold text-center py-2   pointer card-hover" onClick={() => {
                          setShowAddModal(item)
                        }}>ویرایش </span>
                        <span className="text-small iranSansBold text-center py-2   pointer card-hover" onClick={() => {
                          deleteTransaction(item?.mId)
                        }}>حذف</span>
                      </div>
                    }>
                    <div key={index} className="overflow-hidden py-2 pe-2 card-danger aPointer"
                      style={{ minWidth: '94rem' }}
                    >
                      <div className="d-flex align-items-center ">
                        <label className="col-1 small iranSansBold" style={{ width: '5rem' }}>{item?.docNo}</label>
                        <label className="col-1 small iranSansBold text-primary" style={{ width: '8rem' }}>{setComma(item?.amount)}</label>
                        <label className="col-1 small" style={{ width: '6rem' }}>{yyyymmdd(item?.saveDate)}</label>
                        <label className="col-1 small" style={{ width: '6rem' }}>{yyyymmdd(item?.transactionDate)}</label>
                        <label className="col-1 small iranSansBold text-truncate" style={{ width: '8rem' }}>{item?.driverName}</label>
                        <label className="col-1 small iranSansBold" style={{ width: '5rem' }}>{item?.driverCode}</label>
                        <label className="col-1 small text-truncate" style={{ width: '25rem' }}>{item?.desc}</label>
                        <label className="col-1 small iranSansBold" style={{ width: '5rem' }}>{item?.carCode}</label>
                        <label className="col-1 small iranSansBold" style={{ width: '8rem' }}>{item?.plaqueStr}</label>
                        <label className="col-1 small iranSansBold" style={{ width: '8rem' }}>{item?.tripCode}</label>
                        <label className="col-1 small iranSansBold" style={{ width: '8rem' }}>{item?.userCode}</label>
                      </div>
                    </div>
                  </Options>

                </>
              })
            }
          </div>
          {isLoad ?
            <div className='justify-content-center d-flex py-5' >
              <div className="spinner-border" role="status" />
            </div> : <></>
          }
        </div>

      </div >

      <AddPayment2Driver
        show={showAddModal}
        onClose={() => {
          setShowAddModal(undefined)
          getPaymentList(true)
        }} />



    </>
  );
}
