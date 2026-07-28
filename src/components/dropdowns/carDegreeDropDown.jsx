
import Select from 'react-select';

export default function CarDegreeDropDown(props) {
    var options = [
        {
            value: 1,
            label: 'درجه 1'
        }, {
            value: 2,
            label: 'درجه 2'
        }, {
            value: 3,
            label: 'درجه 3'
        }
    ]

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

