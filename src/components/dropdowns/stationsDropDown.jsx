import React, { useEffect, useRef, useState } from 'react'
import { AxiosPrivate } from 'app/axiosPrivate';
import endpoints from 'app/endpoints';
import Select from 'react-select';

export default function StationsDropDown(props) {
    var [options, setOptions] = useState([])
    useEffect(() => {
        console.log("Sssssssssss",props?.value)
        getLines()
    }, [])
    var getLines = () => {
        AxiosPrivate.get(endpoints.stations)
            .then((res) => {
                setOptions([
                    {
                        value: undefined,
                        label: 'انتخاب نشده'
                    },
                    ...res?.data?.map(line => ({
                        value: line.stCode,
                        label: line.stCode + '-' + line.stName
                    }))
                ]
                )
            })
    }

    return (
        <Select
            value={options?.find(option => option.value === props?.value)}
            onChange={(e) => {
                props.onChange({ target: { value: e.value, name: props?.name } })
            }}
            isDisabled={props.disabled}
            options={options}
            placeholder="انتخاب کنید..."
            isSearchable={true} // فعال کردن جستجو
        />


    )
}