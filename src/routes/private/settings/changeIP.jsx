import React from "react";
import IpCard from "../../../components/ipCard";
function ChangeIP() {
  var list = [
    {
      name: "شاتل",
      ip: "33.25.92.1",
      active: 1,
      isAccess: 0

    },
    {
      name: "پیشگامتن",
      ip: "33.25.92.1",
      active: 0,
      isAccess: 1
    }
  ]
  return (
    <>
      <div className="m-0 p-3 d-flex row" dir="rtl">
        {list.map((item, index) => {
          return <IpCard item={item} />
        })}

      </div>
    </>
  );
}

export default ChangeIP;
