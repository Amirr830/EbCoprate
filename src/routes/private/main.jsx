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
import { FaWallet } from "react-icons/fa"; 
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
import TripChartMonthly from "./reports/tripChartMonthly"; 
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
import Ticket from "../private/Ticket/Ticket"; 
import CommentSuggestion from "./CommentSuggestion/CommentSuggestion"; 
import Request from "./Requests/Request"; 
import InviteFriend from "./InviteFriends/InviteFriend" 
 
function Main(props) { 
 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const socket = useSocket(); 
 
  const [isOpen, setOpen] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [activeMenu, setActiveMenu] = useState(undefined); 
  const [isLoading, setLoading] = useState(false); 
  const [userInfo, setUserInfo] = useState({}); 
  const [showBack, setShowBack] = useState(false); 
  const [pageHistory, setPageHistory] = useState([]); 
  const [onKeyDown, setOnKeyDown] = useState(); 
  const [touchStart, setTouchStart] = useState(null); 
  const [touchEnd, setTouchEnd] = useState(null); 
 
  const divScrollRef = useRef(); 
 
  const navbarSize = "10px"; 
  const minSwipeDistance = 50; 
 
  const [navState, navDispatch] = useReducer( 
    NavbarReducer, 
    { 
      activePage: undefined 
    } 
  ); 
 
  const isDashboard = 
    location.pathname === paths.private.dashboard; 
 
 
  useEffect(() => { 
 
    const handleOpenMobileMenu = () => { 
      setIsSidebarOpen(true); 
      setOpen(true); 
    }; 
 
    window.addEventListener( 
      "openMobileMenu", 
      handleOpenMobileMenu 
    ); 
 
    return () => { 
      window.removeEventListener( 
        "openMobileMenu", 
        handleOpenMobileMenu 
      ); 
    }; 
 
  }, []); 
 
 
  useEffect(() => { 
 
    setOpen(false); 
    setIsSidebarOpen(false); 
 
  }, [location.pathname]); 
 
 
  const onTouchStart = (event) => { 
 
    setTouchEnd(null); 
 
    setTouchStart( 
      event.targetTouches[0].clientX 
    ); 
 
  }; 
 
 
  const onTouchMove = (event) => { 
 
    setTouchEnd( 
      event.targetTouches[0].clientX 
    ); 
 
  }; 
 
 
  const onTouchEnd = () => { 
 
    if ( 
      touchStart === null || 
      touchEnd === null 
    ) { 
      return; 
    } 
 
    const distance = 
      touchStart - touchEnd; 
 
    const isRightSwipe = 
      distance < -minSwipeDistance; 
 
    if (isRightSwipe) { 
 
      setOpen(false); 
      setIsSidebarOpen(false); 
 
    } 
 
  }; 
 
 
  const findPath = ( 
    menuItems, 
    menuNumber, 
    parent = [] 
  ) => { 
 
    if (!menuNumber) { 
      return []; 
    } 
 
    const parts = 
      String(menuNumber).split("-"); 
 
    const first = [ 
      ...parent, 
      parts.shift() 
    ]; 
 
    const sub = 
      menuItems?.find( 
        (item) => 
          item.id === first.join("-") 
      ); 
 
    if (!sub) { 
      return []; 
    } 
 
    if (parts.length > 0) { 
 
      return [ 
        sub, 
        ...findPath( 
          sub.sub, 
          parts.join("-"), 
          first 
        ) 
      ]; 
 
    } 
 
    return [sub]; 
 
  }; 
 
 
  const path2MenuId = ( 
    menuItems, 
    path 
  ) => { 
 
    menuItems?.forEach((element) => { 
 
      if (element.sub) { 
 
        path2MenuId( 
          element.sub, 
          path 
        ); 
 
      } else if ( 
        element.path === path 
      ) { 
 
        setActiveMenu(element.id); 
 
      } 
 
    }); 
 
  }; 
 
 
  const getBasicInfo = () => { 
 
    setLoading(true); 
 
    AxiosPrivate 
      .get(endpoints.basicInfo) 
      .then((res) => { 
 
        console.log(res.data); 
 
        Storages.setUserInfo(res.data); 
 
        Storages.setAccessLevel( 
          res.data.accessLevel 
        ); 
 
        Storages.setTileServer( 
          res.data.tileServerUrl 
        ); 
 
        setUserInfo(res.data); 
 
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
 
 
  useEffect(() => { 
 
    getBasicInfo(); 
 
    path2MenuId( 
      menu, 
      window.location.pathname 
    ); 
 
    getCities(); 
 
  }, []); 
 
 
  useEffect(() => { 
 
    const excludedPaths = [ 
      paths.private.actions.dashboard, 
      paths.private.dashboard, 
      paths.private.definitions.dashboard, 
      paths.private.settings.dashboard, 
      paths.private.reports.dashboard 
    ]; 
 
    if ( 
      excludedPaths.includes( 
        location.pathname 
      ) 
    ) { 
      return; 
    } 
 
    const exists = 
      pageHistory.some( 
        (page) => 
          page === location.pathname 
      ); 
 
    if (exists) { 
      return; 
    } 
 
    setPageHistory((previous) => { 
 
      const nextHistory = [ 
        ...previous, 
        location.pathname 
      ]; 
 
      return nextHistory.length > 5 
        ? nextHistory.slice(1) 
        : nextHistory; 
 
    }); 
 
  }, [ 
    location.pathname, 
    pageHistory 
  ]); 
 
 
  useEffect(() => { 
 
    setShowBack( 
      location.pathname !== 
      paths.private.dashboard 
    ); 
 
  }, [location.pathname]); 
 
 
  useEffect(() => { 
 
    const handleMessage = (data) => { 
 
      console.log( 
        "sssssssssss", 
        data 
      ); 
 
    }; 
 
    socket?.on( 
      "message", 
      handleMessage 
    ); 
 
    socket?.on( 
      "ringing", 
      handleMessage 
    ); 
 
    return () => { 
 
      socket?.off( 
        "message", 
        handleMessage 
      ); 
 
      socket?.off( 
        "ringing", 
        handleMessage 
      ); 
 
    }; 
 
  }, [socket]); 
 
 
  const closeMobileMenu = () => { 
 
    setOpen(false); 
    setIsSidebarOpen(false); 
 
  }; 
 
 
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
 
        {isLoading ? ( 
 
          <div className="vh-100 d-flex flex-column justify-content-center align-items-center"> 
 
            <h4> 
              در حال تنظیم صفحه برای شما 
            </h4> 
 
            <div 
              className="spinner-border" 
              role="status" 
            > 
              <span className="sr-only"></span> 
            </div> 
 
          </div> 
 
        ) : ( 
 
          <div 
            className="main-layout" 
            style={{ zIndex: 0 }} 
            onTouchStart={onTouchStart} 
            onTouchMove={onTouchMove} 
            onTouchEnd={onTouchEnd} 
            dir="rtl" 
          > 
 
            {isOpen && ( 
              <> 
 
                <div 
                  onClick={closeMobileMenu} 
                  className="main-mobile-menu-overlay" 
                /> 
 
                <div className="main-mobile-sidebar"> 
 
                  <Sidebarr 
                    menu={menu} 
                    onClose={closeMobileMenu} 
                  /> 
 
                </div> 
 
              </> 
            )} 
 
 
            <div className="main-header-wrapper d-none d-md-flex"> 
 
              <div className="main-sidebar-header"> 
                <Sidebarr /> 
              </div> 
 
              <div className="main-header-content"> 
                <Header /> 
              </div> 
 
            </div> 
 
 
            <div className="main-mobile-header d-md-none"> 
              <div className="main-mobile-header-glow" /> 
 
              <button 
                type="button" 
                onClick={() => { 
                  setOpen(true); 
                  setIsSidebarOpen(true); 
                }} 
                className="main-mobile-menu-button" 
                aria-label="باز کردن منو" 
              > 
 
                <span className="main-mobile-menu-icon"> 
                  <HiOutlineMenuAlt3 /> 
                </span> 
                <span className="main-mobile-menu-content"> 
                  <span className="main-mobile-menu-text"> 
                    منو 
                  </span> 
                </span> 
              </button> 
 
 
              <div className="main-mobile-header-divider" /> 
 
 
              <button 
                type="button" 
                className="main-mobile-wallet-button" 
                onClick={() => 
                  navigate( 
                    paths.private.definitions.Wallet 
                  ) 
                } 
                aria-label="کیف پول" 
              > 
 
                <span className="main-mobile-wallet-content"> 
 
                  <span className="main-mobile-wallet-label"> 
                    موجودی کیف پول 
                  </span> 
 
                  <span className="main-mobile-wallet-amount"> 
                    ۲۵,۰۰۰ 
                    <small> تومان</small> 
                  </span> 
 
                </span> 
 
                <span className="main-mobile-wallet-icon"> 
                  <FaWallet /> 
                </span> 
 
                {/* <span className="main-mobile-wallet-arrow"> 
                  <FaArrowLeft /> 
                </span> */} 
 
              </button> 
 
            </div> 
 
            <div 
              className={`main-page-content ${isDashboard 
                ? "main-dashboard-page" 
                : "" 
                }`} 
              ref={divScrollRef} 
              tabIndex={0} 
              onKeyDown={setOnKeyDown} 
            > 
 
              <div className="main-page-inner"> 
 
                <div className="container-fluid p-0 m-0 main-routes-container"> 
 
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
                      path={paths.private.reports.dashboard} 
                      element={<Reports />} 
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
                      path={paths.private.definitions.support} 
                      element={<Support />} 
                    /> 
 
                    <Route 
                      path={paths.private.definitions.ticket} 
                      element={<Ticket />} 
                    /> 
 
                    <Route 
                      path={paths.private.definitions.commentSuggestion} 
                      element={<CommentSuggestion />} 
                    /> 
 
                    <Route 
                      path={paths.private.definitions.request} 
                      element={<Request />} 
                    /> 
 
                    <Route 
                      path={paths.private.definitions.inviteFriend} 
                      element={<InviteFriend />} 
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
                      path="/*" 
                      element={<E404 />} 
                    /> 
 
                  </Routes> 
 
                </div> 
 
              </div> 
 
            </div> 
 
          </div> 
 
        )} 
 
      </DashboardContext.Provider> 
 
    </> 
  ); 
} 
 
export default Main;