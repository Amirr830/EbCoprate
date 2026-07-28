import React, { useEffect, useState } from 'react'
import { AxiosPrivate } from 'app/axiosPrivate';
import endpoints from 'app/endpoints';
import Select from 'react-select';

export default function CompanyDropDown(props) {
    var [options, setOptions] = useState([])
    useEffect(() => {
        console.log('sssssssssssssss3e3ss')
        getLines()
    }, [])
    var getLines = () => {
        AxiosPrivate.get(endpoints.company)
            .then((res) => {
                if (res?.data?.length == 1) {
                    props.onChange({ target: { value: res?.data[0].coCode, name: props?.name } })
                }
                setOptions([{
                    value: 0,
                    label: 'بدون شرکت'
                }, ...res?.data?.map(line => ({
                    value: line.coCode,
                    label: line.coName
                }))])
            })
    }

    return (

        <Select
            value={options?.find(option => option.value === props?.value)}
            onChange={(e) => {
                props.onChange({ target: { value: e.value, name: props?.name } })
            }}
            isDisabled={props.disabled || options.length == 2}
            options={options}
            placeholder="انتخاب کنید..."
            isSearchable={true} // فعال کردن جستجو
        />


    )
}