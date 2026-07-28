import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from "axios";
import endpoints from "../app/endpoints";

var getRemainingPercent = () => {
    axios.get(endpoints.backupPercent)
        .then((res) => {
        })
}


var show = () => {
    let timerInterval

    const MySwal = withReactContent(Swal)
    MySwal.fire({
        title: 'Creating New Backup',
        html: 'percent : <b></b> %',
        timerProgressBar: true,
        focusCancel: false,
        didOpen: () => {
            Swal.showLoading()

            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = '100'

                console.log('sss')
            }, 1000)
        },
        willClose: () => {
            Swal.fire('Good Job!',
                'Your Backup have been save in storage.',
                'success')
            clearInterval(timerInterval)
        }
    })
    return MySwal;
}

export default {
    show: show,
}

