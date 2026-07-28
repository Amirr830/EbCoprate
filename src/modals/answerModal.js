import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


var show = (content, accept, deny) => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        title: content,
        showDenyButton: true,
        allowOutsideClick: true,
        confirmButtonText: 'بله',
        confirmButtonColor: "#3085d6",
        denyButtonText: 'خیر',
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */

        if (result.isConfirmed) {
            console.log('accept')
            accept()
        } else if (result.isDenied) {
            console.log('deny')
            if (deny)
                deny()
        }
    })
    return MySwal;
}


export default {
    show: show
}

