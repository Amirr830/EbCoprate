import Dropdown from 'react-bootstrap/Dropdown';
import React, { useEffect, useRef, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { GiSteeringWheel } from 'react-icons/gi'
import LockStatusModal from '../../modals/lockStatusModal';
import { BsFillLockFill } from 'react-icons/bs'
import { AxiosPrivate } from '../../app/axiosPrivate';
import endpoints from '../../app/endpoints';
import Select from 'react-select';

export default function ShiftGroupDropDown(props) {
    var [options, setOptions] = useState([])
    useEffect(() => {
        getShifts()
    }, [])
    var getShifts = () => {
        AxiosPrivate.get(endpoints.shiftGroup)
            .then((res) => {
                setOptions(
                    [
                        ...res?.data?.map(shift => ({
                            value: shift.shiftGroupCode,
                            label: shift.shiftGroupName
                        }))
                    ]
                )
            })
    }

    return (

        <Select
            value={options?.filter(option => props?.value?.includes(option.value))}
            onChange={(selected) => {
                props.onChange({
                    target: {
                        value: selected.map(s => s.value),
                        name: props?.name
                    }
                });
            }}

            isDisabled={props.disabled}
            isMulti
            closeMenuOnSelect={false}
            options={options}
            placeholder="انتخاب کنید..."
            isSearchable={true} // فعال کردن جستجو
        />


    )
}

