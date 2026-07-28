import React, { useEffect,  useState } from 'react'

import { AxiosPrivate } from 'app/axiosPrivate';
import endpoints from 'app/endpoints';
import Select from 'react-select';

export default function TariffConditionsDropDown(props) {
    var [options, setOptions] = useState([])
    useEffect(() => {
        getLines()
    }, [])
    var getLines = () => {
        AxiosPrivate.get(endpoints.settingTariffConditions)
            .then((res) => {

                setOptions(
                    [
                        {
                            value: undefined,
                            label: 'انتخاب نشده',
                            type: 1
                        }, ...res?.data?.map(line => ({
                            value: line.tcId,
                            label: line.tcName,
                            type: line.tcType,
                            unitStr: line.tcUnitStr
                        }))
                    ]
                )
            })
    }

    return (

        <Select
            value={options?.find(option => option.value === props?.value)}
            onChange={(e) => {
                props.onChange({ target: { value: e.value, name: props?.name, label: e.label, type: e.type, unitStr: e.unitStr } })

            }}
            isDisabled={props.disabled}

            options={options}
            placeholder="انتخاب کنید..."
            isSearchable={true} // فعال کردن جستجو
        />


    )
}

