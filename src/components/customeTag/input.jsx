export default function Input(props) {
    const addCommas = num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const removeNonNumeric = num => num?.toString().replace(/[^0-9-]/g, "");
    return <input
        className={props.className}
        {...props}
        ref={props?.innerRef}
        type={props?.thousandSeparator || props?.type == "number" ? "text" : props?.type}
        value={props?.thousandSeparator ? addCommas(removeNonNumeric(props?.value)) :
            props?.type == "number" ? removeNonNumeric(props?.value) : props?.value}
        onChange={(e) => {
            if (props?.type== "number"  ) {
                e.target.value = removeNonNumeric(e.target.value)
            }
            props.onChange(e)
        }}
    />
}


