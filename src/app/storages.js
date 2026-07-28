let Storages = (() => {

    const prefix = 'app_' // جلوگیری از تداخل

    const set = (key, value) => {
        try {
            if (value === undefined || value === null) {
                localStorage.removeItem(prefix + key)
            } else {
                localStorage.setItem(prefix + key, JSON.stringify(value))
            }
        } catch (e) {
            console.log(e)
        }
    }

    const get = (key) => {
        try {
            const value = localStorage.getItem(prefix + key)
            return value ? JSON.parse(value) : null
        } catch (e) {
            console.log(e)
            return null
        }
    }

    const remove = (key) => {
        try {
            localStorage.removeItem(prefix + key)
        } catch (e) {
            console.log(e)
        }
    }

    return {

        setAccessToken: (v) => set('accessToken', v),
        getAccessToken: () => get('accessToken'),

        setRefreshToken: (v) => set('refreshToken', v),
        getRefreshToken: () => get('refreshToken'),

        removeUserToken: () => {
            remove('accessToken')
            remove('refreshToken')
        },

        setHashedPhoneNumber: (v) => set('hashedPhoneNumber', v),
        getHashedPhoneNumber: () => get('hashedPhoneNumber'),

        setPassword: (v) => set('password', v),
        getPassword: () => get('password'),

        setUsername: (v) => set('username', v),
        getUsername: () => get('username'),

        setAllowReqAfterSec: (v) => set('allowReqAfterSec', v),
        getAllowReqAfterSec: () => get('allowReqAfterSec'),

        setUserInfo: (v) => set('userInfo', v),
        getUserInfo: () => get('userInfo'),

        setCities: (v) => set('cities', v),
        getCities: () => get('cities'),

        setLastActiveChanel: (v) => set('lastChanel', v),
        getLastActiveChanel: () => get('lastChanel'),

        setAccessLevel: (v) => set('accessLevel', v),
        getAccessLevel: () => get('accessLevel'),

        setDefaultMap: (v) => set('defaultMap', v),
        getDefaultMap: () => get('defaultMap'),

        setTileServer: (v) => set('tileServer', v),
        getTileServer: () => get('tileServer'),
    }

})()



export default Storages