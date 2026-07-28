import './app.css';
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Login from './routes/public/login';
import Verify from './routes/public/verify';
import Dashboard from './routes/private/Dashboard/dashboard';
import PrivateRoute from './app/privateRoute'
import PublicRoute from './app/publicRoute'
import { ToastContainer, toast } from 'react-toastify';
import Storages from './app/storages';
import paths from './app/paths.json'
import Main from './routes/private/main';
import DriversLocation from './routes/private/reports/driversLocation';
import E423 from './routes/error/e423';
import E401 from './routes/error/e401';
import E403 from './routes/error/e403';
import E404 from './routes/error/e404';
import TripRoute from './routes/private/reports/tripRoute';
import Entrance from './routes/private/actions/entrance';
import Kiosk from './routes/private/actions/kiosk';
import 'react-toastify/dist/ReactToastify.css';
import { MapSettingsProvider } from './contexts/initialMapSettings';
import TdNewTab from './routes/private/reports/tripDetails/tdNewTab';

function App() {
  return (
    <>
      <MapSettingsProvider>

        <Routes>


          {/* private route */}
          <Route path='/' element={<PrivateRoute />}>
            <Route path={paths.private.reports.driverLocation} element={<DriversLocation />} />
            <Route path={paths.private.reports.tripRoute} element={<TripRoute />} />
            <Route path={paths.private.actions.entrance} element={<Entrance />} />
            <Route path={paths.private.actions.kiosk} element={<Kiosk />} />
            <Route path={paths.private.reports.tripDetails} element={<TdNewTab />} />

            <Route path='/*' element={<Main />} />
            <Route path='/' element={<Navigate to={paths.private.dashboard} replace />} />

          </Route>


          {/* public route */}
          <Route path='/' element={<PublicRoute />}>

            <Route path={paths.public.login} element={<Login />} />
            <Route path={paths.public.verify} element={<Verify />} />

          </Route>

        </Routes>
        <ToastContainer stacked position='top-center' />
      </MapSettingsProvider>

    </>
  );
}

export default App;
