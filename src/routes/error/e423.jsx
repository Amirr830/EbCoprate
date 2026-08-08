import React from "react";
import { useNavigate } from "react-router-dom";
import paths from '../../app/paths.json'

export default function E423(props) {
  var navigage = useNavigate()
  return (
    <div className="row  " style={{marginTop:"100px"}}>
      <h4 className="text-center">
        شما اجازه دسترسی به این صفحه را ندارید.
      </h4>
      <button className="btn btn-primary  col-4 mx-auto mt-3" onClick={() => {
        navigage(paths.private.dashboard)
      }}>
        <h4>
          صفحه اصلی
        </h4>
      </button>
    </div>
  );
}

