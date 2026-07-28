import React, { useEffect, useState } from "react";
import endpoints from "../../../app/endpoints";
import { AxiosPrivate } from "./../../../app/axiosPrivate"
import Dropdown from 'react-bootstrap/Dropdown';
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import { BsFillLockFill } from 'react-icons/bs'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import toast from "../../../components/toast";
import answerModal from "../../../modals/answerModal";
import loaderModal from "../../../modals/loaderModal";
import CheckBox from "../../../components/customeTag/checkBox";
import { FaCheck } from "react-icons/fa";
import AddLine from "../../../modals/addLineModal";

export default function Lines() {
  var [lines, setLines] = useState([])
  var [lineTypes, setLineTypes] = useState([])
  var getLineTypes = (loader) => {
    AxiosPrivate.get(endpoints.lineType)
      .then((res) => {
        setLineTypes(res?.data)
      })
  }

  var getLines = (loader) => {
    if (!loader)
      var loader = loaderModal.load()
    AxiosPrivate.get(endpoints.line, { params: params })
      .then((res) => {
        setLines(res?.data)
      }).finally(() => {
        loaderModal.close(loader)
      })
  }
  var removeLine = (data) => {
    answerModal.show("آیا از حذف این خط اطمینان دارید؟",
      () => {
        var loader = loaderModal.load()

        AxiosPrivate.delete(endpoints.line, { data: { ...data } })
          .then((res) => {
            toast.Success(res?.data?.msg)
            getLines(loader)
          })
      }
      , () => {

      })

  }


  useEffect(() => {
    getLines()
    getLineTypes()
  }, [])

  var [params, setParams] = useState()
  const handleEnter = (event) => {
    if (event.key.toLowerCase() == "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };
  var onCheckChangeType = (e) => {
    var checked = e.target.checked
    var name = e.target.name
    setParams({
      ...params,
      [name]: checked ? 1 : 0
    })
  }

  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name

    setParams({
      ...params,
      [name]: value
    })
  }
  var [editable, setEditable] = useState(false)

  return (
    <>
      <div className="col-12  h-100 d-flex flex-column">
        <div className=" row g-2" >
          <form className='row col-12 col-lg-10 g-2'>
            <div className='col-6 col-md-4 '>
              <input type="text"
                className="form-control"
                placeholder="کد خط"
                name="lineCode"
                value={params?.lineCode}
                onChange={readChange}
                onKeyDown={handleEnter}
              />

            </div>

            <div className='col-6 col-md-4'>
              <input type="text"
                className="form-control"
                placeholder="نام خط"
                value={params?.lineName}
                name="lineName"
                onChange={readChange}
                onKeyDown={handleEnter}
              />
            </div>



            <div className='col-6 col-md-4 '>
              <select
                className="form-control text-center  px-2"
                onChange={(e) => {
                  setParams(prevState => ({
                    ...prevState,
                    lineType: e.target.value

                  }))
                }}

                value={params?.lineType ? params.lineType : null}
                defaultValue={null}
                name="lineType">
                <option
                  value={null}
                  className="text-end">
                  انتخاب نشده
                </option>
                {lineTypes?.map((item, index) => {
                  return (<option
                    value={item?.typeId}
                    key={index}
                    className="text-end"
                  >
                    {item?.typeId} - {item?.typeName}
                  </option>)
                })}
              </select>


            </div>

            <div className='col-6 col-md-4 '>
              <CheckBox title="اپ راننده فعال باشد"
                name="activeDriverLogin"
                checked={params?.activeDriverLogin == 1}

                onChange={onCheckChangeType} />

            </div>
            <div className='col-6 col-md-4 '>
              <CheckBox title="سفر دربستی فعال باشد"
                name="closeTripEnable"
                checked={params?.closeTripEnable == 1}

                onChange={onCheckChangeType} />

            </div>
            <div className='col-6 col-md-4'>
              <CheckBox title="ثبت ایستگاه فعال باشد"
                name="workInStationEnable"
                checked={params?.workInStationEnable == 1}
                onChange={onCheckChangeType} />

            </div>
            <div className='col-6 col-md-4'>
              <CheckBox title="سفر تلفنی فعال باشد"
                name="telServiceEnable"
                checked={params?.telServiceEnable}
                onChange={onCheckChangeType} />

            </div>
            <div className='col-6 col-md-4 '>
              <CheckBox title="تاکسیمتر اشتراکی فعال باشد"
                name="shareTripEnable"
                checked={params?.shareTripEnable}
                onChange={onCheckChangeType} />
            </div>
          </form>
          <div className='col-12 col-lg-2 row g-2'>
            <div>

              <button className="btn btn-primary w-100  h-auto" onClick={() => { getLines() }}> جستجو</button>
              <AddLine
                lineTypes={lineTypes}
                afterClose={() => {
                  getLines()
                }}>
                <button className="btn btn-success w-100 mt-2 h-auto" > افزودن خط جدید</button>
              </AddLine>

            </div>

          </div>
        </div>
        <LineCardHeader />

        <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll' >
          {
            lines.map((item, index) => {
              return <LineCard
                data={item}
                lineTypes={lineTypes}
                afterClose={() => {
                  getLines()
                }}
                onRemove={(data) => {
                  removeLine(data)
                }} />
            })
          }
        </div>
      </div>

    </>
  );
}




function LineCard(props) {
  var [showDD, setShowDD] = useState(false)

  const showDropdown = (e) => {
    setShowDD(!showDD);
  }
  const hideDropdown = e => {
    setShowDD(false);
  }
  return (
    <div className='card p-1 my-2    '
      key={props?.data?.lineCode}
      dir="rtl"
      onMouseLeave={hideDropdown}>


      <div className='row col-12  m-0 p-0 align-items-center  d-flex'
      >
        <div className='col-10 row mt-1 align-items-center  d-flex'>
          <label className="iranSansBold text-end col-1 text-truncate" style={{ width: '7rem' }} >
            {props?.data?.lineCode}
          </label>
          <label className="iranSansBold text-end text-truncate col-1" style={{ width: '20rem' }}  >
            {props?.data?.lineName}
          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }} >
            {
              props?.data?.companyCode
            }
          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }} >
            {
              props?.lineTypes?.find(s => s.typeId == props?.data?.lineType)?.typeName
            }
          </label>

          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {props?.data?.activeDriverLogin == 1 ? <FaCheck className="text-success" /> : <></>}
          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {props?.data?.closeTripEnable == 1 ? <FaCheck className="text-success" /> : <></>}

          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {props?.data?.shareTripEnable == 1 ? <FaCheck className="text-success" /> : <></>}

          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {props?.data?.workInStationEnable == 1 ? <FaCheck className="text-success" /> : <></>}

          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {props?.data?.telServiceEnable == 1 ? <FaCheck className="text-success" /> : <></>}

          </label>
          <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {
              props?.data?.preCodeDriver
            }
          </label>
              <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
            {
              props?.data?.extraFare
            }
          </label>
        </div>

        <div className="col-2 d-flex">
          <AddLine
            lineTypes={props?.lineTypes}
            afterClose={() => {
              props?.afterClose()
            }}
            data={props?.data}>
            <MdEdit className=" text-primary me-auto aPointer card-hover  mx-1" size={25} />
          </AddLine>

          <MdDelete className=" text-danger aPointer card-hover mx-1" size={25} onClick={(e) => {
            props?.onRemove(props.data)
          }} />

        </div>

      </div>





    </div >

  )
}
function LineCardHeader(props) {


  return (
    <div className='px-2 my-2 col-12 row mt-1 align-items-center  d-flex overflow-hidden'
      dir="rtl"
    >
      <label className="small text-end col-2 text-truncate" style={{ width: '7rem' }} >
        کد خط
      </label>
      <label className="small text-end text-truncate col-2" style={{ width: '20rem' }}  >
        نام خط
      </label>
      <label className="small text-end text-truncate col-2" style={{ width: '5rem' }}  >
        کد شرکت
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }} >
        نوع خط
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
        اپ راننده
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
        دریستی
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
        اشتراکی
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
        ایستگاه
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
        پیش کد
      </label>
      <label className=" small text-end text-truncate col-1" style={{ width: '5rem' }}  >
        مازاد کرایه
      </label>
    </div>

  )
}
