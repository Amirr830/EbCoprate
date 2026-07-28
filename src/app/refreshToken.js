import Storages from "./storages";
import { AxiosPublic } from "./axiosPublic";
import endpoints from "./endpoints";
var isProccessing = false

export const RefreshToken = async () => {

    console.log('ssssssssssssssssssssss', isProccessing)
    if (!isProccessing) {
        console.log('ssssssssssssssssssssss12', isProccessing)

        isProccessing = true
        try {
            var result = await AxiosPublic.get(endpoints.verify,
                {
                    params: {
                        refresh: Storages.getRefreshToken()
                    }
                })
            if (result.status === 200) {
                var at = result.data.accessToken
                var rt = result.data.refreshToken
                Storages.setRefreshToken(rt)
                Storages.setAccessToken(at)
                isProccessing = false

                return at;
            }
        } catch (err) {
            isProccessing = false

            if (err.response.status) {
                Storages.removeUserToken()
                window.location.reload(false)
            }
        }

    } else {
        setTimeout(()=>{
            return Storages.getAccessToken()
        },2000)
    }

}