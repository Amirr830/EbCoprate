import paths from '../app/paths.json'
export default  [
    {
        name: 'تعاریف',
        id: '1',
        sub: [
            {
                name: 'اطلاعات پایه',
                id: '1-1',
                sub: [
                    {
                        name: 'برند خودرو',
                        path: paths.private.carBrand,
                        id: '1-1-2',
                    },
                    {
                        name: 'تعریف کیوسک',
                        id: '1-1-5',
                    },
                    {
                        name: 'تعریف شیفت',
                        id: '1-1-6',
                    }
                ]
            },

            {
                name: 'اطلاعات خطوط',
                id: '1-2',
                sub: [
                    {
                        name: 'تعریف مبادی ورودی',
                        id: '1-2-1',
                    },
                    {
                        name: 'تعریف خطوط',
                        id: '1-2-2',
                    },
                    {
                        name: 'تعریف صف',
                        id: '1-2-3',
                    },
                    {
                        name: 'اماکن منتخب',
                        id: '1-2-4',
                    },
                    {
                        name: 'دستورات راهبند',
                        id: '1-2-5',
                    }

                ]
            },
            {
                name: 'اطلاعات نرخنامه',
                id: '1-3',
                sub: [

                    {
                        name: 'کلاس تاکسی',
                        id: '1-3-1',
                    },
                    {
                        name: 'نرخ نامه',
                        id: '1-3-2',
                    },
                    {
                        name: 'تعریف ابونمان',
                        id: '1-3-3',
                    },
                    {
                        name: 'سال مالی',
                        id: '1-3-4',
                    }
                ]
            },
            {
                name: 'اشخاص',
                id: '1-4',
                path: paths.private.persons
            },
            {
                name: 'خودرو',
                id: '1-5',
                path: paths.private.cars
            },

        ]
    },
    {
        name: 'عملیات روزانه',
        id: '2',
        sub: [
            {
                name: 'ثبت خروج از سرویس',
                id: '2-1',
            },
            {
                name: 'ارسال پیامک',
                id: '2-2',
            },
            {
                name: 'ثبت وضعیت جوی',
                id: '2-3',
            },
            {
                name: 'مدیریت اعزام',
                id: '2-4',
            }

        ]

    },
    {
        name: 'گزارشات',
        id: '3',
        path: paths.private.reports,
        sub: [
            {
                name: 'موقعیت خودرو ها',
                id: '3-3',
                path: paths.private.driverLocation,
            }
        ]

    },
    {
        name: "تنظیمات سامانه",
        path: "",
        id: '4',
        access: false,
        sub: [
            {
                name: <><span className="enFont">IP</span> تغییر</>,
                path: paths.private.changeIP,
                id: '4-1',
            }, {
                name: 'تهیه نسخه پشتیبان',
                path: paths.private.backup,
                id: '4-2',
            },
        ]
    }


]