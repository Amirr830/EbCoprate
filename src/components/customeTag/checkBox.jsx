import { useRef } from "react"

export default function CheckBox(props) {

  var checkbox = useRef()
  var { className, ...otherProps } = props
  return <div className={"d-flex " + className} >


    <div className="form-check form-switch">
      <input className="form-check-input"
        type="checkbox"
        role="switch"
        ref={checkbox}

        id={props.title}

        {...otherProps} />
    </div>
    <label className={"form-check-label noSelect mx-2 " + props?.inputClass}
      htmlFor={props.title}
    >
      {props.title}
    </label>

  </div>
}

