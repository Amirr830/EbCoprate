import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../../app/endpoints";
import loaderModal from "../../../modals/loaderModal";
import { AxiosPrivate } from "./../../../app/axiosPrivate"
import dashboardContext from "../../../contexts/dashboardContext";
import SubscriberCard from "../../../components/subscriberCard";

export default function Subscribers() {
  var context = useContext(dashboardContext)

  const navigate = useNavigate();
  var [subscribers, setSubscribers] = useState([])
  var [listCount, setListCount] = useState(0)
  var getSubscribers = (reset) => {
    AxiosPrivate.get(endpoints.subscribers,
      {
        params: {
          offset: reset ? 0 : subscribers.length,
          ...params
        }
      }).then((res) => {
        setListCount(res.data.listCount)

        if (reset) {
          setSubscribers(res.data.list)
        } else {
          setSubscribers([...subscribers, ...res.data.list])
        }
      }).finally(() => {
        setLoading(false)

      })
  }
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

  var [isLoad, setLoading] = useState(true)
  var [params, setParams] = useState()

  const onScroll = () => {

    if (divScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = divScrollRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

      if (isNearBottom) {
        console.log("Reached bottom");
        // DO SOMETHING HERE
        setLoading(true)
      }
    }
  };

  useEffect(() => {
    if (subscribers.length > 50)
      setLoading(false)
    if (isLoad) {
      getSubscribers(false)
    }
  }, [isLoad])
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


  return (
    <>
        <div className=' h-100 d-flex flex-column'>

        {/* باکس جستجو */}
        <div className='row g-2 pb-3  '>

          <form className='row col-12 col-md-9 g-2  '>

            <div className='col-6 col-md-4'>

              <input type="text"
                className="form-control"
                placeholder="نام مشترک"
                name="sName"
                onChange={readChange}
                onKeyDown={handleEnter}
              />
            </div>

            <div className='col-6 col-md-4  '>

              <input type="text"
                className="form-control"
                placeholder="همراه مشترک"
                name="sMobile"
                onChange={readChange}
                onKeyDown={handleEnter}
              />
            </div>

            <div className='col-6 col-md-4  '>
              <input type="number"
                className=" form-control"
                placeholder="کد اشتراک"
                name="sId"
                onChange={readChange}
                onKeyDown={handleEnter}


              />
            </div>

          </form>

          <div className='col-12 col-md-3  '>
            <button className='col-12 btn btn-warning mt-2'
              onClick={() => {
                setSubscribers([])
                getSubscribers(true)
                setLoading(true)
                // console.log(params)
              }} >جستجو</button>
            <button className='col-12 btn btn-success mt-2'>افزودن</button>

          </div>
        </div>

        <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll' ref={divScrollRef}>
          {subscribers.map((item, index) => {
            return <div key={index}>
              <SubscriberCard
                data={item} />

            </div>
          })}
        </div>

        {isLoad ?
          <div className='justify-content-center d-flex py-5' >
            <div className="spinner-border" role="status" />
          </div> : <></>
        }

      </div >
    </>
  );
}

