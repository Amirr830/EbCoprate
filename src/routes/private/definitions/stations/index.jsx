import React, { useEffect, useState } from "react";
import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import AddStation from "./addStation";
import { FaPlus } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import paths from 'app/paths.json'

export default function Stations() {

  var [stations, setStations] = useState([])
  useEffect(() => {
    getStations()
  }, [])
  const navigate = useNavigate();

  var getStations = () => {
    setLoading(true)
    AxiosPrivate.get(endpoints.stations, { params: params }).then(res => {
      setStations(res.data)
      setLoading(false)
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
  const handleEnter = (event) => {
    if (event.key.toLowerCase() === "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };
  var [isLoading, setLoading] = useState(false)
  return (
    <>
      <div className="position-relative overflow-hidden h-100">
        <div className="row g-2 m-0">

          <div className="col-2">
            <input type="number"
              className="form-control"
              placeholder="کد ایستگاه"
              name="stCode"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>
          <div className="col-8">
            <input type="text"
              className="form-control"
              placeholder="نام ایستگاه"
              name="stName"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>

          <button className="btn btn-success col-2"
            onClick={() => {
              getStations()
            }}>
            جستجو
          </button>
        </div>

        <div className=" position-absolute bottom-0 start-0 ms-3 mb-5 "
          style={{ zIndex: 1000, width: '6rem' }}>
          <AddStation onClose={() => {
            getStations()
          }}>
            <button className="btn btn-success w-100">
              افزودن <FaPlus size={25} />
            </button>
          </AddStation>
          <button className="btn btn-primary w-100 mt-2" onClick={() => {
            navigate(paths.private.reports.driverLocation)

          }}>
            نقشه <FaMapMarkedAlt size={25} />
          </button>
        </div>

        <div className=" position-absolute overflow-auto col-12 h-100 aScroll mt-3 ">
          {
            isLoading ?
              <div className='justify-content-center d-flex py-5' >
                <div className="spinner-border" role="status" />
              </div>
              :
              <div className="mb-5 pb-5" >
                <table className="table table-striped table-hover mb-5 pb-5" style={{ minWidth: '50rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '5rem' }}>
                        کد ایستگاه
                      </th>
                      <th style={{ width: '20rem' }}>
                        نام ایستگاه
                      </th>
                      <th style={{ width: '5rem' }}>
                        جایگزین
                      </th>
                      <th style={{ width: '5rem' }}>
                        سفید تا
                      </th>
                      <th style={{ width: '5rem' }}>
                        زرد تا
                      </th>
                      <th style={{ width: '5rem' }}>
                        محدوده
                      </th>
                      <th style={{ width: '5rem' }}>
                        ظرفیت
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {stations.map((item, index) => {
                      return <AddStation
                        station={item}
                        stations={stations}
                        onClose={() => {
                          getStations()
                        }}>
                        <tr className="aPointer">
                          <td>
                            {item.stCode}
                          </td>
                          <td>
                            {item.stName}
                          </td>
                          <td>
                            {item.stAlt}
                          </td>
                          <td>
                            {item.whiteTo}
                          </td>
                          <td>
                            {item.yellowTo}
                          </td>
                          <td>
                            {item.radius}
                          </td>
                          <td>
                            {item.capacity}
                          </td>
                        </tr>
                      </AddStation>
                    })}


                  </tbody>
                </table>
              </div>
          }
        </div>



      </div>
    </>

  );
}

