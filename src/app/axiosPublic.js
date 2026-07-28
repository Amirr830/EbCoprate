import axios from "axios"
import Storages from "./storages"
import errorModal from "../modals/errorModal";



const INTERNAL_IP = new URL(process.env.REACT_APP_BASE_URL_INTERNAL)
const EXTERNAL_IP = new URL(process.env.REACT_APP_BASE_URL_EXTERNAL)

const url = window.location.hostname.includes(INTERNAL_IP.hostname) ?
    INTERNAL_IP.href :
    window.location.hostname.includes('localhost') ? INTERNAL_IP.href : EXTERNAL_IP.href;

export const AxiosPublic = axios.create({
    baseURL: url + "/panel",
    withCredentials: false
})


// اینجا می‌توانید یک interceptor
// برای پاسخ‌ها اضافه کنید که در صورت دریافت خطای 403، توکن را تازه کند 
// و درخواست اولیه را دوباره ارسال کند
AxiosPublic.interceptors.response.use((response) => {
    // اینجا می‌توانید پاسخ را برگردانید

    return response;

}, async (error) => {

    // اینجا می‌توانید بررسی کنید که آیا خطایی رخ داده است یا خیر
    if (error?.response) {
        // اینجا می‌توانید بررسی کنید که آیا وضعیت خطا 401 است یا خیر

        var msg = error?.response?.data?.message
        var title = error?.response?.data?.title

        errorModal.show(title, msg, () => {
            const originalRequest = error.config;
            // اینجا می‌توانید درخواست اولیه را دوباره ارسال کنید
            return AxiosPublic(originalRequest);
        }, () => {

        })

    }

    // اینجا می‌توانید خطای پاسخ را برگردانید
    return Promise.reject(error);
})


