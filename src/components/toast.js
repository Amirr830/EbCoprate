import { Flip, toast } from 'react-toastify';

const Info = (message) => toast.info(message, {
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    progress: undefined,
    stacked: true,
    transition: Flip,


});

const Success = (message) => toast.success(message, {
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    progress: undefined,
    stacked: true,
    transition: Flip,


});
const Error = (message) =>
    toast.error(message, {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        progress: undefined,
        transition: Flip,

    })
    ;

const SessionEnd = () => {
    toast.error('مهلت استفاده اتمام یافت', {
        autoClose: 30000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        progress: undefined,
        transition: Flip,

    });
    window.location.reload();

}



export default {
    Success: Success,
    Error: Error,
    SessionEnd: SessionEnd,
    Info:Info
}

