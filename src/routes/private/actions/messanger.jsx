import React, { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { AxiosPrivate } from "../../../app/axiosPrivate";
import endpoints from "../../../app/endpoints";
import dashboardContext from "../../../contexts/dashboardContext";
import { hhmm, yyyymmdd, yyyymmddhhmm } from "../../../helper/dateHelper";
import { setComma } from "../../../helper/numberHelper";
import Input from "../../../components/customeTag/input";
import AddDriverPayment from "../../../modals/addDriverPayment";
import Options from "../../../components/options";
import toast from "../../../components/toast";
import answerModal from "../../../modals/answerModal";
import { IoSend } from "react-icons/io5";

export default function Messanger(props) {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const [selectChat, setSelectChat] = useState(undefined);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const currentRows = textAreaRef.current?.value.split('\n').length || 1;
    if (currentRows <= 6) {
      setRows(currentRows);
    }
  }, [message]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  var bottomOfMsgList = useRef()
  var lstMessages = useRef()


  useEffect(() => {
    getRooms()
    const interval = setInterval(() => {
      getRooms()
      if (selectChat) {
        getChatMessage(selectChat)
      }
    }, 5000)
    return () => {
      // 👇️ clear timeout when the component unmounts
      clearTimeout(interval);
    };

  }, [])


  var [rooms, setRooms] = useState([])
  var [chatList, setChatList] = useState([])
  var getRooms = () => {
    AxiosPrivate.get(endpoints.messengerRoom)
      .then((res) => {
        console.log(res.data)
        setRooms(res?.data)
      })
  }
  var getChatMessage = (room) => {
    AxiosPrivate.get(endpoints.messengerChat, { params: { roomCode: room?.roomCode, lastMsgNum: 0 } })
      .then((res) => {
        setChatList(res.data)
        bottomOfMsgList.current.scrollIntoView({ behavior: 'smooth' })
      })
  }
  var sendMessage = (message) => {
    AxiosPrivate.post(endpoints.messengerChat, { roomCode: selectChat?.roomCode, msg: message })
      .then((res) => {
        getChatMessage(selectChat)
        setMessage('')
      })
  }

  return (
    <>
      <div className=" w-100  position-absolute top-0 bottom-0 start-0 end-0 overflow-hidden mb-3 " >
        <div className="container  h-100 d-flex  " >


          <div className="card h-100 col-3 overflow-y-auto aScroll" dir="ltr" >
            <div className="m-2 position-sticky top-0">
              <input
                className="form-control  iranSansBold shadow border  border-primary"
                placeholder="جستجو"
                style={{ backgroundColor: "#ECEFF1" }}
                
              />
            </div>

            {
              rooms.map((item, index) => {
                return <div key={index} className="pt-2 px-2 " onClick={(e) => {
                  setSelectChat(item)
                  getChatMessage(item)
                }}   >
                  <div className={(item?.roomCode == selectChat?.roomCode ? 'bg-warning ' : ' ') + "d-flex flex-row p-2 aPointer  card-hover rounded-lg d-flex align-items-center"}

                    style={{
                      borderRadius: '14px'
                    }}>
                    {item?.notSeen > 0 ?
                      <div className="bg-danger me-auto card p-0 m-0 px-2 text-white noSelect ">
                        {item?.notSeen}
                      </div> : <div className=" me-auto p-0 m-0" />
                    }
                    <div className="mx-2">
                      <h6 className="p-0 m-0 iranSansBold noSelect text-end">{item.rName}</h6>
                      <label className="p-0 m-0 opacity-50 noSelect text-end">{yyyymmddhhmm(item.lastMsgTime)}</label>
                    </div>
                    <div className="bg-primary d-flex justify-content-center align-items-center"
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#aaaaaa',
                        borderRadius: '50%',
                      }}>
                      <h5 className="text-center text-white p-0 m-0 noSelect">
                        ر
                      </h5>
                    </div>
                  </div>
                </div>
              })
            }




          </div>


          <div className="opacity-0">...</div>
          <div className="card h-100 col-9  " >
            <div className="h-100 d-flex flex-column ">
              {/* لیست پیام ها */}
              <div className="overflow-hidden">
                <div className=" h-100 overflow-auto aScroll p-2 d-flex flex-column" ref={lstMessages}>

                  {
                    chatList.map((item, index) => {
                      return <div>
                        {
                          item.isSelf ?
                            <div className="d-flex flex-row my-1">
                              <div className="w-auto card p-1 px-3" style={{ backgroundColor: '#DCEDC8' }}>
                                <p className="iranSansBold p-0 m-0 pb-2">{item?.msg}</p>
                                <label className="p-0 m-0">{hhmm(item?.saveDate)}</label>
                              </div>
                            </div>
                            :
                            <div className="d-flex flex-row-reverse  my-1">
                              <div className="w-auto card p-1 px-3" style={{ backgroundColor: '#CFD8DC' }}>
                                <p className="iranSansBold p-0 m-0 pb-2">{item?.msg}</p>
                                <label className="p-0 m-0">{hhmm(item?.saveDate)}</label>
                              </div>
                            </div>
                        }
                      </div>
                    })
                  }
                  <div className="pt-5" ref={bottomOfMsgList} />

                </div>
              </div>
              {/* باکس نوشتن پیام */}
              {
                selectChat ?
                  <div className="mt-auto m-2 position-relative ">
                    <textarea
                      className="form-control pe-5 iranSansBold shadow border  border-primary"
                      placeholder="متن پیام "
                      rows={rows}
                      value={message}
                      ref={textAreaRef}
                      onChange={handleChange}
                      style={{ backgroundColor: "#ECEFF1" }}
                    />
                    <IoSend className="position-absolute end-0  me-3  aPointer text-hover" size={25} style={{ bottom: '8' }} title="ارسال"
                      onClick={() => {
                        sendMessage(message)
                      }} />
                  </div> : <></>
              }
            </div>



          </div>
        </div>


      </div>

    </>
  );
}
