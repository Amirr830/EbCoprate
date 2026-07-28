import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Storages from '../app/storages';
import paths from './paths.json'
import {CheckAccess} from './checkAccess'
function PrivateRoute() {
    const auth = Storages.getRefreshToken(); // determine if authorized, from context or however you're doing it

    var location = useLocation()

    var [access, setAccess] = useState(true)
    useEffect(() => {
        var a = location.pathname.split('/')[2]
        console.log(a)
        setAccess(CheckAccess(a))
        // if (location.pathname == paths.private.cars)
        // setAccess(false)
        // else
        // setAccess(true)
    }, [location])
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return (auth && auth != undefined && auth != 'undefined') ?
        <>
            {
                access ?
                    <Outlet />
                    :
                    <Navigate to={paths.private.e423} />
            }
        </> :
        <>
            <Navigate to={paths.public.login} />
        </>
        ;
}

export default PrivateRoute