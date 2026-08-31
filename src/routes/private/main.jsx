import React, {
  useEffect,
  useReducer,
  useRef,
  useState
} from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";

import Backup from "./actions/backup";
import paths from "../../app/paths.json";
import dictionary from "../../app/dictionary.json";
import menu from "../../app/menu.js";
import Storages from "../../app/storages";
import DashboardContext from "../../contexts/dashboardContext";
import NavbarReducer from "../../reducers/navbarReducer";
import "./main.css";

import { HiOutlineMenuAlt3 } from "react-icons/hi";

import ChangeIP from "./settings/changeIP";
import Settings from "./settings";
import Cars from "./definitions/cars";
import CarBrands from "./definitions/carBrands";
import Persons from "./definitions/persons";
import Dashboard from "./Dashboard/dashboard";
import Reserve from "./actions/reserve";
import Definitions from "./definitions";
import Users from "./definitions/users";
import UserGroup from "./definitions/userGroup";

import E423 from "../error/e423";
import E404 from "../error/e404";

import ReportTaximeter from "./reports/reportTaximeter";
import TripHistory from "./reports/tripHistory";
import Verify from "./reports/verify";
import DriverTripCount from "./reports/driverTripCount";
import QueIO from "./reports/queIO";
import TripChartHourly from "./reports/tripChartHourly";
import TripChartDaily from "./reports/tripChartDaily";
import TripChartMonthly from "./reports/tripChartMonthly";
import CountInQue from "./reports/countInQue";
import TotalTripSendPerMonth from "./reports/totalTripSendPerMonth";
import DriverTimeLine from "./reports/driverTimeLine";
import TripCountReport from "./reports/tripCountReport";
import RFIDLogs from "./reports/RFIDLogs";
import Census from "./reports/census";
import RFIDChart from "./reports/RFIDChart";
import ShiftReport from "./reports/shiftReport";

import endpoints from "../../app/endpoints";
import { AxiosPrivate } from "../../app/axiosPrivate";

import DriverSetting from "./settings/driverSetting";
import TripManageSetting from "./settings/tripManageSetting";
import TariffSetting from "./settings/tariffSetting";
import SmsSetting from "./settings/smsSetting";
import OperatorSetting from "./settings/operatorSetting";
import PassengerSetting from "./settings/passengerSetting";
import ControlPanelSetting from "./settings/controlPanelSetting";

import Actions from "./actions";
import PhysicalActions from "./definitions/physicalActions";
import TripsMonit from "./actions/TripsMonit";
import Lines from "./definitions/lines";
import CarClass from "./definitions/carClass";
import CarTypes from "./definitions/carTypes";
import Subscribers from "./definitions/subscribers";
import Stations from "./definitions/stations";
import StationsTemp from "./definitions/stationsTemp";
import ComplaintType from "./definitions/complaintsType";
import News from "./actions/news";
import Payment2Driver from "./actions/payment2Driver";
import DriverPayment from "./actions/driverPayment";
import Companies from "./definitions/companies";
import FrequentDests from "./definitions/frequentDests";
import DuplicateAddress from "./definitions/duplicateAddress";
import SurveyOptions from "./definitions/surveyOptions";
import DefaultMessages from "./definitions/DefualtMessages";
import Shifts from "./definitions/shifts";
import ShiftGroups from "./definitions/shiftGroups";
import ShiftPattern from "./definitions/shiftPattern";

import Weather from "./actions/weather";
import Messanger from "./actions/messanger";

import Wallet from "./Wallet/Wallet";
import Header from "./Dashboard/Header";
import Sidebarr from "./Dashboard/SideBar";

import UserAccount from "../private/UserAccount/UserAccount";

import { useSocket } from "contexts/socketContext";

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [activeMenu, setActiveMenu] = useState(undefined);
  const [showBack, setShowBack] = useState(false);
  const [onKeyDown, setOnKeyDown] = useState();
  const [pageHistory, setPageHistory] = useState([]);

  const divScrollRef = useRef(null);

  const [navState, navDispatch] = useReducer(
    NavbarReducer,
    {
      activePage: undefined
    }
  );

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const isDashboard =
    location.pathname === paths.private.dashboard;

  const minSwipeDistance = 50;

  const getBasicInfo = () => {
    setLoading(true);

    AxiosPrivate
      .get(endpoints.basicInfo)
      .then((res) => {
        console.log(res.data);

        Storages.setUserInfo(res.data);
        Storages.setAccessLevel(res.data.accessLevel);
        Storages.setTileServer(res.data.tileServerUrl);

        setUserInfo(res.data);
      })
      .catch((error) => {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCities = () => {
    AxiosPrivate
      .get(endpoints.cities)
      .then((res) => {
        Storages.setCities(res.data);
      })
      .catch(() => {
        Storages.setCities([
          {
            cityName: "مشهد",
            centerLat: 35.741777991519456,
            centerLng: 51.396147723718286,
            rightLat: 36.321099,
            rightLng: 59.702532,
            leftLat: 36.33118,
            leftLng: 59.454691
          }
        ]);
      });
  };

  const path2MenuId = (menuItems, path) => {
    menuItems.forEach((element) => {
      if (element.sub) {
        path2MenuId(element.sub, path);
      } else if (element.path === path) {
        setActiveMenu(element.id);
      }
    });
  };

  useEffect(() => {
    getBasicInfo();
    getCities();
    path2MenuId(menu, window.location.pathname);
  }, []);

  useEffect(() => {
    if (
      location.pathname === paths.private.actions.dashboard ||
      location.pathname === paths.private.dashboard ||
      location.pathname === paths.private.definitions.dashboard ||
      location.pathname === paths.private.settings.dashboard ||
      location.pathname === paths.private.reports.dashboard
    ) {
      return;
    }

    const pageExists = pageHistory.some(
      (page) => page === location.pathname
    );

    if (pageExists) {
      return;
    }

    if (pageHistory.length >= 5) {
      setPageHistory((previousState) => [
        ...previousState.slice(1),
        location.pathname
      ]);
    } else {
      setPageHistory((previousState) => [
        ...previousState,
        location.pathname
      ]);
    }
  }, [location.pathname]);

  useEffect(() => {
    setShowBack(
      location.pathname !== paths.private.dashboard
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessage = (data) => {
      console.log("message:", data);
    };

    const handleRinging = (data) => {
      console.log("ringing:", data);
    };

    socket.on("message", handleMessage);
    socket.on("ringing", handleRinging);

    return () => {
      socket.off("message", handleMessage);
      socket.off("ringing", handleRinging);
    };
  }, [socket]);

  const onTouchStart = (event) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  };

  const onTouchMove = (event) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }

    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRightSwipe) {
      setOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
        <h4>در حال تنظیم صفحه برای شما</h4>

        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        divScrollRef,
        onKeyDown,
        showBack,
        userInfo
      }}
    >
      <div
        className="main-layout"
        dir="rtl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isOpen && (
          <>
            <div
              className="mobile-sidebar-overlay"
              onClick={() => setOpen(false)}
            />

            <div className="mobile-sidebar-container">
              <Sidebarr
                menu={menu}
                onClose={() => setOpen(false)}
              />
            </div>
          </>
        )}

        <header className="desktop-header">
          <div className="desktop-header-sidebar">
            <Sidebarr menu={menu} />
          </div>

          <div className="desktop-header-area">
            <Header />
          </div>
        </header>

        {!isDashboard && (
          <div className="mobile-header">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setOpen(true)}
            >
              <HiOutlineMenuAlt3 />
            </button>

            <span className="mobile-header-title">
              {dictionary?.title || "پنل مدیریت"}
            </span>

            <div className="mobile-header-placeholder"></div>
          </div>
        )}

        <main
          className="main-page-content"
          tabIndex={0}
          onKeyDown={setOnKeyDown}
          ref={divScrollRef}
          onClick={() => setOpen(false)}
        >
          <div className="main-content-inner">
            <Routes>
              <Route
                path="/control-panel"
                element={
                  <Navigate
                    to={paths.private.dashboard}
                    replace
                  />
                }
              />

              <Route
                path={paths.private.dashboard}
                element={<Dashboard />}
              />

              <Route
                path={paths.private.actions.backup}
                element={<Backup />}
              />

              <Route
                path={paths.private.settings.dashboard}
                element={<Settings />}
              />

              <Route
                path={paths.private.settings.driver}
                element={<DriverSetting />}
              />

              <Route
                path={paths.private.settings.passenger}
                element={<PassengerSetting />}
              />

              <Route
                path={paths.private.settings.operator}
                element={<OperatorSetting />}
              />

              <Route
                path={paths.private.settings.sms}
                element={<SmsSetting />}
              />

              <Route
                path={paths.private.settings.tariff}
                element={<TariffSetting />}
              />

              <Route
                path={paths.private.settings.tripManage}
                element={<TripManageSetting />}
              />

              <Route
                path={paths.private.settings.controlPanel}
                element={<ControlPanelSetting />}
              />

              <Route
                path={paths.private.actions.changeIP}
                element={<ChangeIP />}
              />

              <Route
                path={paths.private.definitions.carBrand}
                element={<CarBrands />}
              />

              <Route
                path={paths.private.reports.taximeter}
                element={<ReportTaximeter />}
              />

              <Route
                path={paths.private.reports.tripHistory}
                element={<TripHistory />}
              />

              <Route
                path={paths.private.reports.verify}
                element={<Verify />}
              />

              <Route
                path={paths.private.reports.driverTripCount}
                element={<DriverTripCount />}
              />

              <Route
                path={paths.private.reports.queIO}
                element={<QueIO />}
              />

              <Route
                path={paths.private.reports.tripChartHourly}
                element={<TripChartHourly />}
              />

              <Route
                path={paths.private.reports.tripChartDaily}
                element={<TripChartDaily />}
              />

              <Route
                path={paths.private.reports.tripChartMonthly}
                element={<TripChartMonthly />}
              />

              <Route
                path={paths.private.reports.totalTripMonth}
                element={<TotalTripSendPerMonth />}
              />

              <Route
                path={paths.private.reports.countInQue}
                element={<CountInQue />}
              />

              <Route
                path={paths.private.reports.driverTimeLine}
                element={<DriverTimeLine />}
              />

              <Route
                path={paths.private.reports.tripCountReport}
                element={<TripCountReport />}
              />

              <Route
                path={paths.private.reports.rfid}
                element={<RFIDLogs />}
              />

              <Route
                path={paths.private.reports.rfidChart}
                element={<RFIDChart />}
              />

              <Route
                path={paths.private.reports.census}
                element={<Census />}
              />

              <Route
                path={paths.private.reports.shifts}
                element={<ShiftReport />}
              />

              <Route
                path={paths.private.definitions.dashboard}
                element={<Definitions />}
              />

              <Route
                path={paths.private.definitions.users}
                element={<Users />}
              />

              <Route
                path={paths.private.definitions.lines}
                element={<Lines />}
              />

              <Route
                path={paths.private.definitions.userGroup}
                element={<UserGroup />}
              />

              <Route
                path={paths.private.definitions.persons}
                element={<Persons />}
              />

              <Route
                path={paths.private.definitions.carTypes}
                element={<CarTypes />}
              />

              <Route
                path={paths.private.definitions.cars}
                element={<Cars />}
              />

              <Route
                path={paths.private.definitions.carClass}
                element={<CarClass />}
              />

              <Route
                path={paths.private.definitions.complaints}
                element={<ComplaintType />}
              />

              <Route
                path={paths.private.definitions.companies}
                element={<Companies />}
              />

              <Route
                path={paths.private.definitions.frequentDests}
                element={<FrequentDests />}
              />

              <Route
                path={paths.private.definitions.duplicateAddress}
                element={<DuplicateAddress />}
              />

              <Route
                path={paths.private.definitions.subscribers}
                element={<Subscribers />}
              />

              <Route
                path={paths.private.definitions.stations}
                element={<Stations />}
              />

              <Route
                path={paths.private.definitions.stationsV2}
                element={<StationsTemp />}
              />

              <Route
                path={paths.private.definitions.physicalActions}
                element={<PhysicalActions />}
              />

              <Route
                path={paths.private.definitions.surveyOptions}
                element={<SurveyOptions />}
              />

              <Route
                path={paths.private.definitions.defMsg}
                element={<DefaultMessages />}
              />

              <Route
                path={paths.private.definitions.shifts}
                element={<Shifts />}
              />

              <Route
                path={paths.private.definitions.shiftGroups}
                element={<ShiftGroups />}
              />

              <Route
                path={paths.private.definitions.shiftPattern}
                element={<ShiftPattern />}
              />

              <Route
                path={paths.private.definitions.Wallet}
                element={<Wallet />}
              />

              <Route
                path={paths.private.definitions.userAccount}
                element={<UserAccount />}
              />

              <Route
                path={paths.private.actions.dashboard}
                element={<Actions />}
              />

              <Route
                path={paths.private.actions.reserve}
                element={<Reserve />}
              />

              <Route
                path={paths.private.actions.tripsMonit}
                element={<TripsMonit />}
              />

              <Route
                path={paths.private.actions.news}
                element={<News />}
              />

              <Route
                path={paths.private.actions.driverPayment}
                element={<DriverPayment />}
              />

              <Route
                path={paths.private.actions.payment2Driver}
                element={<Payment2Driver />}
              />

              <Route
                path={paths.private.actions.messanger}
                element={<Messanger />}
              />

              <Route
                path={paths.private.actions.weather}
                element={<Weather />}
              />

              <Route
                path={paths.private.e423}
                element={<E423 />}
              />

              <Route
                path="*"
                element={<E404 />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}

export default Main;