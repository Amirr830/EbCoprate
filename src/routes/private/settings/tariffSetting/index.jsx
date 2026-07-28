import { padding } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Form, Row, Table } from "react-bootstrap";
import { BsPersonLinesFill, BsTaxiFrontFill } from 'react-icons/bs'
import { FaHourglassEnd } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import { AxiosPrivate } from "app/axiosPrivate";
import Input from "components/customeTag/input";
import { setComma } from "helper/numberHelper";
import endpoints from "app/endpoints";
import PersonCard from "components/personCard";
import answerModal from "modals/answerModal";
import { IoClose } from "react-icons/io5";
import toast from "components/toast";
import { yyyymmdd } from "helper/dateHelper";
import LinesDropDown from "components/dropdowns/linesDropDown"
import CheckBox from "components/customeTag/checkBox";

import CarClassDropDown from "components/dropdowns/carClassDropDown";
import { MdEdit } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";

import { MdOutlineArchive } from "react-icons/md";

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import CarDegreeDropDown from "components/dropdowns/carDegreeDropDown";
import AddTariff from "./addTariff";

export default function TariffSetting() {
  var [isLoading, setLoading] = useState(false)

  var [tariff, setTariff] = useState([])
  var getTariff = () => {
    setTariff([])
    setLoading(true)
    console.log(params)
    AxiosPrivate.get(endpoints.settingTariffV2, { params: params }).then(res => {
      setTariff(res?.data)
      setLoading(false)

    })
  }

  var handleCheck = (e) => {
    var value = e?.target?.checked ? 1 : 0
    var name = e?.target?.name
    setParams({
      ...params,
      [name]: value
    })
  }

  useEffect(() => {
    getTariff()
  }, [])

  var addTariff = (tariff) => {
    setLoading(true)

    AxiosPrivate.post(endpoints.settingTariffV2, tariff).then(res => {
      getTariff()
    })
  }
  var updateTariff = (tariff) => {
    setLoading(true)

    AxiosPrivate.put(endpoints.settingTariffV2, tariff)
      .then(res => {
        getTariff()
      })
  }
  var deleteTariff = (tariff) => {

    answerModal.show('آیا از آرشیو این تعرفه اطمینان دارید؟', () => {
      setLoading(true)
      AxiosPrivate.delete(endpoints.settingTariffV2, { data: tariff })
        .then(res => {
          toast.Success('با موفقیت حذف گردید')
          getTariff()
        })
    }, () => {

    })

  }
  var [params, setParams] = useState()
  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    setParams({
      ...params,
      [name]: value
    })
  }

  return (
    <>
      <div className='h-100 d-flex flex-column'>
        <div className='row g-2 pb-3' id="2" style={{ backgroundColor: '#ECEFF1' }}>

          <form className='row col-12 col-md-10 g-2  '>






            <div className='col-6  col-lg-3 d-flex'>
              <label className='px-2'>کلاس : </label>
              <div className='col'>
                <CarClassDropDown
                  name="classCode"
                  onChange={readChange}
                  value={params?.classCode}
                />
              </div>
            </div>
            <div className='col-6  col-lg-3 d-flex'>
              <label className='px-2'>درجه : </label>
              <div className='col'>
                <CarDegreeDropDown
                  name="degree"
                  onChange={readChange}
                  value={params?.degree}
                />
              </div>
            </div>
            <div className='col-6 col-lg-3 d-flex'>
              <label className='px-2'>خط : </label>
              <div className='col'>
                <LinesDropDown
                  name="lineCode"
                  onChange={readChange}
                  value={params?.lineCode}
                />
              </div>
            </div>

            <div className='col-6  col-lg-3  d-flex'>
              <label className='px-2'>تاریخ: </label>
              <DatePicker
                inputClass='form-control'
                containerStyle={{
                  width: "100%"
                }}
                className="rmdp-mobile"
                format="YYYY/MM/DD"
                calendar={persian}
                locale={persian_fa}
                onChange={(date) => {
                  if (date)
                    date = new Date(date.unix * 1000)
                  else
                    date = undefined
                  setParams(prevState => ({
                    ...prevState,
                    fromTime: date
                  }))
                }}
                placeholder='تاریخ'
                value={params?.fromTime || ''}
                calendarPosition="bottom-left"
              />
            </div>


            <div className='col-12'>
              <CheckBox title="نمایش آرشیو شده ها"
                name="isShowArchive"
                checked={params?.isShowArchive}
                onChange={handleCheck} />
            </div>
          </form>

          <div className='col-12 col-md-2'>
            <button className='col-12 btn btn-warning mt-2'
              onClick={() => {
                getTariff()
              }} >جستجو</button>

            <AddTariff onAcceptPress={addTariff}>
              <button className='col-12 btn btn-success mt-2'>افزودن</button>
            </AddTariff>
          </div>
        </div>
        <div className=' position-sticky h-100 bottom-0  overflow-auto a-scroll' >

          {(isLoading) ?
            <div className='justify-content-center d-flex py-5' >
              <div className="spinner-border" role="status" />
            </div> :
            <table className='col-12 table table-striped table-bordered  table-hover  ' style={{ width: "150rem" }}>
              <thead className='thead-dark position-sticky top-0 table-bordered ' style={{ zIndex: 107 }}>
                <tr>
                  <th
                    className="text-center d-flex justify-content-center "
                    style={{ position: 'sticky', right: 0, top: 0, zIndex: 106 }}
                  >
                    نام تعرفه
                  </th>
                  <th className="text-center" >شرکت</th>
                  <th className="text-center" >نام خط</th>
                  <th className="text-center" >کلاس خودرو</th>
                  <th className="text-center" >درجه خودرو</th>

                  <th className="text-center" >حداقل قیمت روز</th>
                  <th className="text-center" >حداقل قیمت شب</th>
                  <th className="text-center" >مبلغ ورودی</th>
                  <th className="text-center" >مبلغ/km حرکت</th>
                  <th className="text-center" >مبلغ/دقیقه توقف</th>

                  <th className="text-center" >مبلغ/دقیقه حرکت</th>
                  <th className="text-center" >گرد تا</th>
                  <th className="text-center" >حداقل سرعت حرکت</th>
                  <th className="text-center" >از ایستگاه</th>
                  <th className="text-center" >تا ایستگاه</th>

                  <th className="text-center" >شب از</th>
                  <th className="text-center" >شب تا</th>
                  <th className="text-center" >افزایش درصد شب</th>
                  <th className="text-center" >افزایش درصد روز</th>
                  <th className="text-center" >افزایش درصد خاص</th>

                  <th className="text-center d-flex justify-content-center" style={{ position: 'sticky', left: 0, zIndex: 105 }} >
                    شروع  -  پایان
                  </th>
                  {/* <th className="text-center" >خاتمه</th> */}
                </tr>
              </thead>
              <tbody    >

                {

                  tariff?.map((item, index) => {
                    return <tr key={index} className={item?.isArchive == 1 ? "table-danger" : ""} >
                      <td className="d-flex"
                        style={{ position: 'sticky', right: 0, zIndex: 105 }}>
                        <MdOutlineArchive size={25} className="mx-1 text-danger aPointer " title="آرشیو" onClick={() => { deleteTariff(item) }} />
                        <AddTariff item={item} onAcceptPress={updateTariff} onCancel={()=>{}}>
                          <MdEdit size={25} className="mx-1 text-success aPointer" title="ویرایش" />
                        </AddTariff>

                        <AddTariff item={item} onAcceptPress={addTariff} title="رونوشت" onCancel={()=>{}}>
                          <MdContentCopy size={25} className="mx-1 text-dark aPointer" />
                        </AddTariff>
                        <label className="iranSansBold text-end text-primary px-3">{item?.tariffName}</label>
                      </td>
                      <td className="iranSansBold text-center"  >{setComma(item?.companyName)}</td>
                      <td className="iranSansBold text-center text-truncate" >{setComma(item?.lineName)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.className)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.degree)}</td>

                      <td className="iranSansBold text-center"  >{setComma(item?.minPriceDay)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.minPriceNight)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.incomePrice)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.pricePerKM)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.pricePerStopingMin)}</td>

                      <td className="iranSansBold text-center"  >{setComma(item?.pricePerMovingMin)} </td>
                      <td className="iranSansBold text-center"  >{setComma(item?.roundNumber)} </td>
                      <td className="iranSansBold text-center"  >{setComma(item?.maxSpeedStop)} </td>
                      <td className="iranSansBold text-center"  >{setComma(item?.fromSt)} </td>
                      <td className="iranSansBold text-center"  >{setComma(item?.toSt)}</td>
                      
                      <td className="iranSansBold text-center"  >{setComma(item?.nightFrom)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.nightTo)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.nightPercent)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.dayPercent)}</td>
                      <td className="iranSansBold text-center"  >{setComma(item?.specialPercent)}</td>

                      <td className="" style={{ position: 'sticky', left: 0, zIndex: 105 }}>

                        <div className="d-flex">

                          <label className="iranSansBold text-center col m-0 ">
                            {yyyymmdd(item?.startTime)}
                          </label>
                          <label className="iranSansBold text-center mx-2 m-0 ">-</label>
                          <label className="iranSansBold text-center col m-0 ">
                            {yyyymmdd(item?.endTime)}
                          </label>
                        </div>

                      </td>
                      {/* <td className="iranSansBold text-center" style={{ position: 'sticky', left: 0, zIndex: 105 }} >{yyyymmdd(item?.archiveDate)}</td> */}

                    </tr>
                  })
                }
              </tbody>

            </table>
          }
        </div>


      </div>
    </>
  );
}



















