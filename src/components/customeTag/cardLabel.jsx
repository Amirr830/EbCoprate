import { useRef } from "react"

export default function CardLabel(props) {
  return <div className={"m-0  p-2 " + props.className}>

    <div className=" row card p-0 m-0 mt-2  " >
      <label for="input1" className="position-absolute px-2 " style={{ marginTop: '-0.80rem' }}>
        <span className="h6 small bg-white rounded  text-muted px-1 noSelect  ">{props.label}</span>
      </label>
      <div className="p-0 m-0 p-2 pt-3">
        {props.children}
      </div>
    </div>
  </div>
}