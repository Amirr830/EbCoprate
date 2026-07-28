import React from 'react'
import lottieData from '../../assets/lottie/searching.lottie';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottieDataLoading from '../../assets/lottie/loading.lottie';


export default function SearchList(props) {

    return (<div className='row  justify-content-center align-items-center '>
        <DotLottieReact
            src={lottieData}
            loop
            autoplay
            style={{ width: 220, height: 220 }}
        />
        <div className="d-flex align-items-center justify-content-center p-2">
            <h2 className="mb-0 ms-2">
                در حال جستجو
            </h2>
            <DotLottieReact
                src={lottieDataLoading}
                loop
                autoplay
                style={{
                    width: 50,
                    height: 50
                }}
            />


        </div>
    </div>

    )
}

