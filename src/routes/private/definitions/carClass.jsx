import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgClose } from 'react-icons/cg'
import toast from "../../../components/toast";
import endpoints from "../../../app/endpoints";
import { AxiosPrivate } from "./../../../app/axiosPrivate"
import loaderModal from "../../../modals/loaderModal";
import CheckBox from "../../../components/customeTag/checkBox";
import AddCarClassModal from "../../../modals/AddCarClassModal";

export default function CarClass() {
    var [carClass, setCarClass] = useState([]);
    var getCarClass = (loader) => {
        if (!loader)
            var loader = loaderModal.load()
        AxiosPrivate.get(endpoints.carClass)
            .then((res) => {
                setCarClass(res?.data)
            }).finally(() => {
                loaderModal.close(loader)
            })
    }


    var onRemoveCarType = (item) => {
        var loader = loaderModal.load()
        AxiosPrivate.delete(endpoints.carType, { item })
            .then((res) => {
                toast.Success(res?.data?.msg)
                getCarClass(loader)
            })
    }

    useEffect(() => {
        getCarClass()
    }, [])


    function handleOnCheck(e) {
        try {
            var value = e.target.checked;
            var name = e.target.name;

            // setParams(prevState => ({
            //     ...prevState,
            //     [name]: value
            // }));
            console.log(value, name);

        } catch (err) {
            console.log(err);
        }

    }




    return (
        <>
            <div className="h-100 a-scroll container overflow-auto" dir="rtl" >
                <div className="row g-2 my-3">

                    {carClass.map((item, index) => {
                        return <div className="col-3" key={index} >
                            <AddCarClassModal carClass={item}
                                onClose={() => {
                                    getCarClass()
                                }}>
                                <div className="card p-3 card-hover aPointer">

                                    <div className="d-flex flex-row">

                                        <div>
                                            <h3 className="iranSansBold p-0 m-0 " >{item.className}</h3>
                                            <p className=" p-0 m-0 " style={{ height: '1rem' }} >{item.classDesc}</p>
                                        </div>
                                        <div className="me-auto">
                                            {item.isActive == 1 ?
                                                <span className="btn btn-success iranSansBold">فعال</span> :
                                                <span className="btn btn-danger iranSansBold">غیر فعال</span>
                                            }
                                        </div>
                                    </div>
                                    <hr />
                                    <CheckBox
                                        className="my-2 "
                                        title="بار اضافه"
                                        disabled

                                        onChange={handleOnCheck}
                                        checked={item.moreLoadOption == 1}
                                        name="moreLoadOption" />
                                    <CheckBox
                                        title="نفر اضافه"
                                        disabled

                                        className="my-2"
                                        onChange={handleOnCheck}
                                        checked={item.morePeopleOption == 1}
                                        name="morePeopleOption" />
                                    <CheckBox
                                        className="my-2 "
                                        disabled
                                        title="در اختیار"
                                        onChange={handleOnCheck}
                                        checked={item.disposalOption == 1}
                                        name="disposalOption" />
                                    <CheckBox
                                        className="my-2"
                                        title="کولر"
                                        disabled

                                        onChange={handleOnCheck}
                                        checked={item.coolerOption == 1}
                                        name="coolerOption" />
                                    <CheckBox
                                        className="my-2"
                                        title="بازگشت به مبدا"
                                        disabled

                                        onChange={handleOnCheck}
                                        checked={item.backToOriginOption == 1}
                                        name="backToOriginOption" />
                                    <CheckBox
                                        className="my-2"
                                        disabled

                                        title="توضیحات"
                                        onChange={handleOnCheck}
                                        checked={item.descOption == 1}
                                        name="descOption" />

                                    <CheckBox
                                        className="my-2"
                                        disabled

                                        title="توقف "
                                        onChange={handleOnCheck}
                                        checked={item.stopOption == 1}
                                        name="stopOption" />
                                    <hr />
                                    <CheckBox
                                        className="my-2"
                                        title="قابلیت رزرو"
                                        disabled

                                        onChange={handleOnCheck}
                                        checked={item.reserveOption == 1}
                                        name="reserveOption" />

                                    <CheckBox
                                        disabled
                                        className="my-2"
                                        title="فقط رزرو"
                                        onChange={handleOnCheck}
                                        checked={item.justReserve == 1}
                                        name="justReserve" />

                                    {/* <p>
                                    گزینه های رزرو هر {item?.resMinStep} دقیقه
                                </p>
                                <p>
                                    رزرو از ساعت  {item?.reserveFrom}
                                </p>
                                <p>
                                    رزرو از ساعت  {item?.reserveTo}
                                </p>
                                <p>
                                    اخرین ساعت رزرو برای روز بعد  {item?.latestReservationTime}
                                </p>
                                <p>
                                    حداکثر تعداد همراه {item?.escortOption}
                                </p> */}
                                </div>
                            </AddCarClassModal>
                        </div>
                    })}



                    {/* <div className="col-3" key={index} >
                        <div className="card p-3">

                            <div className="d-flex flex-row">
                                <div>
                                    <h3 className="iranSansBold p-0 m-0 " >{item.className}</h3>
                                    <p className=" p-0 m-0 " >{item.classDesc}</p>
                                </div>

                                <div className="form-check form-switch h2 me-auto">
                                    <input className="form-check-input "
                                        type="checkbox"
                                        checked={item.isActive == 1}
                                        role="switch" />
                                </div>

                            </div>


                            <hr />
                            <CheckBox
                                className="my-2"
                                title="بار اضافه"
                                onChange={handleOnCheck}
                                checked={item.moreLoadOption == 1}
                                name="displayForDriver" />
                            <CheckBox
                                title="نفر اضافه"
                                className="my-2"
                                onChange={handleOnCheck}
                                checked={item.morePeopleOption == 1}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="در اختیار"
                                onChange={handleOnCheck}
                                checked={item.disposalOption == 1}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="کولر"
                                onChange={handleOnCheck}
                                checked={item.coolerOption == 1}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="بازگشت به مبدا"
                                onChange={handleOnCheck}
                                checked={item.backToOriginOption == 1}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="توضیحات"
                                onChange={handleOnCheck}
                                checked={item.descOption == 1}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="حداکثر تعداد مقصد"
                                onChange={handleOnCheck}
                                checked={false}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="توقف "
                                onChange={handleOnCheck}
                                checked={item.stopOption == 1}
                                name="displayForDriver" />
                            <hr />
                            <CheckBox
                                className="my-2"
                                title="قابلیت رزرو"
                                onChange={handleOnCheck}
                                checked={item.reserveOption == 1}
                                name="displayForDriver" />

                            <CheckBox
                                className="my-2"
                                title="فقط رزرو"
                                onChange={handleOnCheck}
                                checked={item.justReserve == 1}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="فاصله بین دقایق رزرو"
                                onChange={handleOnCheck}
                                checked={false}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="رزرو از"
                                onChange={handleOnCheck}
                                checked={false}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="رزرو تا"
                                onChange={handleOnCheck}
                                checked={false}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="اخرین زمان رزرو"
                                onChange={handleOnCheck}
                                checked={false}
                                name="displayForDriver" />
                            <CheckBox
                                className="my-2"
                                title="حداکثر تعداد همراه"
                                onChange={handleOnCheck}
                                checked={false}
                                name="displayForDriver" />

                        </div>
                    </div> */}
                    {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3 aPointer  " onClick={() => {
                        toast.Success('با موفقیت افزوده شد')
                    }}>
                        <div className="card d-flex py-2 flex-row justify-content-center align-items-center bg-warning">
                            <h2 className="text-center  w-100">افزودن دسته جدید</h2>

                        </div>
                    </div> */}
                </div>
            </div>

        </>
    );
}
