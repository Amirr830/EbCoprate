import Dropdown from 'react-bootstrap/Dropdown';
import React, { useEffect, useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import LockStatusModal from '../../modals/lockStatusModal';
import { BsFillLockFill } from 'react-icons/bs'
import { AxiosPrivate } from '../../app/axiosPrivate';
import endpoints from '../../app/endpoints';
import Select from 'react-select';

export default function ShiftDropDown(props) {
    var [options, setOptions] = useState([])
    useEffect(() => {
        getShifts()
    }, [])
    var getShifts = () => {
        AxiosPrivate.get(endpoints.shift)
            .then((res) => {
                setOptions(
                    [
                        {
                            value: undefined,
                            label: 'انتخاب نشده'
                        }, ...res?.data?.map(shift => ({
                            value: shift.shiftCode,
                            label: shift.shiftName
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

