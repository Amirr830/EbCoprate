import React, { useEffect, useState, useRef } from "react";

// import mapboxgl from 'mapbox-gl';

// import 'mapbox-gl/dist/mapbox-gl.css';

import style from "./backup.css";
import icStorage from "./../../../assets/drawable/storage.svg"
import icClose from "./../../../assets/drawable/close.svg"
import idDownload from "./../../../assets/drawable/download.svg"
import idExchange from "./../../../assets/drawable/exchange.svg"
import axios from "axios";
import endpoints from "../../../app/endpoints";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

import StartGetBackup from "../../../modals/startGetBackUp";
export default function Backup() {

  var [diskSpace, setDiskSpace] = useState({})
  var [files, setFiles] = useState([])
  var [startBackup, setStartBackup] = useState(false);
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    getDiskSpace()
    getFilesList()
  }, [])

  var getDiskSpace = () => {
    axios.get(endpoints.diskSpace)
      .then((res) => {
        setDiskSpace(res.data)
      })
  }

  var getFilesList = () => {
    axios.get(endpoints.files)
      .then((res) => {
        setFiles(res.data)
      })
  }

  var deleteFile = (fileName) => {
    axios.delete(endpoints.files + "/" + fileName)
      .then((res) => {
        setFiles(res.data)
        getDiskSpace()
        MySwal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      })
  }
  var startGetBackUp = () => {
    // percentBackup.show()
    setStartBackup(true)
    // axios.post(endpoints.backup )
    //   .then((res) => {

    //     setFiles(res.data)
    //   })
  }

  var onCloseLoading = () => {

  }


  var onDeleteFilePress = (file) => {

    MySwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this file!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFile(file.name)
      }
    })
  }

  return (
    <>
      <div className="vh-100 justify-content-center align-items-center  " >

        <div className="container ">

          <div className=" vh-100  d-flex row py-5 ">


            <div className="side-panel-bg col-12 col-lg-4 px-3 py-2 d-flex flex-column mb-3">
              <button className="btn bg-primary text-white col-12 py-3 " onClick={(e) => startGetBackUp()}>
                <h4 className="align-items-center iranSansBold">تهیه نسخه پشتیبان</h4>
              </button>
              <div className="  w-100 mt-3">
                <div className="d-flex flex-row">
                  <div className=" m-auto  w-100">
                    <p className="p-0 m-0 fredoka" > /home/backups/</p>
                    <h4 className="iranSansBold p-0 m-0">مسیر نسخه پشتیبان</h4>
                  </div>
                  <img className="" src={idExchange} style={{ width: "2.5rem", height: "2.5rem" }} />
                </div>
                <br />
                <div className="d-flex flex-row opacity-50" >
                  {/* <div className="m-auto  w-100 ">
                    <p className="p-0 m-0">everday at 6:00 pm</p>
                    <h4 className="fredokaBold p-0 m-0">Auto BackUp</h4>
                  </div>
                  <input className="form-check-input " disabled style={{ width: '2rem', height: '2rem' }} type="checkbox" value="" id="flexCheckIndeterminate" /> */}
                </div>


              </div>
              <div className="m-auto">

              </div>
              <div className="progress bg-light shadow">
                <div className={diskSpace.freePercent > 20 ? "bg-primary progress-bar" : "bg-danger progress-bar"}
                  role="progressbar"
                  aria-valuemin="0"
                  style={{ width: `${100 - diskSpace.freePercent}%` }}
                  aria-valuemax="100">

                </div>
              </div>
              <h6 className="fredoka">{(diskSpace.free / 1024 / 1024 / 1024).toFixed(2)} GB free of {(diskSpace.size / 1024 / 1024 / 1024).toFixed(2)} GB</h6>
            </div>

            <div className=" col-12 col-lg-8  pe-2 h-100 d-flex flex-column overflow-auto aScroll ">
              {
                files.map((file, index) => {
                  return (<div className="a-card d-flex  justify-content-center align-items-center mb-2 " key={index}>
                    <img className="mx-3" src={icStorage} style={{ width: "3rem", height: "3rem" }} />

                    <div className="w-100">
                      <div className="d-flex align-items-center">
                        <h4 className="fredokaBold m-0 p-0 text-nowrap text-truncate" >{file.name}</h4>
                        <h6 className="m-0 p-0 opacity-50 ms-5" >{(file.size / 1024 / 1024 / 1024).toFixed(2)}GB</h6>
                      </div>

                      <div className="d-flex ">


                        <h6 className="m-0 p-0 opacity-50 iranSans" dir="rtl">

                          {new Date(file.modify).toLocaleDateString('fa-IR', { weekday: "long" })}
                          {/* {format(new Date(file.modify), ' dd MMMM yyyy')} */}

                        </h6>
                        <h6 className="m-0 p-0 opacity-50 iranSans ms-5" dir="rtl">
                          {/* {format(new Date(file.modify), 'hh:mm')} */}
                        </h6>
                      </div>
                    </div>
                    <img className=" aPointer" src={icClose} style={{ width: "3rem", height: "3rem", fill: '#000' }} onClick={() => onDeleteFilePress(file)} />
                    <a href={endpoints.files + "/" + file.name} target="_blank">
                      <img className="mx-3 aPointer" src={idDownload} style={{ width: "3rem", height: "3rem" }} />
                    </a>
                  </div>)
                })

              }

              {/* <div className="d-flex mt-auto">
              <h4 className="fredokaBold a-card text-center me-auto aPointer">back</h4>
              <h4 className="fredokaBold a-card text-center  ms-auto aPointer">next</h4>
            </div> */}
              {/* <MapboxExample /> */}
            </div>
          </div>
        </div>
      </div>

      <StartGetBackup
        show={startBackup}
        afterEnd={() => {
          setStartBackup(false)
          getFilesList()
          getDiskSpace()
        }} />
    </>
  );
}



// const MapboxExample = () => {
//   const mapContainerRef = useRef();
//   const mapRef = useRef();

//   useEffect(() => {
//     mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
//     mapboxgl.p
//     mapRef.current = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       center: [-74.5, 40], // starting position [lng, lat]
//       zoom: 9 // starting zoom
//     });
//   });

//   return (
//     <div
//       style={{ height: '100%' }}
//       ref={mapContainerRef}
//       className="map-container"
//     />
//   );
// };

