import React, { useContext } from 'react'

import apContext from './addPersonContext'

export default function BankAccount() {
    var context = useContext(apContext)

    const handleOnChange = (e) => {
        try {
            var value = e.target.value
            var name = e.target.name
            context.apDispatch({
                ...context?.apState,
                [name]: value
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
                        <div className="col-12 g-2  row ">
                            <div className="col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >نام بانک</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="نام بانک"
                                    name="bankName"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.bankName|| ''}
                                />
                            </div>

                            <div className="col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره حساب</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره حساب"
                                    name="bankAccNum"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.bankAccNum|| ''}
                                />
                            </div>

                            <div className="col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره شبا (بدون IR)</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره شبا"
                                    name="bankIBAN"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.bankIBAN}
                                />

                            </div>
                            <div className="col-12" >
                                <div className="d-flex flex-row align-items-center">
                                    <label className="ps-2" >شماره کارت</label>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    placeholder="شماره کارت"
                                    name="bankCardNum"
                                    onChange={handleOnChange}
                                    onKeyDown={handleEnter}
                                    value={context?.apState?.bankCardNum || ''}
                                />
                            </div>

                        </div>
                    </form>

                </div>
                <div className='flex mt-3'>
                    <button
                        className='btn btn-primary '
                        onClick={() => {
                            context.apDispatch({ ...context?.apState, activeStep: context?.apState?.activeStep + 1 })
                        }}>
                        مرحله بعد
                    </button>
                    <button
                        className='btn btn-warning m-1'
                        onClick={() => {
                            context.apDispatch({ ...context?.apState, activeStep: context?.apState?.activeStep - 1 })
                        }}>
                        قبلی
                    </button>
                </div>

            </div>
        </>
    )
}














