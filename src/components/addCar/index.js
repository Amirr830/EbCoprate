import { useEffect, useReducer, useState } from 'react';
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
import AddCarContext from './addCarContext'
import AddCarReducer from './addCarReducer'
import CarInfo from './carInfo';
import LineInfo from './lineInfo';
import InsuranceInfo from './insuranceInfo';
import OwnerInfo from './ownerInfo';
import FinancialInfo from './financial';
import endpoints from '../../app/endpoints';

import { AxiosPrivate } from '../../app/axiosPrivate';


export default function AddCar(props) {
    const theme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    // Create rtl cache
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    var defaultState = {
        activeStep: 0

    }

    const [acState, acDispatch] = useReducer(AddCarReducer, defaultState)

    var [carTypes, setCarTypes] = useState([])
    var [carClasses, setCarClasses] = useState([])
    var [carLines, setCarLines] = useState([])
    var [queues, setQueues] = useState([])
    var getData = () => {
        AxiosPrivate.get(endpoints.carBasicData)
            .then((res) => {
                setCarLines(res.data.carLines)
                setCarTypes(res.data.carTypes)
                setQueues(res.data.queues)
                setCarClasses(res.data.carClasses)
            })
    }

    useEffect(() => {
        getData()
        acDispatch({ defaultState })
        acDispatch({ ...acState, ...props.car })
        setLoading(false);

    }, [])

    var [isLoading, setLoading] = useState(true)
    return (
        <>
            {
                isLoading ? <></> :
                    <CacheProvider value={cacheRtl}>
                        <ThemeProvider theme={theme}>
                            <AddCarContext.Provider value={{
                                acDispatch,
                                acState
                            }}>

                                <div dir="rtl" >
                                    <Box className=' w-100' >
                                        <Stepper activeStep={acState.activeStep} orientation="vertical">
                                            <Step key="carInfo" >
                                                <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { acDispatch({ ...acState, activeStep: 0 }) }}>مشخصات خودرو</label></StepLabel>
                                                <StepContent>
                                                    <CarInfo carTypes={carTypes} carClasses={carClasses} />
                                                </StepContent>
                                            </Step>

                                            <Step key="insurance" >
                                                <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { acDispatch({ ...acState, activeStep: 1 }) }}>بیمه نامه و معاینه فنی</label></StepLabel>
                                                <StepContent>

                                                    <InsuranceInfo />
                                                </StepContent>
                                            </Step>
                                            <Step key="ownerInfo" >
                                                <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { acDispatch({ ...acState, activeStep: 2 }) }}>مشخصات مالک و کمکی</label></StepLabel>
                                                <StepContent>

                                                    <OwnerInfo />
                                                </StepContent>
                                            </Step>
                                            <Step key="lineInfo" >
                                                <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { acDispatch({ ...acState, activeStep: 3 }) }}>مشخصات خط</label></StepLabel>
                                                <StepContent>
                                                    <LineInfo
                                                        carLines={carLines}
                                                        queues={queues} />
                                                </StepContent>
                                            </Step>

                                            {acState?.lineCode ?
                                                <Step key="financial" >
                                                    <StepLabel><label className='iranSansBold noSelect aPointer' onClick={() => { acDispatch({ ...acState, activeStep: 5 }) }}>مالی</label></StepLabel>
                                                    <StepContent>
                                                        <FinancialInfo />
                                                    </StepContent>
                                                </Step>
                                                : <></>}
                                        </Stepper>

                                        <div className='p-3 d-flex row'>
                                            <hr />

                                            <p className='iranSansBold'>
                                                از صحت اطلاعات وارد شده اطمینان دارم و میخواهم ثبت شود
                                            </p>

                                            <div>
                                                <button className='btn btn-success m-1' onClick={() => {
                                                    console.log(acState)
                                                    props.onSubmit(acState)
                                                }}>ثبت شود</button>
                                                <button className='btn btn-warning m-1 ' onClick={() => { acDispatch({ ...acState, activeStep: 0 }) }}>بازبینی</button>
                                            </div>
                                        </div>

                                    </Box>

                                </div>
                            </AddCarContext.Provider>
                        </ThemeProvider>
                    </CacheProvider>
            }

        </>
    );
}
