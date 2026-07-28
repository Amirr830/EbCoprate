import React, { useEffect, useRef, useState } from 'react'

import Storages from 'app/storages';

export default function CitiesDropDown(props) {
    var [options, setOptions] = useState([...Storages.getCities()?.map((city, index) => ({
        value: index,
        label: city.cityName
    }))])


    return (<>
        {
            Storages.getCities().length > 1 ?
                <div>
                    <select className='form-select' onChange={(e) => {
                        props.onChange(Storages.getCities()[e.target.value])
                    }}>
                        {Storages.getCities().map((city, index) => {
                            return <option value={index}>
                                {city.cityName}
                            </option>
                        })
                        }
                    </select>
                </div>
                : <></>
        }
    </>
    )
}