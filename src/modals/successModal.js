import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


var show = (title, message, accept) => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        icon: "success",
        title: title,
        text: message,
        allowOutsideClick: true,
        confirmButtonText: 'ادامه',
        confirmButtonColor: "#30b319",
        cancelButtonColor: "#E91E63",

    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            accept()
        } 
    })
    return MySwal;
}


export default {
    show: show
}

