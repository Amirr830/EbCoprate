import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { useNavigate } from "react-router-dom";
import paths from "./../../app/paths.json";
import CopyRight from "../../components/copyright";
import Storages from "../../app/storages";
import loaderModal from "../../modals/loaderModal";
import endpoints from "../../app/endpoints";
import toast from "../../components/toast";
import { AxiosPublic } from "../../app/axiosPublic";

function Login() {

  var [showPassword, setShowPassword] = useState(false)
  var [state, setState] = useState()

  var [saveLogin, setSaveLogin] = useState(false)

  var submit = useRef()
  var password = useRef()
  var navigate = useNavigate();


  var login = () => {
    console.log(state)
    if (!state.username)
      return toast.Error('نام کاربری وارد نشده است')
    if (!state.password)
      return toast.Error('رمز عبور وارد نشده است')
    var loader = loaderModal.load()
    AxiosPublic.get(endpoints.login,
      {
        params: state
      }).then((res) => {
        //در صورتی که ذخیره خودکار اطلاعات ورود تیک خورده باشد
        if (saveLogin) {
          //نام کاربری و پسورد در دیتابیس ذخیره میشود
          Storages.setUsername(state.username)
          Storages.setPassword(state.password)
        }

        //در صورتی که ورود دو مرحله ای باشد
        if (res.data.twoStepVerify) {
          //شماره تماس و میزان انتظار برای ارسال مجدد ذخیره میشود
          Storages.setHashedPhoneNumber(res.data.mobileHashed)
          Storages.setAllowReqAfterSec(new Date().getTime() + (res.data.ttl * 1000))
          //سپس به صفحه تایید هدایت میکنیم
          navigate(paths.public.verify, { state: { username: state.username, password: state.password } })
        } else {
          //در صورت عدم نیاز به ورود دو مرحله 
          //توکن ها ذخیره و به صفحه میز کاربری هدایت میکنیم
          Storages.setAccessToken(res.data.accessToken)
          Storages.setRefreshToken(res.data.refreshToken)
          navigate(paths.private.dashboard)
        }
        loaderModal.close(loader)
      })
  }


  const handleOnChange = (e) => {
    try {
      var value = e.target.value
      var name = e.target.name
      setState(prevState => ({
        ...prevState,
        [name]: value,
      }))
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    Storages.setAllowReqAfterSec(0)
    setState({
      username: Storages.getUsername(),
      password: Storages.getPassword()
    })
  }, [])
  return (
    <>
      <div className="bg-dark vh-100 d-flex  overflow-auto justify-content-center align-items-center" dir="rtl">
        <div className="w-100 d-flex justify-content-center ">
          <div className="card d-flex g-3 row p-3 col-9 col-sm-6 col-lg-4">
            <div className="form-group autocomp">
              <label htmlFor="username" className="pb-1">نام کاربری</label>
              <input type="text"
                className="form-control"
                name="username"
                placeholder="نام کاربری"
                value={state?.username}
                onKeyDown={(e) => {
                  if (e.key.toLowerCase() === "enter") password.current.focus()
                }}
                onFocus={(e) => {
                  e.target.select()
                }}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" >کلمه عبور</label>
              <div className="d-flex flex-row-reverse align-items-center " >
                <input type={showPassword ? "text" : "password"}
                  onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "enter")
                      submit.current.focus()
                  }}
                  onChange={handleOnChange}
                  value={state?.password}
                  onFocus={(e) => {
                    e.target.select()
                  }}
                  ref={password}
                  className="form-control"
                  name="password"
                  placeholder="کلمه عبور"
                />
                <div className="position-absolute ms-3" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ?
                    <AiOutlineEye className="text-dark" />
                    :
                    <AiOutlineEyeInvisible className="text-dark" />
                  }
                </div>
              </div>
            </div>


            <div >
              <input className="form-check-input aPointer " type="checkbox" value="" id="flexCheckDefault"
                onChange={(e) => {
                  setSaveLogin(e.target.checked)
                }} />
              <label className="form-check-label noSelect me-2 aPointer" htmlFor="flexCheckDefault">
                مرا به خاطر بسپار
              </label>

            </div>

            <button className="btn btn-success" ref={submit} onClick={() => {
              login()
            }

            }>ورود</button>


          </div>

        </div>

        <CopyRight />

      </div>

    </>
  );
}

export default Login;
