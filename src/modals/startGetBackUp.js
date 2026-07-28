import React, { useEffect, useState } from "react";
import withReactContent from 'sweetalert2-react-content'

import { Modal } from "react-bootstrap";
import Swal from 'sweetalert2'
import axios from "axios";
import endpoints from "../app/endpoints";

export default function StartGetBackup(props) {


    var [completePercent, setCompletePercent] = useState(0);
    var getRemainingPercent = () => {
        axios.get(endpoints.backupPercent)
            .then((res) => {
                setCompletePercent(res.data.precent)
            })
    }
    var startGenerateBackup = () => {
        const MySwal = withReactContent(Swal)
        axios.post(endpoints.backup)
            .then(res => {
                if (res.data.status) {
                    MySwal.fire('Good Job!',
                        'Your Backup have been save in storage.',
                        'success')
                } else {
                    MySwal.fire('Bad Job!',
                        'Your Backup not have been save in storage.',
                        'error')
                }
                handleClose()
            })
            .catch(err => {
                handleClose()
                MySwal.fire('Bad Job!',
                    'Your Backup not have been save in storage.',
                    'error')

            })
    }

    let timerInterval

    useEffect(() => {
        if (props.show) {
            setCompletePercent(0)
            startGenerateBackup()
            timerInterval = setInterval(() => {
                getRemainingPercent()
            }, 2000)
        }
    }, [props])



    const handleClose = () => {
        props?.afterEnd();
        clearInterval(timerInterval)
    }




    return (<>
        <div>

            <Modal show={props.show} centered>

                <Modal.Body >
                    <div className="justify-content-center align-items-center  d-flex row p-3 ">

                        <div className="col-12 m-0 p-0">
                            <h2>Taking a backup  {completePercent}% </h2>
                            <div className="progress">
                                <div className="progress-bar"
                                    role="progressbar"
                                    aria-valuemin="0"
                                    style={{ width: `${completePercent}%` }}
                                    aria-valuemax="100">{completePercent}%</div>
                            </div>
                        </div>

                    </div>

                </Modal.Body>

            </Modal>


        </div>

    </>)
}

