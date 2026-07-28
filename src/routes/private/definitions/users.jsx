import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";
import axios from 'axios';
import storage from '../../../app/storages'
import endpoints from '../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../components/toast';
import UserCard from '../../../components/userCard';
import AddUserModal from '../../../modals/addUserModal';
import { AxiosPrivate } from '../../../app/axiosPrivate';
import answerModal from '../../../modals/answerModal';
export default function Users() {
  var [showUserAdd, setShowUserAdd] = useState(false)

  var context = useContext(dashboardContext)
  var openAddUserModal = () => {
    setCurrentUser(undefined)
    setShowUserAdd(true)
  }
  var [isLoadLastRecord, setLoadLastRecord] = useState(false);

  var [users, setUsers] = useState([]);
  var [currentUser, setCurrentUser] = useState(undefined);
  var divScrollRef = useRef();
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
  var [params, setParams] = useState({
    showOnlyActive: true
  })



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
    if (isLoad) {
      getUsers(false)
    }
  }, [isLoad])

  var getUsers = (reset) => {

    AxiosPrivate.get(endpoints.users,
      {
        params: {
          offset: reset ? 0 : users.length,
          ...params
        }
      }).then((res) => {
        setLoadLastRecord((res.data.list.length == 0 ? true : false))

        if (reset) {
          setUsers(res.data.list)
        } else {
          setUsers([...users, ...res.data.list])
        }
      }).finally(() => {
        setLoading(false)

      })


  }

  var removeUser = (user) => {
    console.log(user)
    answerModal.show("آیا از حذف این کاربر اطمینان دارید؟",
      () => {
        AxiosPrivate.delete(endpoints.users,
          {
            data: {
              ...user
            }
          }).then((res) => {
            getUsers(true)
          })
      }, () => {

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
  const handleEnter = (event) => {
    if (event.key.toLowerCase() == "enter") {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  return (
    <div className=' h-100 d-flex flex-column'>

      <div className='row g-2 pb-3 '>

        <form className='row col-12 col-lg-8 g-2  '>


          <div className='col-6 col-md-3'>

            <input type="text"
              className="form-control"
              placeholder="نام"
              name="firstName"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>
          <div className='col-6 col-md-3 '>

            <input type="text"
              className="form-control"
              placeholder="نام خانوادگی"
              name="lastName"
              onChange={readChange}
              onKeyDown={handleEnter}
            />
          </div>
          <div className='col-6 col-md-3 '>
            <input type="number"
              className="form-control"
              placeholder="شماره ملی"
              name="natCode"

              onChange={readChange}
              onKeyDown={handleEnter}


            />
          </div>
          <div className='col-6 col-md-3 '>
            <input type="number"
              className=" form-control"
              placeholder="شماره موبایل"
              name="mobile"
              onChange={readChange}
              onKeyDown={handleEnter}


            />
          </div>

          <div className="d-flex">
            <div class="form-check form-switch " >
              <input className="form-check-input aPointer "
                type="checkbox"
                role="switch"
                id="showOnlyActive"
                checked={params?.showOnlyActive}
                onChange={(e) => {
                  setParams(prevState => ({
                    ...prevState,
                    showOnlyActive: e.target.checked
                  }))
                }} />
            </div>
            <label className="form-check-label noSelect me-2 aPointer" htmlFor="showOnlyActive" >
              فقط نمایش فعال ها
            </label>
          </div>
        </form>

        <div className='col-12 col-lg-2  '>
          <button className='col-12 btn btn-warning mt-2'
            onClick={() => {
              getUsers(true)
            }} >جستجو</button>
        </div>
        <div className='col-12 col-lg-2 ' >
          <button className='col-12 btn btn-success mt-2'
            onClick={openAddUserModal}>افزودن</button>
        </div>

      </div>
      <div className='position-sticky h-100 bottom-0 overflow-y-auto overflow-x-hidden a-scroll' ref={divScrollRef}>

        {users.map((item, index) => {
          return <div key={index}>
            <UserCard
              user={item}
              onEditPress={() => {
                setCurrentUser(item)
                setShowUserAdd(true)
              }}
              onRemovePress={removeUser} />
          </div>
        })}
      </div>

      {(isLoad && !isLoadLastRecord) ?
        <div className='justify-content-center d-flex py-5' >
          <div className="spinner-border" role="status" />
        </div> : <></>
      }

      <AddUserModal
        show={showUserAdd}
        user={currentUser}
        onClose={(e) => {
          setShowUserAdd(false)
        }}
        onSave={(car) => {
          setShowUserAdd(false)
          getUsers(true)
        }}
      />

    </div >
  )
} 