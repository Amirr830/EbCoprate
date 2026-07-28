import { useRef } from "react"

export default function InputLabel(props) {
  return <div className="col-12">
    <div className="col row p-0 m-0 mb-2 position-relative">
      <label className="position-absolute px-2"
        style={{ marginTop: '-0.35rem' }}>
        <span className="h6 small bg-white text-muted px-1 noSelect">{props.placeholder}</span>
      </label>
      <input className="form-control mt-2 text-primary" {...props} />
    </div>
  </div>
}



