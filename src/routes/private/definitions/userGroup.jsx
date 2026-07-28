import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../../app/endpoints";
import Storages from "../../../app/storages";
import UserGroupModal from "../../../modals/userGroupModal";
import { CgClose } from 'react-icons/cg'
import toast from "../../../components/toast";
import Dropdown from 'react-bootstrap/Dropdown';
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import { BsFillLockFill } from 'react-icons/bs'
import { AxiosPrivate } from "../../../app/axiosPrivate";
import answerModal from "../../../modals/answerModal";
import GroupMembersModal from "../../../modals/groupMemberModal";

export default function UserGroup() {
  const navigate = useNavigate();

  var [showAccessModal, setShowAccessModal] = useState(false)
  var [showMemberList, setShowMemberList] = useState(false)
  var [isLoading, setLoading] = useState(false)
  var [userGroup, setUserGroup] = useState([]);
  var [currentGroup, selectGroup] = useState(undefined);


  useEffect(() => {
    getUserGroup()
  }, [])
  var getUserGroup = () => {
    setLoading(true)
    AxiosPrivate.get(endpoints.group).then((res) => {
      setUserGroup(res.data)
      setLoading(false)
    })
  }

  var updateGroup = (group) => {
    
    setLoading(true)
    AxiosPrivate.put(endpoints.group, group).then((res) => {
      getUserGroup()
      setShowAccessModal(false)
      setLoading(false)
    })
  }

  var deleteGroup = (gId) => {
    answerModal.show("آیا از حذف این گروه اطمینان دارید؟", () => {
      setLoading(true)
      AxiosPrivate.delete(endpoints.group, { data: { groupCode: gId } }).then((res) => {
        getUserGroup()
        setLoading(false)
      })
    }, () => {
    })
  }

  return (
    <>
      <div className="container overflow-hidden " dir="rtl" >
        <div className="row g-2">
          {userGroup.map((item, index) => {
            return <div className="col-12 col-sm-6  col-lg-4 aPointer" key={index}>
              <GroupItem
                title={item.groupName}
                onDeletePress={() => {
                  deleteGroup(item.gId)
                }}
                onEditPress={() => {
                  selectGroup(item)
                  setShowAccessModal(true)
                }}
                onMembersPress={() => {
                  selectGroup(item)
                  console.log(item.gId)
                  setShowMemberList(true)
                }} />
            </div>


          })}
          <div className="col-12 col-sm-6 col-lg-4 aPointer  " onClick={() => {
            selectGroup(undefined)
            setShowAccessModal(true)

          }}>
            <div className="card d-flex py-2 flex-row justify-content-center align-items-center bg-warning">
              <h3 className="text-center  w-100">افزودن گروه</h3>
            </div>
          </div>
          <div className="col-12" style={{ height: '30rem' }} />
        </div>
      </div>

      <UserGroupModal
        show={showAccessModal}
        group={currentGroup}
        onClose={() => {
          setShowAccessModal(false)
        }}
        onAccept={(group) => {
          updateGroup(group)
        }} />

      <GroupMembersModal
        show={showMemberList}
        groupCode={currentGroup?.gId}
        onClose={() => {
          setShowMemberList(false)
        }}
      />
    </>
  );
}

const GroupItem = (props) => {
  var [showDD, setShowDD] = useState(false)

  const showDropdown = (e) => {
    setShowDD(!showDD);
  }
  const hideDropdown = e => {
    setShowDD(false);
  }

  return <div onMouseLeave={hideDropdown}
    onClick={showDropdown}
    className="card d-flex py-2 flex-row justify-content-center align-items-center card-hover">
    <h3 className="text-center  w-100">{props.title}</h3>
    <Dropdown className='' show={showDD}>
      <Dropdown.Toggle as={CustomToggle} variant="success" id="dropdown-basic">
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={(e) => {

          props.onEditPress()
        }} >ویرایش</Dropdown.Item>
        <Dropdown.Item onClick={(e) => {
          props.onMembersPress()
        }} >اعضا</Dropdown.Item>
        <Dropdown.Item onClick={(e) => {
          props.onDeletePress()
        }} >حذف</Dropdown.Item>
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


