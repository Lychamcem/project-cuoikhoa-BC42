import axios from "axios";
import { CYBERSOFT_TOKEN, DOMAIN, TOKEN, USER_LOGIN } from "../util/settings/Config";

const axiosService = axios.create({
    baseURL: DOMAIN,
    headers: {
        TokenCybersoft: CYBERSOFT_TOKEN
    }
});

axiosService.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem(USER_LOGIN));
    if (user) {
        config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem(TOKEN))}`;
    }

    return config;
});

axiosService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response.status === 401) {
            localStorage.removeItem(USER_LOGIN);
            localStorage.removeItem(TOKEN);

            window.location.href = "/signin";
        }
    }
);

export default axiosService;