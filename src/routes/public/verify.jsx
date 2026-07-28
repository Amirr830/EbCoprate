import React, { useEffect, useRef, useState } from "react";
import { BiArrowBack } from 'react-icons/bi'
import { useLocation, useNavigate } from "react-router-dom";
import paths from "./../../app/paths.json";
import CopyRight from "../../components/copyright";
import Storages from "../../app/storages";
import endpoints from "../../app/endpoints";
import loaderModal from "../../modals/loaderModal";
import toast from "../../components/toast";
import { AxiosPublic } from "../../app/axiosPublic";

function Verify() {

  var submit = useRef()
  var navigate = useNavigate();
  var location = useLocation();
  var [timer, setTimer] = useState(undefined)
  var [verifyCode, setVerifyCode] = useState()
  var handelTimer = () => {
    const interval = setInterval((e) => {
      var m = Math.floor((Storages.getAllowReqAfterSec() - new Date().getTime()) / 1000 / 60)
      var s = Math.floor((Storages.getAllowReqAfterSec() - new Date().getTime()) / 1000 % 60)

      if (Storages.getAllowReqAfterSec() - new Date().getTime() < 0) {
        setTimer(undefined)
        clearInterval(interval)
      } else {
        setTimer(m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0'))
      }
    }, 1000)
    return () => {
      clearInterval(interval);
    };
  }

  useEffect(() => {
    handelTimer()
  }, [])

  var login = () => {
    var loader = loaderModal.load()
    AxiosPublic.get(endpoints.login,
      {
        params: {
          username: location.state.username,
          password: location.state.password
        }
      }).then((res) => {
        Storages.setAllowReqAfterSec(new Date().getTime() + (res.data.ttl * 1000))
        handelTimer()
        loaderModal.close(loader)
      })
  }

  var verify = () => {

    if (!verifyCode)
      return toast.Error('کد تایید وارد نشده است')

    var loader = loaderModal.load()

    AxiosPublic.get(endpoints.verify,
      {
        params: {
          username: location.state.username,
          password: location.state.password,
          verifyCode: verifyCode
        }
      }).then((res) => {
        Storages.setAccessToken(res.data.accessToken)
        Storages.setRefreshToken(res.data.refreshToken)
        Storages.setAllowReqAfterSec(0)
        navigate(paths.private.dashboard)
        loaderModal.close(loader)
      })
  }

  return (
    <>
      <div className="bg-dark vh-100 d-flex  overflow-auto justify-content-center align-items-center" dir="rtl">

        <div className="w-100 d-flex justify-content-center ">

          <div className="card d-flex g-3 row p-3 col-9 col-sm-6 col-lg-4 ">
            <div className="form-group autocomp">
              <div className="note mb-3">
                <label htmlFor="username" className="pb-1 w-100  text-end">کد تاییدی که برای شماره <span dir="ltr">{Storages.getHashedPhoneNumber()}</span> پیامک شده را وارد کنید</label>
              </div>

              <input type="text"
                onChange={(e) => {
                  setVerifyCode(e.target.value)
                }}
                className="form-control"
                placeholder="کد تایید"
                onKeyDown={(e) => {
                  if (e.key.toLowerCase() === "enter")
                    submit.current.focus()
                }} />
            </div>

            {timer ?
              <h6 >امکان ارسال مجدد کد تایید پس از : {timer}</h6>
              : <h6 className="aPointer text-hover" onClick={(e) => {
                login()
              }}>ارسال مجدد؟</h6>
            }
            <div className="w-100">
              <button className="btn btn-success w-100" ref={submit} onClick={() => {

                verify()
              }

              }>احراز هویت</button>
            </div>
          </div>
        </div>
        <h6 className="position-fixed start-0 top-0  text-light p-2 aPointer" onClick={(e) => {
          Storages.setAllowReqAfterSec(0)
          navigate(paths.public.login)
        }}>ورود با حساب دیگری<BiArrowBack className="mx-2" size={30} /></h6>

        <CopyRight />

      </div>

    </>
  );
}

export default Verify;
