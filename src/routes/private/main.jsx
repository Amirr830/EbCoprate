
import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Navigate,
  useNavigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import Backup from "./actions/backup";
import paths from "../../app/paths.json";
import dictionary from "../../app/dictionary.json";
import menu from "../../app/menu.js";
import Storages from "../../app/storages";
import {
  TiThLarge,
  TiHome,
  TiPower
} from "react-icons/ti";
import Sidebar from "../../components/sidebar";
import ChangeIP from "./settings/changeIP";
import Settings from "./settings";
import DashboardContext from "../../contexts/dashboardContext";
import NavbarReducer from "../../reducers/navbarReducer";
import { CgClose } from "react-icons/cg";
import "./main.css";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import Cars from "./definitions/cars";
import CarBrands from "./definitions/carBrands";
import Persons from "./definitions/persons";
import {
  FaDotCircle,
  FaArrowLeft
} from "react-icons/fa";
import Dashboard from "./Dashboard/dashboard";
import Reports from "./reports";
import Reserve from "./actions/reserve";
import Definitions from "./definitions";
import Users from "./definitions/users";
import UserGroup from "./definitions/userGroup";
import E423 from "../error/e423";
import E404 from "../error/e404";
import answerModal from "../../modals/answerModal";
import ReportTaximeter from "./reports/reportTaximeter";
import endpoints from "../../app/endpoints";
import { AxiosPrivate } from "../../app/axiosPrivate";
import { RefreshToken } from "../../app/refreshToken";
import { CheckAccess } from "../../app/checkAccess";
import DriverSetting from "./settings/driverSetting";
import TripManageSetting from "./settings/tripManageSetting";
import TariffSetting from "./settings/tariffSetting";
import SmsSetting from "./settings/smsSetting";
import OperatorSetting from "./settings/operatorSetting";
import PassengerSetting from "./settings/passengerSetting";
import Actions from "./actions";
import PhysicalActions from "./definitions/physicalActions";
import TripsMonit from "./actions/TripsMonit";
import TripHistory from "./reports/tripHistory";
import Lines from "./definitions/lines";
import CarClass from "./definitions/carClass";
import CarTypes from "./definitions/carTypes";
import Subscribers from "./definitions/subscribers";
import Stations from "./definitions/stations";
import ComplaintType from "./definitions/complaintsType";
import News from "./actions/news";
import Payment2Driver from "./actions/payment2Driver";
import DriverPayment from "./actions/driverPayment";
import Verify from "./reports/verify";
import Companies from "./definitions/companies";
import FrequentDests from "./definitions/frequentDests";
import DuplicateAddress from "./definitions/duplicateAddress";
import Weather from "./actions/weather";
import DriverTripCount from "./reports/driverTripCount";
import { findIndex } from "lodash";
import QueIO from "./reports/queIO";
import TripChartHourly from "./reports/tripChartHourly";
import CountInQue from "./reports/countInQue";
import TotalTripSendPerMonth from "./reports/totalTripSendPerMonth";
import Messanger from "./actions/messanger";
import SurveyOptions from "./definitions/surveyOptions";
import DefaultMessages from "./definitions/DefualtMessages";
import DriverTimeLine from "./reports/driverTimeLine";
import Kiosk from "./actions/kiosk";
import ControlPanelSetting from "./settings/controlPanelSetting";
import TripCountReport from "./reports/tripCountReport";
import TripChartDaily from "./reports/tripChartDaily";
import TripChartMonthly from "./reports/tripChartMonthly"
import Shifts from "./definitions/shifts";
import ShiftGroups from "./definitions/shiftGroups";
import ShiftPattern from "./definitions/shiftPattern";
import RFIDLogs from "./reports/RFIDLogs";
import Census from "./reports/census";
import StationsTemp from "./definitions/stationsTemp";
import { useSocket } from "contexts/socketContext";
import RFIDChart from "./reports/RFIDChart";
import ShiftReport from "./reports/shiftReport";
import Wallet from "./Wallet/Wallet";
import Header from "./Dashboard/Header";
import Sidebarr from "./Dashboard/SideBar";
import UserAccount from "../private/UserAccount/UserAccount";
import Support from "../private/Support/Support";
import Ticket from "../private/Ticket/Ticket"


function Main(props) {
  var navigate = useNavigate();

  var [isOpen, setOpen] = useState(false);

  var navbarSize = "10px";

  useLocation();

  const [navState, navDispatch] = useReducer(
    NavbarReducer,
    {
      activePage: undefined
    }
  );

  const [activeMenu, setActiveMenu] = useState(undefined);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    const isLeftSwipe =
      distance > minSwipeDistance;

    const isRightSwipe =
      distance < -minSwipeDistance;

    if (isRightSwipe)
      setOpen(false);

    // if (isLeftSwipe)
    //   setOpen(true)
    // add your conditional logic here
  };

  var findPath = (
    menu,
    menuNumber,
    parent
  ) => {
    if (menuNumber) {
      const parts =
        String(menuNumber).split("-");

      let first =
        [...parent, parts.shift()];

      var sub =
        menu?.filter(
          (sub =>
            sub.id == first.join("-")
          )
        )[0];

      if (parts?.length > 0)
        return [
          sub,
          ...findPath(
            sub?.sub,
            parts.join("-"),
            first
          )
        ];
      else
        return [sub];
    }
  };

  var path2MenuId = (
    menu,
    path
  ) => {
    menu.forEach(element => {
      if (element.sub) {
        path2MenuId(
          element.sub,
          path
        );
      } else {
        if (element.path == path) {
          setActiveMenu(
            element.id
          );
        }
      }
    });
  };

  var [isLoading, setLoading] =
    useState(false);

  var [userInfo, setUserInfo] =
    useState({});

  var getBasicInfo = () => {
    setLoading(true);

    AxiosPrivate
      .get(endpoints.basicInfo)
      .then((res) => {
        console.log(
          res.data
        );

        Storages.setUserInfo(
          res.data
        );

        Storages.setAccessLevel(
          res.data.accessLevel
        );

        Storages.setTileServer(
          res.data.tileServerUrl
        );

        setUserInfo(
          res.data
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getBasicInfo();

    path2MenuId(
      menu,
      window.location.pathname
    );

    getCities();
  }, []);

  var divScrollRef =
    useRef();

  var [showBack, setShowBack] =
    useState(false);

  var location =
    useLocation();

  const isDashboard =
    location.pathname ===
    paths.private.dashboard;

  var [pageHistory, setPageHistory] =
    useState([]);

  useEffect(() => {
    if (
      location.pathname ==
      paths.private.actions.dashboard
    ) {
      return;
    }

    if (
      location.pathname ==
      paths.private.dashboard
    ) {
      return;
    }

    if (
      location.pathname ==
      paths.private.definitions.dashboard
    ) {
      return;
    }

    if (
      location.pathname ==
      paths.private.settings.dashboard
    ) {
      return;
    }

    if (
      location.pathname ==
      paths.private.reports.dashboard
    ) {
      return;
    }

    var find =
      pageHistory.find(
        page =>
          page == location.pathname
      );

    if (find)
      return;

    if (
      pageHistory.length > 4
    ) {
      setPageHistory(
        prevState => (
          [
            ...prevState.slice(1),
            location.pathname
          ]
        )
      );
    } else {
      setPageHistory(
        prevState => (
          [
            ...prevState,
            location.pathname
          ]
        )
      );
    }
  }, [location]);

  useEffect(() => {
    if (
      location.pathname ==
      paths.private.dashboard
    )
      setShowBack(false);
    else
      setShowBack(true);
  }, [location]);

  var [onKeyDown, setOnKeyDown] =
    useState();

  var getCities = () => {
    AxiosPrivate
      .get(endpoints.cities)
      .then(res => {
        Storages.setCities(
          res.data
        );
      })
      .catch(e => {
        Storages.setCities([
          {
            "cityName": "مشهد",
            "centerLat":
              35.741777991519456,
            "centerLng":
              51.396147723718286,
            "rightLat":
              36.321099,
            "rightLng":
              59.702532,
            "leftLat":
              36.33118,
            "leftLng":
              59.454691
          }
        ]);
      });
  };

  var socket =
    useSocket();

  useEffect(() => {
    console.log(
      "sssssssssgvsdgv"
    );

    socket?.on(
      "message",
      data => {
        console.log(
          "sssssssssss",
          data
        );
      }
    );

    socket?.on(
      "ringing",
      data => {
        console.log(
          "sssssssssss",
          data
        );
      }
    );

    return () => {
      socket?.off(
        "message"
      );

      socket?.off(
        "ringing"
      );
    };
  }, [socket]);

  return (
    <>
      <DashboardContext.Provider
        value={{
          activeMenu,
          setActiveMenu,
          divScrollRef,
          onKeyDown
        }}
      >
        {
          isLoading
            ?
            <div
              className="
                vh-100
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
            >
              <h4 className="">
                در حال تنظیم صفحه برای شما
              </h4>

              <div
                className="spinner-border"
                role="status"
              >
                <span className="sr-only"></span>
              </div>
            </div>
            :
            <div
              className="main-layout"
              style={{
                zIndex: 0
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              dir="rtl"
            >
              {/* =========================
                  منوی موبایل
              ========================= */}

              {
                isOpen && (
                  <>
                    <div
                      onClick={() =>
                        setOpen(false)
                      }
                      style={{
                        position: "fixed",
                        inset: 0,
                        background:
                          "rgba(0,0,0,.45)",
                        zIndex: 1998
                      }}
                    />

                    <div
                      className="d-md-none"
                      style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        width: "280px",
                        maxWidth: "85%",
                        height: "100vh",
                        background: "#fff",
                        overflowY: "auto",
                        boxShadow:
                          "-5px 0 20px rgba(0,0,0,.25)",
                        zIndex: 1999,
                        transition: ".3s"
                      }}
                    >
                      <Sidebarr
                        menu={menu}
                        onClose={() =>
                          setOpen(false)
                        }
                      />
                    </div>
                  </>
                )
              }

              <div
                className="
                  main-header-wrapper
                  d-none
                  d-md-flex
                "
              >
                {/* Sidebar */}

                <div
                  className="
                    main-sidebar-header
                  "
                >
                  <Sidebarr />
                </div>

                {/* Header */}

                <div
                  className="
                    main-header-content
                  "
                >
                  <Header />
                </div>
              </div>

              {/* =========================
                  Header موبایل
              ========================= */}

              {
                !isDashboard && (
                  <div
                    className="
                      d-flex
                      d-md-none
                      align-items-center
                      justify-content-between
                      px-3
                    "
                    style={{
                      position: "fixed",
                      top: 0,
                      right: 0,
                      left: 0,
                      height: "60px",
                      background: "#fff",
                      boxShadow:
                        "0 2px 10px rgba(0,0,0,.1)",
                      zIndex: 1500
                    }}
                  >
                    <button
                      onClick={() =>
                        setOpen(true)
                      }
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        fontSize: "30px"
                      }}
                    >
                      <HiOutlineMenuAlt3 />
                    </button>

                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "16px"
                      }}
                    >
                      {
                        dictionary?.title ||
                        "پنل مدیریت"
                      }
                    </span>

                    <div
                      style={{
                        width: 35
                      }}
                    />
                  </div>
                )
              }

              {/* =========================
                  بدنه اصلی برنامه

                  تمام صفحات جدید
                  فقط داخل این بخش
                  نمایش داده می‌شوند
              ========================= */}

              <div
                className={`
                  main-page-content
                  ${isDashboard
                    ? "main-dashboard-page"
                    : ""
                  }
                `}
                ref={divScrollRef}
                tabIndex={0}
                onKeyDown={setOnKeyDown}
                onTouchStart={() => {
                  setOpen(false);
                }}
                onMouseUp={() => {
                  setOpen(false);
                }}
              >
                <div
                  className="
                    main-page-inner
                  "
                >
                  <div
                    className="
                      container-fluid
                      p-0
                      m-0
                      main-routes-container
                    "
                  >
                    <Routes>
                      <Route
                        path="/control-panel"
                        element={
                          <Navigate
                            to={
                              paths.private.dashboard
                            }
                            replace
                          />
                        }
                      />

                      <Route
                        path={
                          paths.private.dashboard
                        }
                        element={
                          <Dashboard />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.backup
                        }
                        element={
                          <Backup />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.dashboard
                        }
                        element={
                          <Settings />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.driver
                        }
                        element={
                          <DriverSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.passenger
                        }
                        element={
                          <PassengerSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.operator
                        }
                        element={
                          <OperatorSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.sms
                        }
                        element={
                          <SmsSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.tariff
                        }
                        element={
                          <TariffSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.tripManage
                        }
                        element={
                          <TripManageSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.settings.controlPanel
                        }
                        element={
                          <ControlPanelSetting />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.changeIP
                        }
                        element={
                          <ChangeIP />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.carBrand
                        }
                        element={
                          <CarBrands />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.dashboard
                        }
                        element={
                          <Reports />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.taximeter
                        }
                        element={
                          <ReportTaximeter />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.tripHistory
                        }
                        element={
                          <TripHistory />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.verify
                        }
                        element={
                          <Verify />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.driverTripCount
                        }
                        element={
                          <DriverTripCount />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.queIO
                        }
                        element={
                          <QueIO />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.tripChartHourly
                        }
                        element={
                          <TripChartHourly />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.tripChartDaily
                        }
                        element={
                          <TripChartDaily />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.tripChartMonthly
                        }
                        element={
                          <TripChartMonthly />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.totalTripMonth
                        }
                        element={
                          <TotalTripSendPerMonth />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.countInQue
                        }
                        element={
                          <CountInQue />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.driverTimeLine
                        }
                        element={
                          <DriverTimeLine />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.tripCountReport
                        }
                        element={
                          <TripCountReport />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.rfid
                        }
                        element={
                          <RFIDLogs />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.rfidChart
                        }
                        element={
                          <RFIDChart />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.census
                        }
                        element={
                          <Census />
                        }
                      />

                      <Route
                        path={
                          paths.private.reports.shifts
                        }
                        element={
                          <ShiftReport />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.dashboard
                        }
                        element={
                          <Definitions />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.users
                        }
                        element={
                          <Users />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.lines
                        }
                        element={
                          <Lines />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.userGroup
                        }
                        element={
                          <UserGroup />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.persons
                        }
                        element={
                          <Persons />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.carTypes
                        }
                        element={
                          <CarTypes />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.cars
                        }
                        element={
                          <Cars />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.carClass
                        }
                        element={
                          <CarClass />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.complaints
                        }
                        element={
                          <ComplaintType />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.companies
                        }
                        element={
                          <Companies />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.frequentDests
                        }
                        element={
                          <FrequentDests />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.duplicateAddress
                        }
                        element={
                          <DuplicateAddress />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.subscribers
                        }
                        element={
                          <Subscribers />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.stations
                        }
                        element={
                          <Stations />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.stationsV2
                        }
                        element={
                          <StationsTemp />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.physicalActions
                        }
                        element={
                          <PhysicalActions />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.surveyOptions
                        }
                        element={
                          <SurveyOptions />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.defMsg
                        }
                        element={
                          <DefaultMessages />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.shifts
                        }
                        element={
                          <Shifts />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.shiftGroups
                        }
                        element={
                          <ShiftGroups />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.shiftPattern
                        }
                        element={
                          <ShiftPattern />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.Wallet
                        }
                        element={
                          <Wallet />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.userAccount
                        }
                        element={
                          <UserAccount />
                        }
                      />

                      <Route
                        path={
                          paths.private.definitions.support
                        }
                        element={
                          <Support />
                        }
                      />



                      <Route
                        path={
                          paths.private.definitions.ticket
                        }
                        element={
                          <Ticket />
                        }
                      />



                      <Route
                        path={
                          paths.private.actions.dashboard
                        }
                        element={
                          <Actions />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.reserve
                        }
                        element={
                          <Reserve />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.tripsMonit
                        }
                        element={
                          <TripsMonit />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.news
                        }
                        element={
                          <News />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.driverPayment
                        }
                        element={
                          <DriverPayment />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.payment2Driver
                        }
                        element={
                          <Payment2Driver />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.messanger
                        }
                        element={
                          <Messanger />
                        }
                      />

                      <Route
                        path={
                          paths.private.actions.weather
                        }
                        element={
                          <Weather />
                        }
                      />


                      <Route
                        path={
                          paths.private.e423
                        }
                        element={
                          <E423 />
                        }
                      />

                      <Route
                        path="/*"
                        element={
                          <E404 />
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
        }
      </DashboardContext.Provider>
    </>
  );
}

export default Main;
