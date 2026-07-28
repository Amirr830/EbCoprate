import React, { useState } from "react";
export default function FinancialDriver(props) {
  var [news, setNews] = useState([])
  return (
    <>
      <div>
        {/* جستجو */}
        <div>
          <button>
            افزودن
          </button>
          <button>
            جستجو
          </button>
        </div>
        {
          news.map((item, index) => {
            return <div key={index}>
                
            </div>
          })
        }


      </div>
    </>
  );
}
