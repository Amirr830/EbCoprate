import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


var show = (title, message, accept, deny) => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        icon: "error",
        title: title,
        text: message,
        showCancelButton: true,
        allowOutsideClick: true,
        confirmButtonText: 'تلاش مجدد',
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#E91E63",

        cancelButtonText: 'بستن',
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            accept()
        } else if (result.isDenied) {
            deny()
        }
    })
    return MySwal;
}


export default {
    show: show
}

