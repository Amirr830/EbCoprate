import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import paths from '../app/paths.json'
import Storages from "../app/storages";
import { MdDns } from "react-icons/md"
import SidebarTab from "./sidebarTab";
import Collapse from 'react-bootstrap/Collapse';
import dashboardContext from "../contexts/dashboardContext";

function Sidebar(props) {
    var context = useContext(dashboardContext)
    var navigate = useNavigate()
    const [open, setOpen] = useState();
    var level = props.level ? props.level : 0;
    return (
        <>
            <div className="d-flex row m-0 p-0  " >
                <div className="me-auto p-0 text-light ">
                    {props?.menu.map((item, index) => {
                        return <div key={index}>
                            <SidebarTab
                                level={level}
                                item={item}
                                open={open}
                                onClick={() => {
                                    if (!item?.sub) {
                                        context.setActiveMenu(item.id)
                                        // here navigete to page
                                        navigate(item?.path)
                                        props.onClose()
                                    }
                                    if (item.id == open) {
                                        setOpen(undefined)
                                    } else {
                                        setOpen(item.id)
                                    }
                                }}

                                active={item.id == context.activeMenu && !item?.sub}
                            />

                            <Collapse in={open == item.id} className="p-0 m-0 ">
                                <div id={item.id} className=" p-0 m-0 ">
                                    {
                                        item?.sub?.length > 0 ?
                                            <Sidebar
                                                menu={item.sub} level={level + 1}
                                                onClose={() => { props.onClose() }}
                                                open={open}

                                            />
                                            : <></>
                                    }
                                </div>
                            </Collapse>

                        </div>
                    })}
                </div>

            </div>

        </>
    );
}

export default Sidebar;

// <SidebarTab
// active={false}
// icon={<MdDns />}

// title="مدیریت سفر" />
// <li class="mb-1">
// <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
//     Orders
// </button>
// <div class="collapse" id="orders-collapse">
//     <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
//         <li><a href="#" class="link-dark rounded">New</a></li>
//         <li><a href="#" class="link-dark rounded">Processed</a></li>
//         <li><a href="#" class="link-dark rounded">Shipped</a></li>
//         <li><a href="#" class="link-dark rounded">Returned</a></li>
//     </ul>
// </div>
// </li>


// <Button
// onClick={() => setOpen(!open)}
// aria-controls="example-collapse-text"
// aria-expanded={open}
// >
// click
// </Button>
// <Collapse in={open}>
// <div id="example-collapse-text">
//     Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
//     terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
//     labore wes anderson cred nesciunt sapiente ea proident.
// </div>
// </Collapse>
// <Button
// onClick={() => setOpen(!open)}
// aria-controls="example-collapse-text"
// aria-expanded={open}
// >
// click
// </Button>
// <Collapse in={open}>
// <div id="example-collapse-text">
//     Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
//     terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
//     labore wes anderson cred nesciunt sapiente ea proident.
// </div>
// </Collapse>

// <SidebarTab
// active={false}
// icon={<MdDns />}

// onClick={() => {
//     navigate(paths.private.changeIP)
//     props.onClose()
// }}
// title={<><span className="enFont">IP</span> تغییر</>} />
// <SidebarTab
// active={false}
// icon={<MdDns />}

// onClick={() => {
//     navigate(paths.private.backup)
//     props.onClose()
// }}
// title="تهیه پشتیبان" />
// <SidebarTab
// active={false}
// icon={<MdDns />}
// title="تنظیمات" />
// <SidebarTab
// active={false}
// icon={<MdDns />}
// title="مصوبه ها" />

// <SidebarTab
// active={false}
// icon={<MdDns />}
// onClick={() => {
//     Storages.setUserToken(undefined)
//     navigate(paths.public.login)
// }}
// title="خروج از حساب کاربری" />