import React from 'react'
import lottieData from '../../assets/lottie/loading.lottie';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export default function Loading() {
    return (
        <div className="d-flex align-items-center justify-content-center p-2">
    
            <DotLottieReact
                src={lottieData}
                loop
                autoplay
                style={{
                    width: 100,
                    height: 100
                }}
            />
        </div>
    );
}