import React, { useContext, useState, useEffect, useRef } from 'react'
import acContext from './addCarContext'

import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

import SearchPersonModal from '../../modals/searchPersonModal'
import { MdWifiProtectedSetup } from 'react-icons/md'
import { extractNumber, setComma } from '../../helper/numberHelper'


export default function FinancialInfo() {
    var context = useContext(acContext)

    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name

            context.acDispatch({
                ...context?.acState,
                [name]: extractNumber(value)
            })
        } catch (err) {
            console.log(err)
        }
    }


    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    return (
        <>
            <div className='flex '>
                <div>
                    <form>
                        <div className="col-12 d-flex row ">



                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >مبلغ ثابت تلفنی (ریال)</h5>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="مبلغ ثابت تلفنی"
                                    name="appPrice"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.appPrice}
                                />
                            </div>

                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >مبلغ ثابت اینترنتی (ریال)</h5>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="مبلغ ثابت اینترنتی"
                                    name="callPrice"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={setComma(context?.acState?.callPrice)}
                                />
                            </div>
                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >درصد تلفنی</h5>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="درصد تلفنی"
                                    name="callPercent"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.callPercent
                                    }
                                />
                            </div>
                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >درصد اینترنتی</h5>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="درصد اینترنتی"
                                    name="appPercent"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.appPercent}
                                />
                            </div>

                            <div className=" p-1  col-6" >
                                <div className="d-flex flex-row align-items-center">
                                    <h5 className="ps-2" >آبونمان روزانه (ریال)</h5>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="آبونمان روزانه"
                                    name="dailyCommission"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.acState?.dailyCommission}
                                />
                            </div>
                        </div>
                    </form>

                </div>
                <div className='flex '>
                    <button
                        className='btn btn-primary m-1'
                        onClick={() => {
                            context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep + 1 })
                        }}>
                        مرحله بعد
                    </button>
                    <button
                        className='btn btn-warning m-1'
                        onClick={() => {
                            context.acDispatch({ ...context?.acState, activeStep: context?.acState?.activeStep - 1 })

                        }}>
                        مرحله قبلی

                    </button>
                </div>

            </div>

        </>
    )
}














