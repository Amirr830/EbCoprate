import * as React from 'react';
import { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import AddPersonContext from './addPersonContext'
import AddPersonReducer from './addPersonReducer'
import PersonalInfo from './personalInfo';
import ProgressBar from '../ProgressBar';
import BankAccount from './bankAccount';
import DriverLicense from './driverLicense';
import DutySystem from './dutySystem';
import { AxiosPrivate } from '../../app/axiosPrivate';
import endpoints from '../../app/endpoints';


export default function AddPerson(props) {
    const theme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    // Create rtl cache
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    var [person, setPerson] = useState([])
    var [isLoading, setLoading] = useState(false)

    var getDriverInfo = (smartCode) => {
        setLoading(true)

        console.log(smartCode)
        AxiosPrivate.get(endpoints.driver,
            {
                params: {
                    smartCode
                }
            }).then((res) => {
                try {
                    setPerson(res.data[0])
                    apDispatch({ defaultState })
                    apDispatch({ ...apState, ...res.data[0] })
                } catch (e) {

                }
            }).finally(() => {
                setLoading(false)
            })
    }


    var defaultState = {
        activeStep: 0,
        firstName: undefined,
        lastName: undefined,
        fatherName: undefined,
        birthDate: undefined,
        birthCert: undefined,
        natCode: undefined,
        birthPlace: undefined,
        education: undefined,
        mobile: undefined,
        tel: undefined,
        gender: undefined,
        married: undefined,
        addr: undefined,
        zipCode: undefined,
        bankName: undefined,
        bankAccNum: undefined,
        bankIBAN: undefined,
        bankCardNum: undefined,
        dutyStatus: undefined,
        dutyCardNum: undefined,
        dutyEndDate: undefined,
        dutyIsaar: undefined,
        dutyIsaarPercent: undefined,
        dlNum: undefined,
        dlIssueDate: undefined,
        dlPlace: undefined,
        dlDuration: undefined,
        dlHearing: undefined,
        dlGlasses: undefined

    }
    const [apState, apDispatch] = React.useReducer(AddPersonReducer, defaultState)


    useEffect(() => {
        if (props?.person?.smartCode)
            getDriverInfo(props?.person?.smartCode)

    }, [])

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <AddPersonContext.Provider value={{
                    apDispatch,
                    apState
                }}>
                    {
                        isLoading ?
                            <ProgressBar /> :
                            <div dir="rtl" >
                                <Box className=' w-100' >
                                    <Stepper activeStep={apState.activeStep} orientation="vertical">
                                        <Step key="personalInfo" >
                                            <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { apDispatch({ ...apState, activeStep: 0 }) }}>مشخصات فردی</label></StepLabel>
                                            <StepContent>
                                                <PersonalInfo />
                                            </StepContent>
                                        </Step>
                                        <Step key="bankAccount">
                                            <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { apDispatch({ ...apState, activeStep: 1 }) }}>حساب بانکی</label></StepLabel>
                                            <StepContent>
                                                <BankAccount />

                                            </StepContent>
                                        </Step>
                                        <Step key="dutyStatus">
                                            <StepLabel>
                                                <label className='iranSansBold noSelect aPointer' onClick={() => { apDispatch({ ...apState, activeStep: 2 }) }}>نظام وظیفه</label></StepLabel>
                                            <StepContent>
                                                <DutySystem />

                                            </StepContent>
                                        </Step>
                                        <Step key="driverLicense">
                                            <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { apDispatch({ ...apState, activeStep: 3 }) }}>گواهینامه</label></StepLabel>
                                            <StepContent>
                                                <DriverLicense />
                                            </StepContent>
                                        </Step>

                                    </Stepper>

                                    <div className='p-3 d-flex row'>
                                        <hr />

                                        <p className='iranSansBold'>
                                            از صحت اطلاعات وارد شده اطمینان دارم و میخواهم ثبت شود
                                        </p>

                                        <div>
                                            <button className='btn btn-success m-1' onClick={() => {
                                                console.log(apState)
                                                props.onSubmit(apState)
                                            }}>ثبت شود</button>
                                            <button className='btn btn-warning m-1 ' onClick={() => { apDispatch({ ...apState, activeStep: 0 }) }}>بازبینی</button>
                                        </div>
                                    </div>

                                </Box>


                            </div>

                    }

                </AddPersonContext.Provider>
            </ThemeProvider>
        </CacheProvider>

    );
}
