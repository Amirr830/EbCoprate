import React from 'react'
import lottieData from '../../assets/lottie/empty.lottie';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Loading from './loading';

export default function NoResult(props) {

    return (<div className='row  justify-content-center align-items-center '>

        <DotLottieReact
            src={lottieData}
            loop
            autoplay
            style={{ width: 220, height: 220 }}
        />
        <h2 className='col-12 text-center '>موردی یافت نشد   </h2>

    </div>

    )
}
