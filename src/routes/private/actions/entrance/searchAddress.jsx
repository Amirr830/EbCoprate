import React, { forwardRef, useEffect, useRef, useState } from "react";
import endpoints from "../../../../app/endpoints";
import { AxiosPrivate } from "../../../../app/axiosPrivate";
import _ from 'lodash'

const SearchAddress = forwardRef((props, ref) => {

    const searchAddress = (searchAddress) => {
        var params = {
            lat: props?.center?.lat,
            lng: props?.center?.lng,
            term: searchAddress,
            city:'مشهد',
            oStCode: props?.oStCode,
            calcPriceByRouting: props?.calcPriceByRouting ? 1 : 0
        };


        if (searchAddress.length == 0) return
        AxiosPrivate.get(endpoints.search, {
            params: params,
        }).then((res) => {
            console.log(res.data)
            setAddressesResult(res.data.items)
        })
    };

    var [searchTerm, setSearchTerm] = useState(props?.value)

    useEffect(() => {
        setLockSearch(true)
        setSearchTerm(props?.value)

    }, [props?.value])
    // var [addressesResult, setAddressesResult] = useState([])TODO

    // تابعی که می‌خواهید پس از تکمیل تایپ اجرا شود
    const doSomethingAfterUserHasStoppedTyping = (inputValue) => {
        console.log(`کاربر تایپ کردن را تمام کرد: ${inputValue}`);
        searchAddress(inputValue)
        // اینجا کد مورد نظر خود را قرار دهید
    };

    // استفاده از debounce برای تاخیر در اجرای تابع
    const debouncedDoSomething = _.debounce(doSomethingAfterUserHasStoppedTyping, 300);

    useEffect(() => {
        if (!lockSearch)
            if (searchTerm) {
                debouncedDoSomething(searchTerm);
            }
        // لغو debounce در صورت unmount شدن کامپوننت
        return () => {
            debouncedDoSomething.cancel();
        };
    }, [searchTerm]); // فقط زمانی اجرا می‌شود که مقدار value تغییر کند


    var [addressesResult, setAddressesResult] = useState([])

    // اضافه کردن رویداد گوش دهنده به document
    const handleKeyDown = (event) => {
        // کد مورد نظر شما برای اجرا هنگام فشردن کلید
        // UP
        if (event.keyCode === 38) {
            event.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : addressesResult.length - 1
            );
        }
        // DOWN
        else if (event.keyCode === 40) {
            event.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex < addressesResult.length - 1 ? prevIndex + 1 : 0
            );
        }
        // ENTER
        else if (event.keyCode === 13) {
            event.preventDefault();
            onSelectAddress(addressesResult[selectedIndex])
        }// ESC
        else if (event.keyCode === 27) {
            event.preventDefault();
            setAddressesResult([])
        }

        if (itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    };

    const [selectedIndex, setSelectedIndex] = useState(0); // موقعیت فعلی در لیست

    //هنگام نمایش لیست برای پیمایش بروی کلید های جهت نما گوش میدهد
    useEffect(() => {
        if (addressesResult?.length > 0) {
            // setSelectedIndex(0)
            document.addEventListener('keydown', handleKeyDown);
            // تابع پاکسازی که هنگام حذف کامپوننت اجرا می‌شود
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [addressesResult, selectedIndex])

    useEffect(() => {
        if (addressesResult?.length > 0) {
            setSelectedIndex(0)
        }
    }, [addressesResult])

    var [lockSearch, setLockSearch] = useState(false)

    const itemRefs = useRef([]); // ذخیره‌ی مرجع آیتم‌ها

    var onSelectAddress = (item) => {
        props?.onSelectAddress({ ...item, searchTerm })
        setLockSearch(true)
        setSearchTerm(item?.address)
        setAddressesResult([])
    }

    // بستن Dropdown هنگام کلیک بیرون
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setAddressesResult([])

        }
    };
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const dropdownRef = useRef(null);

    return <>
        <div className=" w-100 position-relative" ref={dropdownRef}>
            <input className={props?.className}
                onChange={(e) => {
                    setLockSearch(false)
                    var value = e.target.value
                    setSearchTerm(value)
                }}
                placeholder={props?.placeholder}
                disabled={props?.disabled}
                style={props?.style}
                ref={ref}
                onKeyDown={(e) => {
                    if (e.keyCode == 13 && addressesResult.length == 0) {
                        searchAddress(searchTerm)
                    }
                }}
                onBlur={() => {
                    setSearchTerm('')
                }}
                value={searchTerm}
            />

            {addressesResult.length > 0 ?
                <div className="card overflow-auto aScroll position-absolute" style={{ height: '15rem', zIndex: 10000 }}>

                    {addressesResult?.map((item, index) => {
                        return <div

                            key={index}
                            className={(selectedIndex == index ? " selected " : "") + " p-0 m-0 px-2 py-1 noSelect aPointer card-hover"}
                            ref={(el) => (itemRefs.current[index] = el)} // مرجع برای هر آیتم
                            onClick={() => {
                                onSelectAddress(item)
                            }}>

                            <p className="p-0 m-0 iranSansBold" style={{ fontSize: '0.8rem' }}>{item?.address?.includes(item?.title) ? '' : item?.title} {item?.address} </p>
                            <p className="p-0 m-0 opacity-50" style={{ fontSize: '0.7rem' }}>{item?.neighbourhood}</p>

                        </div>
                    })}

                </div>
                : <></>
            }

        </div>
    </>
})

export default SearchAddress