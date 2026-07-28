import axios from "axios"
import Storages from "./storages"
import errorModal from "../modals/errorModal";
import { RefreshToken } from "./refreshToken";
import toast from "../components/toast";
const INTERNAL_IP = new URL(process.env.REACT_APP_BASE_URL_INTERNAL)
const EXTERNAL_IP = new URL(process.env.REACT_APP_BASE_URL_EXTERNAL)

const url = window.location.hostname.includes(INTERNAL_IP.hostname) ?
    INTERNAL_IP.href :
    window.location.hostname.includes('localhost') ? INTERNAL_IP.href : EXTERNAL_IP.href;

export const AxiosPrivate = axios.create({
    baseURL: url + "/panel/private",
    withCredentials: false
})

// اینجا می‌توانید یک interceptor
// برای درخواست‌ها اضافه کنید که قبل از ارسال هر درخواستی، توکن فعلی را به 
// header اضافه کند
AxiosPrivate.interceptors.request.use(config => {
    // اینجا می‌توانید توکن را به header اضافه کنید
    config.headers['x-auth-token'] = Storages.getAccessToken();
    // اینجا می‌توانید config را برگردانید
    return config;
}, error => {

    // اینجا می‌توانید خطای درخواست را برگردانید
    return Promise.reject(error);
})


// اینجا می‌توانید یک interceptor
// برای پاسخ‌ها اضافه کنید که در صورت دریافت خطای 403، توکن را تازه کند 
// و درخواست اولیه را دوباره ارسال کند
AxiosPrivate.interceptors.response.use((response) => {
    // اینجا می‌توانید پاسخ را برگردانید

    return response;

}, async (error) => {

    // اینجا می‌توانید بررسی کنید که آیا خطایی رخ داده است یا خیر
    if (error?.response) {
        // اینجا می‌توانید بررسی کنید که آیا وضعیت خطا 401 است یا خیر
        if (error?.response?.status === 401) {
            // اینجا می‌توانید config درخواست اولیه را بخوانید
            const originalRequest = error.config;
            // اینجا می‌توانید توکن را تازه کنید
            const newToken = await RefreshToken();
            // اینجا می‌توانید توکن جدید را به header اضافه کنید
            originalRequest.headers['x-auth-token'] = newToken;
            // اینجا می‌توانید درخواست اولیه را دوباره ارسال کنید
            return AxiosPrivate(originalRequest);
        } else if (error?.response?.status === 403) {
            Storages.removeUserToken()
            window.location.reload(false)
        } else {

            console.log(error?.response)
            if (error?.response?.status == 404) {
                errorModal.show("404", "برای درخواست ارسال شده پاسخی یافت نشد", () => {
                    const originalRequest = error.config;
                    // اینجا می‌توانید درخواست اولیه را دوباره ارسال کنید
                    return AxiosPrivate(originalRequest);
                }, () => {

                })
            } else if (error?.response?.status == 500) {
                errorModal.show("500", "خطای در پشت صحنه اجرای عملیات رخ داده است با پشتیبان تماس بگیرید", () => {
                    const originalRequest = error.config;
                    // اینجا می‌توانید درخواست اولیه را دوباره ارسال کنید
                    return AxiosPrivate(originalRequest);
                }, () => {

                })
            } else if (error?.response?.status == 421) {
                toast.Error(error?.response?.data?.title)

            } else {
                var msg = error?.response?.data?.message
                var title = error?.response?.data?.title
                errorModal.show(title, msg, () => {
                    const originalRequest = error.config;
                    // اینجا می‌توانید درخواست اولیه را دوباره ارسال کنید
                    return AxiosPrivate(originalRequest);
                }, () => {
                })
            }
        }
    }

    // اینجا می‌توانید خطای پاسخ را برگردانید
    return Promise.reject(error);
})


