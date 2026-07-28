import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../../app/endpoints";
import toast from "../../../components/toast";
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { SlOptions } from 'react-icons/sl'
import { AxiosPrivate } from "../../../app/axiosPrivate";
import answerModal from "../../../modals/answerModal";

export default function Companies() {
  const navigate = useNavigate();

  var [isLoading, setLoading] = useState(false)
  var [companies, setCompanies] = useState([]);
  useEffect(() => {
    getCompanies()
  }, [])

  var getCompanies = () => {
    setLoading(true)
    AxiosPrivate.get(endpoints.company)
      .then((res) => {
        setCompanies(res.data)
        setLoading(false)
      })
  }

  var addCompany = (params) => {
    setLoading(true)
    AxiosPrivate.post(endpoints.company, params)
      .then((res) => {
        getCompanies()
        setLoading(false)
        toast.Success("با موفقیت افزوده شد")
        setParams(emptyParams)
      })
  }

  var updateCompany = (params) => {
    setLoading(true)
    AxiosPrivate.put(endpoints.company, params)
      .then((res) => {
        getCompanies()
        setLoading(false)
        toast.Success("با موفقیت ویرایش شد")
        setParams(emptyParams)
      })
  }

  var archiveCompany = (params) => {
    answerModal.show("آیا از بایگانی شدن این پیمانکار اطمینان دارید؟", () => {
      setLoading(true)
      AxiosPrivate.delete(endpoints.company, { data: params })
        .then((res) => {
          getCompanies()
          setLoading(false)
          toast.Success("با موفقیت بایگانی شد")
        })
    }, () => {
    })
  }



  var [params, setParams] = useState({})
  var readChange = (e) => {
    var value = e.target.value
    var name = e.target.name
    console.log(params)
    setParams({
      ...params,
      [name]: value
    })
  }

  var emptyParams = {
    coCode: null
    , coName: ''
    , managerName: ''
    , managerFamily: ''
    , managerMobile: ''
    , address: ''
    , zipCode: ''
    , telNo: ''
    , faxNo: ''
    , email: ''
    , registerNo: ''
    , economyNo: ''
    , nationalCode: ''
    , isLegalPerson: ''

  }
  const handleEnter = (event) => {
    if (event.key.toLowerCase() == "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };
  return (
    <>
      <div className="container overflow-hidden " dir="rtl" >
        <div className="row g-2">
          <div className="col-12  aPointer  m-0 p-0" >
            <form className='row col-12 g-1 m-0 p-0'>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control "
                  placeholder="نام پیمانکار"
                  name="coName"
                  value={params?.coName}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="کد ملی"
                  name="nationalCode"
                  value={params.nationalCode}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="نام مدیر"
                  name="managerName"
                  value={params.managerName}
                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="نام خانوادگی"
                  name="managerFamily"
                  value={params.managerFamily}
                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>

              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="همراه مدیر"
                  name="managerMobile"
                  value={params.managerMobile}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="تلفن"
                  name="telNo"
                  value={params.telNo}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="فکس"
                  name="faxNo"
                  value={params.faxNo}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="ایمیل"
                  name="email"
                  value={params.email}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="شماره ثبت"
                  name="registerNo"
                  value={params.registerNo}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="شماره اقتصادی"
                  name="economyNo"
                  value={params.economyNo}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>



              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <input type="text"
                  className="form-control"
                  placeholder="کد پستی"
                  name="zipCode"
                  value={params.zipCode}

                  onChange={readChange}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className='col-6 col-md-4 col-lg-3 p-1'>
                <Form.Select value={params?.isLegalPerson}
                  name="isLegalPerson"
                  onChange={readChange}
                >
                  <option>نوع پیمانکار</option>
                  <option value={0} >حقیقی</option>
                  <option value={1}>حقوقی</option>
                </Form.Select>

              </div>
              <div className='col-12  p-1 '>
                <input type="text"
                  className="form-control"
                  placeholder="آدرس"
                  name="address"
                  onChange={readChange}
                  value={params.address}
                  onKeyDown={handleEnter}
                />
              </div>
            </form>

            {
              params?.coCode == null ?
                <div className="row my-2 g-2 mb-5">
                  <div className=" col-12 ">
                    <button className="btn btn-primary col-12" onClick={() => {
                      addCompany(params)
                    }}>
                      افزودن
                    </button>
                  </div>

                </div>
                :
                <div className="row my-2 g-2">
                  <div className=" col-6 ">
                    <button className="btn btn-success col-12" onClick={() => {
                      updateCompany(params)
                    }}>
                      ویرایش
                    </button>
                  </div>
                  <div className=" col-6 ">
                    <button className="btn btn-danger col-12" onClick={() => {
                      setParams(emptyParams)
                    }}>
                      انصراف
                    </button>
                  </div>
                </div>
            }
          </div>
          {companies.map((item, index) => {
            return <div className="col-12  aPointer" key={index}>
              <Item
                data={item}
                onArchivePress={(data) => {
                  archiveCompany(data)
                }}
                onEditPress={(data) => {
                  setParams(data)
                }}
              />
            </div>


          })}
          <div className="col-12" style={{ height: '30rem' }} />
        </div>
      </div>
    </>
  );
}


const Item = (props) => {



  return <div
    onClick={() => {
      // props.onEditPress(props?.data)
    }}
    className="card px-2 card-hover aPointer d-flex flex-row justify-content-center align-items-center">
    <div className="d-flex w-100  justify-content-center align-items-center ">
      <div className="w-100 d-flex row px-2 py-1">

        <p className="text-end col-12 col-md-6 col-lg-3 p-0 m-0">
          <label className="iranSansBold text-danger ps-2">{props?.data?.coCode}</label>

          <label className="opacity-50  " style={{ width: '5rem' }}>نام پیمانکار : </label>
          <label className="iranSansBold text-primary">{props?.data?.coName}</label>
        </p>
        <p className="text-end col-12 col-md-6 col-lg-3 p-0 m-0">
          <label className="opacity-50 " style={{ width: '5rem' }}>کد ملی : </label>
          {props?.data?.nationalCode}
        </p>
        <p className="text-end col-12 col-md-6 col-lg-3 p-0 m-0">
          <label className="opacity-50 " style={{ width: '5rem' }}>همراه مدیر : </label>
          {props?.data?.managerMobile}
        </p>
        <p className="text-end col-12 col-md-6 col-lg-3 p-0 m-0">
          <label className="opacity-50 " style={{ width: '5rem' }}>تلفن : </label>
          {props?.data?.telNo}
        </p>
        <p className="text-end col-12 col-md-12 col-lg-12 p-0 m-0 text-truncate">
          <label className="opacity-50  " style={{ width: '5rem' }}>آدرس : </label>
          {props?.data?.address}
        </p>
      </div>
    </div>
    <Dropdown className=''
    >
      <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={(e) => {
          props.onEditPress(props?.data)
        }} >ویرایش</Dropdown.Item>
        <Dropdown.Item onClick={(e) => {
          props.onArchivePress(props?.data)
        }} >بایگانی</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <div className=' card-hover  text-hover  justify-content-center align-items-center d-flex' style={{ width: '2rem', height: '2rem' }}>
      <SlOptions
        className=''
        style={{ height: '100%' }} />
    </div>
  </a>
));


