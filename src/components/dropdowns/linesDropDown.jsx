import React, { useEffect, useRef, useState } from 'react'
import { AxiosPrivate } from 'app/axiosPrivate';
import endpoints from 'app/endpoints';
import Select from 'react-select';

export default function LinesDropDown(props) {
    var [options, setOptions] = useState([])
    useEffect(() => {
        getLines()
    }, [])
    var getLines = () => {
        AxiosPrivate.get(endpoints.line)
            .then((res) => {

                setOptions(
                    [
                        {
                            value: undefined,
                            label: 'انتخاب نشده'
                        }, ...res?.data?.map(line => ({
                            value: line.lineCode,
                            label: line.lineCode + ' - ' + line.lineName
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

