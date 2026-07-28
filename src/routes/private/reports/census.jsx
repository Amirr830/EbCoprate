import React, { useContext, useEffect, useRef, useState } from 'react'
import dashboardContext from "../../../contexts/dashboardContext";

import endpoints from '../../../app/endpoints';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from '../../../components/toast';
import Input from '../../../components/customeTag/input';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { dateTimeStr, hhmm, withoutTZ, yyyymmdd } from '../../../helper/dateHelper';
import { AxiosPrivate } from '../../../app/axiosPrivate';
import { IoIosCall } from "react-icons/io";
import { FaCar } from "react-icons/fa";
import { MdOutlineTripOrigin } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { Card } from 'react-bootstrap';
import StationsDropDown from 'components/dropdowns/stationsDropDown';
import { Bar } from 'react-chartjs-2'  // تغییر به Bar
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,   // اضافه کردن BarElement برای نمودار میله‌ای
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels'  // اضافه کردن پلاگین برای نمایش مقدار روی هر ستون
import ProgressBar from '../../../components/ProgressBar';
import LinesDropDown from 'components/dropdowns/linesDropDown';


// Register components and plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels   // ثبت پلاگین
);

export default function Census() {
    var [data, setData] = useState([])
    var [options, setOptions] = useState(undefined)
    var [dataSet, setDataSet] = useState(undefined)
    var [labels, setLabels] = useState([])


    var [isLoad, setLoading] = useState(false)
    var [params, setParams] = useState({
        date: new Date(),
    })


    function getGradientColor(value, min, max) {
        // نرمالایز مقدار به 0 تا 1
        const ratio = (value - min) / (max - min);

        if (ratio <= 0.5) {
            // رنگ از قرمز به زرد
            // ratio 0 تا 0.5 → 0 تا 1 در این بخش
            const localRatio = ratio / 0.5;
            const r = 255;
            const g = Math.round(255 * localRatio);
            const b = 0;
            return `rgb(${r},${g},${b})`;
        } else {
            // رنگ از زرد به سبز
            // ratio 0.5 تا 1 → 0 تا 1 در این بخش
            const localRatio = (ratio - 0.5) / 0.5;
            const r = Math.round(255 * (1 - localRatio));
            const g = 255;
            const b = 0;
            return `rgb(${r},${g},${b})`;
        }
    }


    var initChart = (data) => {
        try {
            if (!data) return;
            const minValue = Math.min(...data);
            const maxValue = Math.max(...data);

            const colors = data?.map(value => getGradientColor(value, minValue, maxValue));

            setDataSet({
                labels: labels,
                datasets: [
                    {
                        label: 'نمودار میانگین ساعتی سفر ها',
                        data: data,
                        backgroundColor: colors,
                        borderColor: colors,
                        borderWidth: 1,
                    },
                ],
            })

            setOptions({
                responsive: true,
                layout: {
                    padding: {
                        top: 20,  // اینجا پدینگ بالا میذاره به نمودار
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                    },
                    title: {
                        display: false,
                        text: 'نمودار میله‌ای میانگین ساعتی سفر ها'
                    },
                    datalabels: {   // تنظیمات نمایش مقدار روی هر ستون
                        anchor: 'end',
                        align: 'top',
                        color: 'black',
                        font: {
                            weight: 'bold',
                            size: 12,
                            family: 'iranSansBold'
                        }
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'ساعت'
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'تعداد سفر'
                        },
                        suggestedMin: 0,
                        suggestedMax: maxValue + (maxValue * 0.1),

                    }
                }
            })


        } catch (e) {

        }
    }

    var getData = () => {
        setLoading(true)
        AxiosPrivate.get(endpoints.repotTripChartDaily,
            {
                params: {
                    ...params
                }
            }).then((res) => {
                var counts = res.data.map(item => item?.chartValue)
                var labels = res.data.map(item => item?.chartLabel)
                setData(counts)
                setLabels(labels)
                initChart(counts)

            }).finally(() => {
                setLoading(false)
            })
    }
    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name

        setParams({
            ...params,
            [name]: value
        })
    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() == "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };
    const chartRef = useRef();

    const exportPDF = () => {
        const input = chartRef.current;
        if (!input) return;

        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('chart.pdf');
        });
    };
    return (
        <div >
            <div className='row g-2 pb-3 sticky-top  ' style={{ backgroundColor: '#ECEFF1' }}>
                <form className='row col-12 col-md-9 g-2  '>

                    <div className='col-6'>

                        <StationsDropDown
                            name="stCode"
                            value={params?.stCode}
                            onChange={readChange}
                        />

                    </div>

                    <div className='col-6'>

                        <LinesDropDown
                            name="lineCode"
                            value={params?.lineCode}
                            onChange={readChange}
                        />

                    </div>
                    <div className='col-6 '>
                        <DatePicker
                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            className="rmdp-mobile"
                            format="YYYY/MM/DD"
                            calendar={persian}
                            locale={persian_fa}
                            onKeyDown={handleEnter}
                            onChange={(date) => {

                                if (date)
                                    date = new Date(date.unix * 1000)
                                else
                                    date = undefined
                                setParams(prevState => ({
                                    ...prevState,
                                    fromDate: date
                                }))
                            }}
                            placeholder='از تاریخ'
                            value={params?.fromDate || ''}
                            calendarPosition="bottom-left"
                        />
                    </div>
                    <div className='col-6 '>
                        <DatePicker
                            inputClass='form-control'
                            containerStyle={{
                                width: "100%"
                            }}
                            className="rmdp-mobile"
                            format="YYYY/MM/DD"
                            calendar={persian}
                            locale={persian_fa}
                            onKeyDown={handleEnter}
                            onChange={(date) => {

                                if (date)
                                    date = new Date(date.unix * 1000)
                                else
                                    date = undefined
                                setParams(prevState => ({
                                    ...prevState,
                                    toDate: date
                                }))
                            }}
                            placeholder='تا تاریخ'
                            value={params?.toDate || ''}
                            calendarPosition="bottom-left"
                        />
                    </div>
                </form>
                <div className='col-12 col-md-3 row g-2'>

                    <div className='col-12'>
                        <button className='col-12 btn btn-warning '
                            onClick={() => {
                                getData(true)
                            }} >جستجو</button>
                    </div>
                    <div className='col-12'>
                        <button className='col-12 btn btn-danger '
                            onClick={() => {
                                exportPDF()
                            }} >خروجی PDF</button>
                    </div>
                </div>


            </div>
            <div
                style={{ height: '90vh', width: '100%' }}
                ref={chartRef}
                className="align-item-center justify-content-center d-flex">
                {
                    isLoad ? <ProgressBar /> :
                        options != undefined && dataSet != undefined ? <Bar data={dataSet} options={options} /> : <></>
                }
            </div>


        </div >
    )
}


