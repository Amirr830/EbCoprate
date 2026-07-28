import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


var load = () => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        allowOutsideClick: true,
        title: 'چند لحظه صبر فرمایید',
        didOpen: () => {
            Swal.showLoading()
        }
    })
    return MySwal;
}

var close = (MySwal) => {
    MySwal.close();
}

export default {
    close: close,
    load: load,
    show: load
}

