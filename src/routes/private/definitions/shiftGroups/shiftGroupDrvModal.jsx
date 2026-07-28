import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { AxiosPrivate } from "app/axiosPrivate";
import endpoints from "app/endpoints";
import CarClassDropDown from "components/dropdowns/carClassDropDown";
import CarTypeDropDown from "components/dropdowns/carTypeDropDown";
import CheckBox from "components/customeTag/checkBox";
import toast from "components/toast";
import loaderModal from "modals/loaderModal";
import { IoIosClose } from "react-icons/io";
import LinesDropDown from "components/dropdowns/linesDropDown";

export default function ShiftModal(props) {


    var [show, setShow] = useState(false)


    var getShiftGroupMember = (shiftGroupCode) => {
        AxiosPrivate.get(endpoints.shiftGroupMember, { params: { shiftGroupCode } })
            .then((res) => {
                setSelectDriversCode(res?.data)
            })
    }

    var updateShiftGroupMember = (shiftGroupCode) => {
        AxiosPrivate.put(endpoints.shiftGroupMember, { shiftGroupCode, members: selectedDriversCode })
            .then((res) => {
                if (res?.data?.status == 1) {
                    setShow(false)
                    props?.onAccept(selectedDriversCode)
                    toast.Success(res?.data?.msg)
                } else {
                    toast.Error(res?.data?.msg)
                }
            })
    }


    useEffect(() => {
        if (show) {
            getShiftGroupMember(props?.shiftGroupCode)
            // setSelectDriversCode(props?.drivers)
        }
    }, [show])




    const handleShow = (e) => {
        setShow(true)
        setSelectDriversCode([])
    };

    var newFirstChild

    if (props?.children)
        newFirstChild = React.cloneElement(
            props?.children?.length > 1
                ? props.children[0]
                : props.children,
            { onClick: handleShow });


    var [searchParams, setSearchParams] = useState(undefined)

    var readChange = (e) => {
        var value = e.target.value
        var name = e.target.name

        setSearchParams({
            ...searchParams,
            [name]: value
        })
    }

    var [drivers, setDrivers] = useState([])
    var [selectedDriversCode, setSelectDriversCode] = useState([])

    var searchPerson = () => {
        var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.car,
            {
                params: {
                    offset: 0,
                    pageSize: 200,
                    ...searchParams
                }
            }).then((res) => {
                var drivers2 = res.data.list.flatMap(driver =>
                    driver.owners.map(owner => ({
                        ...driver,
                        ...owner,
                        owners: undefined
                    }))
                );
                setDrivers(drivers2)

            }).finally((e) => {
                loaderModal.close(loader)
            })
    }

    const [sortKey, setSortKey] = useState("driverCode"); // کلید مرتب‌سازی
    const [sortDir, setSortDir] = useState("asc");  // asc یا desc

    const sortedRows = useMemo(() => {
        const sorted = [...drivers];
        sorted.sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];

            // اگر عددی/قابل مقایسه باشه:
            if (typeof av === "number" && typeof bv === "number") {
                return sortDir === "asc" ? av - bv : bv - av;
            }

            // برای متن
            const cmp = String(av).localeCompare(String(bv), "fa");
            return sortDir === "asc" ? cmp : -cmp;
        });
        return sorted;
    }, [drivers, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir("asc");
            return;
        }
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    };
    return (<>
        {newFirstChild}

        <Modal show={show}
            centered
            size="lg"
            onHide={() => { setShow(false) }}
            style={{ background: ' rgba(0, 0, 0, 0.400)' }}>

            <Modal.Body className="card-header p-3 overflow-hidden" dir="rtl">


                <div>
                    <div className="row g-2" >

                        <div className="row g-2">
                            <div className="col-4 col-lg-1">
                                <label>از کد : </label>
                                <input className="form-control shadow col-12 text-center "
                                    placeholder="از کد"
                                    type='text'
                                    value={searchParams?.driverCode}
                                    name="driverCode"
                                    onChange={readChange}
                                />

                            </div>

                            <div className="col-4 col-lg-1">
                                <label>تا کد : </label>

                                <input className="form-control shadow col-12 text-center "
                                    placeholder="تا کد"
                                    type='text'
                                    value={searchParams?.toDriverCode}
                                    name="toDriverCode"
                                    onChange={readChange}
                                />

                            </div>

                            <div className="col-4 col-lg-2">
                                <label>سال ساخت : </label>

                                <input className="form-control shadow col-12 text-center "
                                    placeholder="سال ساخت"
                                    type="number"
                                    value={searchParams?.buildYear}
                                    name="buildYear"
                                    onChange={readChange}
                                />

                            </div>
                            <div className="col-4 col-lg-2">
                                <label>کلاس خودرو : </label>
                                <CarClassDropDown
                                    name="carClass"
                                    onChange={readChange}
                                    value={searchParams?.carClass} />
                            </div>
                            <div className="col-4 col-lg-2">
                                <label>نوع خودرو : </label>
                                <CarTypeDropDown
                                    name="carType"
                                    onChange={readChange}
                                    value={searchParams?.carType} />
                            </div>
                            <div className="col-4 col-lg-2">
                                <label>شماره خط : </label>
                                <LinesDropDown
                                    name="lineNum"
                                    onChange={readChange}
                                    value={searchParams?.lineNum}
                                />
                            </div>

                            <div className="col-12 col-lg-2">
                                <label className="opacity-0">.</label>

                                <button className="btn btn-success w-100"
                                    onClick={() => {
                                        searchPerson()
                                    }}>
                                    جستجو
                                </button>
                            </div>
                        </div>


                        <div className="overflow-auto" style={{ height: '20rem' }}>
                            <table className="table table-striped table-hover mb-5 pb-5  "
                            >
                                <thead className='thead-dark position-sticky top-0 col-12'>
                                    <tr>
                                        <th width="20%">
                                            <CheckBox title="انتخاب همه" onChange={(e) => {
                                                const allCodes = drivers?.map(item => ({
                                                    driverCode: item?.driverCode,
                                                    smartCode: item?.smartCode
                                                }));

                                                console.log(allCodes)

                                                if (e.target.checked)
                                                    setSelectDriversCode(prevList => [...prevList, ...allCodes])
                                                else {
                                                    const diff = selectedDriversCode.filter(item1 =>
                                                        !allCodes.some(item2 => item1.driverCode === item2.driverCode && item1.smartCode === item2.smartCode)
                                                    );
                                                    setSelectDriversCode(diff);

                                                }
                                            }} />
                                        </th>
                                        <th width="40%">
                                            کد راننده
                                            <SortButton dir={sortDir} onClick={() => toggleSort("driverCode")} />

                                        </th>
                                        <th width="40%">
                                            نام راننده
                                            
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {sortedRows.map((item, index) => {
                                        return <tr className="aPointer" key={index}>
                                            <td>
                                                <CheckBox
                                                    checked={selectedDriversCode?.find(i => (i.driverCode == item.driverCode && i.smartCode == item.smartCode))}
                                                    onChange={(e) => {
                                                        var value = e.target.checked
                                                        if (value) {

                                                            setSelectDriversCode(prevState => [...prevState, { driverCode: item?.driverCode, smartCode: item?.smartCode }])
                                                        } else
                                                            setSelectDriversCode(prevList => prevList.filter(i => !(i.driverCode == item.driverCode && i.smartCode == item.smartCode)));

                                                    }} />
                                            </td>
                                            <td>
                                                {item.driverCode}
                                            </td>
                                            <td>
                                                {item.firstName} {item.lastName}
                                            </td>
                                        </tr>
                                    })}


                                </tbody>
                            </table>
                        </div>

                        <div className="row g-1">
                            <p className="m-0 p-0 mt-2">اعضای انتخاب شده</p>

                            {
                                selectedDriversCode?.map((item, index) => {
                                    return <div className="w-auto" key={index}>
                                        <div className="card px-1 bg-primary text-white "
                                            onClick={(e) => {
                                                setSelectDriversCode(prevList => prevList.filter(i => !(i.driverCode == item.driverCode && i.smartCode == item.smartCode)));
                                            }}>
                                            <div>
                                                <IoIosClose size={30} className="text-warning aPointer" />

                                                {item?.driverCode}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>

                        <div className="row g-2 p-0 m-0 pt-3 mt-2 ">

                            <div className="col-9">
                                <button className="btn btn-primary w-100"

                                    onClick={() => {
                                        updateShiftGroupMember(props?.shiftGroupCode)
                                    }}>
                                    ثبت
                                </button>
                            </div>

                            <div className="col-3">
                                <button className="btn btn-danger w-100"
                                    onClick={() => {
                                        setShow(false)
                                    }}>
                                    لغو
                                </button>
                            </div>
                        </div>

                    </div>
                </div>



            </Modal.Body>

        </Modal>
    </>)
}




function SortButton({ dir, onClick }) {
  // dir: "asc" | "desc"
  return (
    <button
      type="button"
      onClick={onClick}
      title="مرتب سازی"
      className="btn btn -primary"
    >
      {dir === "asc" ? "▲" : "▼"}
    </button>
  );
}