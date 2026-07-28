import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Storages from '../app/storages';
import paths from '../app/paths.json'

function PublicRoute() {
    const auth = Storages.getRefreshToken(); // determine if authorized, from context or however you're doing it
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    var navigate = useNavigate()
    var location = useLocation()
    console.log(Storages.getAllowReqAfterSec(), location.pathname)



    if (Storages.getAllowReqAfterSec() == 0 && location.pathname == paths.public.verify) {
        console.log(';sssssssssssssssssssssss')
        navigate(paths.public.login)
    }


    return (auth && auth != undefined && auth != 'undefined')
        ?
        <>
            <Navigate to={paths.private.dashboard} />
        </>
        :
        (Storages.getAllowReqAfterSec() == 0 && location.pathname == paths.public.verify)
            ?
            <Navigate to={paths.public.login} />
            :
            (Storages.getAllowReqAfterSec() > 0 && location.pathname == paths.public.login)
                ?
                <Navigate to={paths.public.verify} />
                :
                <>
                    <Outlet />
                </>


}

export default PublicRoute