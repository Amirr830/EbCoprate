import { fa2En } from "./numberHelper"

function yyyymmdd(value) {
    if (value == undefined) return ''
    if (value == null) return ''
    if (value == '') return ''

    try {
        value = value.replace('Z', '')
    } catch (e) { }
    return new Date(value).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function mmdd(value) {
    if (value == undefined) return ''
    if (value == null) return ''
    if (value == '') return ''

    try {
        value = value.replace('Z', '')
    } catch (e) { }
    return new Date(value).toLocaleDateString('fa-IR', { month: '2-digit', day: '2-digit' })
}

function yyyy(value) {
    if (value == undefined) return ''
    if (value == null) return ''
    if (value == '') return ''

    try {
        value = value.replace('Z', '')
    } catch (e) { }
    return fa2En(new Date(value).toLocaleDateString('fa-IR', { year: 'numeric' }))
}
function yyyymmddhhmm(value) {
    if (value == undefined) return ''
    if (value == null) return ''
    if (value == '') return ''

    try {
        value = value.replace('Z', '')
    } catch (e) { } return new Date(value).toLocaleTimeString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function dateStr(value) {
    try {
        value = value.replace('Z', '')
    } catch (e) {

    }
    return (new Date(value).toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' })
        + " " + new Date(value).toLocaleDateString('fa-IR', { year: 'numeric' }))
}
function dateTimeStr(value) {
    try {
        value = value.replace('Z', '')
    } catch (e) { }
    var str = new Date(value).toLocaleTimeString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    return str.replace('ساعت', new Date(value).toLocaleDateString('fa-IR', { year: 'numeric' }) + ' ساعت')
}

function timeStr(value) {
    try {
        value = value.replace('Z', '')
    } catch (e) { } return new Date(value).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}
function hhmm(value) {
    try {
        value = value.replace('Z', '')
    } catch (e) { }
    return fa2En(new Date(value).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }))
}
function hhmmss(value) {
    try {
        value = value.replace('Z', '')
    } catch (e) { } return new Date(value).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}


/**
 * 
 * @param {*} date  
 * @param {*} add  add is a milisecond number 
 * @returns 
 */
function addDate(date, add) {
    return new Date(date.getTime() + add)
}
function milisecond2timeStr(value) {
    try {
        value = value.replace('Z', '')
    } catch (e) { }
    return (Math.floor(value / 1000 / 60 / 60)).toString().padStart(2, '0')
        + ':' + (Math.floor(value / 1000 / 60 % 60)).toString().padStart(2, '0')
}
function withoutTZ(date) {
    date = new Date(date)
    //اینجا چک میکنیم که تاریخ وارد شده درست هست یا نه
    // به این صورت که اگر فرمت تاریخ مشکل داشته باشه 
    //توابع مقدار NaN برمیگردونن
    //و مقدار NaN هیچگاه با خودش برابر نیست
    if (date.getTime() === date.getTime()) {
        var time =
            date.getFullYear() + '-' +
            (date.getMonth() + 1).toString().padStart(2, 0) + '-' +
            (date.getDate()).toString().padStart(2, 0) + 'T' +
            date.getHours().toString().padStart(2, 0) + ':' +
            date.getMinutes().toString().padStart(2, 0) + ':' +
            date.getSeconds().toString().padStart(2, 0) + '.000'

        return time
    } else
        return null
}

export {
    yyyy,
    yyyymmdd,
    dateStr,
    timeStr,
    yyyymmddhhmm,
    hhmm,
    milisecond2timeStr,
    dateTimeStr,
    addDate,
    withoutTZ,
    hhmmss,
    mmdd
} 