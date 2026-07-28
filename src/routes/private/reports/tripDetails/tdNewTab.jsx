import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "../../../../components/toast";
import { hhmm } from "../../../../helper/dateHelper";
import TripDetailsModule from "./tdBody";
import { useSearchParams } from "react-router-dom";

export default function TdNewTab(props) {

    const [params] = useSearchParams();
    var tripCode = params.get('tripCode');
    return (
        <>
            <TripDetailsModule tripCode={tripCode}
                onClose={() => {
                    window.close()
                }} />
        </>
    )


}

